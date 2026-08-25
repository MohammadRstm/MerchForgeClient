import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../../../../../Error/ApiError";
import type { ProductDraft } from "../../types";

// Mocked at the service boundary: these tests are about the hook's state
// transitions, so the network - and any AI provider behind it - is irrelevant.
vi.mock("../../../../../services/api/productDrafts.api", () => ({
    startProductDraftService: vi.fn(),
    sendProductDraftVoiceService: vi.fn(),
    attachProductDraftImageService: vi.fn(),
    resolveProductDraftImageService: vi.fn(),
    confirmProductDraftService: vi.fn(),
    cancelProductDraftService: vi.fn(),
}));

// Mocked so a test can trigger "a recording just finished" on demand, rather
// than driving a real MediaRecorder (unavailable in jsdom regardless) — this is
// what lets the regression test below reproduce the exact race that used to
// drop recordings silently.
vi.mock("./useVoiceRecorder", () => ({ default: vi.fn() }));

import * as api from "../../../../../services/api/productDrafts.api";
import useVoiceRecorder from "./useVoiceRecorder";
import useVoiceProductDraft from "./useVoiceProductDraft";

const BUSINESS_ID = "33333333-3333-4333-8333-333333333333";

const draft = (overrides: Partial<ProductDraft> = {}): ProductDraft => ({
    id: "11111111-1111-4111-8111-111111111111",
    status: "CollectingInformation",
    messages: [{ role: "assistant", text: "Hi!", kind: "text", at: "2026-02-01T10:00:00Z" }],
    draft: null,
    missingFields: [],
    originalImageUrl: null,
    processedImageUrl: null,
    imageModificationPrompt: null,
    canConfirm: false,
    productId: null,
    ...overrides,
});

const wrapper = ({ children }: { children: ReactNode }) => {
    // Retries off so a rejected mutation surfaces immediately instead of being
    // retried behind the test's back.
    const client = new QueryClient({
        defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
    });

    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

const renderVoiceDraft = (onProductCreated = vi.fn()) =>
    renderHook(() => useVoiceProductDraft(BUSINESS_ID, onProductCreated), { wrapper });

/**
 * The onRecorded callback bound at the moment recording actually started —
 * captured inside the mocked start(), not on every render, to mirror how the
 * real MediaRecorder.onstop handler is set up once per recording and does not
 * get swapped out by later re-renders the way a fresh closure would be.
 */
let capturedOnRecorded: ((audio: Blob) => void) | undefined;

describe("useVoiceProductDraft", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        capturedOnRecorded = undefined;

        vi.mocked(useVoiceRecorder).mockImplementation((onRecorded) => ({
            isSupported: true,
            isRecording: false,
            error: undefined,
            waveform: [],
            elapsedMs: 0,
            start: vi.fn(async () => {
                capturedOnRecorded = onRecorded;
            }),
            stop: vi.fn(),
            cancel: vi.fn(),
        }));
    });

    it("starts inactive with no draft", () => {
        const { result } = renderVoiceDraft();

        expect(result.current.isActive).toBe(false);
        expect(result.current.draft).toBeUndefined();
    });

    it("pressing the mic starts a draft and stores the returned state", async () => {
        vi.mocked(api.startProductDraftService).mockResolvedValue(draft());

        const { result } = renderVoiceDraft();

        await act(async () => {
            await result.current.start();
        });

        expect(result.current.isActive).toBe(true);
        await waitFor(() => expect(result.current.draft).toBeDefined());
        expect(result.current.draft!.id).toBe("11111111-1111-4111-8111-111111111111");
    });

    it("sends a finished recording to the draft even though it was still undefined when recording began", async () => {
        // Reproduces the exact race that silently dropped every first recording:
        // start() fires the draft-creation request and begins recording in the
        // same tick, so the draft is still undefined at the moment recording
        // starts. It only resolves afterward. A recording that finishes after
        // that point must still be sent to the draft that exists by then, not
        // discarded because of what existed when recording began.
        vi.mocked(api.startProductDraftService).mockResolvedValue(draft());
        vi.mocked(api.sendProductDraftVoiceService).mockResolvedValue(draft());

        const { result } = renderVoiceDraft();

        await act(async () => {
            await result.current.start();
        });
        await waitFor(() => expect(result.current.draft).toBeDefined());

        const audio = new Blob(["x"], { type: "audio/webm" });
        act(() => capturedOnRecorded?.(audio));

        await waitFor(() => expect(api.sendProductDraftVoiceService).toHaveBeenCalledTimes(1));
        expect(api.sendProductDraftVoiceService).toHaveBeenCalledWith(
            BUSINESS_ID,
            result.current.draft!.id,
            audio
        );
    });

    it("discards an in-progress recording instead of sending it when the draft is cancelled", async () => {
        // Closing the product modal mid-recording routes here (ProductModal's
        // handleClose always calls cancel() while a draft is active). What's
        // being said must never reach the backend for a draft that's about to
        // be thrown away — that would process, and spend a credit on, a turn
        // for a conversation the owner just abandoned.
        vi.mocked(api.startProductDraftService).mockResolvedValue(draft());
        vi.mocked(api.cancelProductDraftService).mockResolvedValue(draft({ status: "Cancelled" }));

        const voiceCancel = vi.fn();
        let isRecording = false;

        vi.mocked(useVoiceRecorder).mockImplementation((onRecorded) => ({
            isSupported: true,
            get isRecording() {
                return isRecording;
            },
            error: undefined,
            waveform: [],
            elapsedMs: 0,
            start: vi.fn(async () => {
                capturedOnRecorded = onRecorded;
            }),
            stop: vi.fn(),
            cancel: voiceCancel,
        }));

        const { result, rerender } = renderVoiceDraft();

        await act(async () => {
            await result.current.start();
        });
        await waitFor(() => expect(result.current.draft).toBeDefined());

        // The owner is mid-recording when they close the modal.
        isRecording = true;
        rerender();

        act(() => result.current.cancel());

        expect(voiceCancel).toHaveBeenCalledOnce();
        expect(api.sendProductDraftVoiceService).not.toHaveBeenCalled();
    });

    it("cancelling clears the draft so pressing the mic again does not show a stale one", async () => {
        vi.mocked(api.startProductDraftService).mockResolvedValue(draft());
        vi.mocked(api.cancelProductDraftService).mockResolvedValue(draft({ status: "Cancelled" }));

        const { result } = renderVoiceDraft();

        await act(async () => {
            await result.current.start();
        });
        await waitFor(() => expect(result.current.draft).toBeDefined());

        act(() => result.current.cancel());

        await waitFor(() => expect(result.current.isActive).toBe(false));
        expect(result.current.draft).toBeUndefined();
    });

    it("attaches the first uploaded image to the draft", async () => {
        vi.mocked(api.startProductDraftService).mockResolvedValue(draft());
        vi.mocked(api.attachProductDraftImageService).mockResolvedValue(
            draft({ originalImageUrl: "/uploads/products/p.png" })
        );

        const { result } = renderVoiceDraft();

        await act(async () => {
            await result.current.start();
        });
        await waitFor(() => expect(result.current.draft).toBeDefined());

        act(() => result.current.attachImageIfFirst(new File(["x"], "p.png", { type: "image/png" })));

        await waitFor(() =>
            expect(result.current.draft!.originalImageUrl).toBe("/uploads/products/p.png")
        );
        expect(api.attachProductDraftImageService).toHaveBeenCalledTimes(1);
    });

    it("does not re-attach a second image once the draft already has one", async () => {
        vi.mocked(api.startProductDraftService).mockResolvedValue(
            draft({ originalImageUrl: "/uploads/products/first.png" })
        );

        const { result } = renderVoiceDraft();

        await act(async () => {
            await result.current.start();
        });
        await waitFor(() => expect(result.current.draft).toBeDefined());

        act(() => result.current.attachImageIfFirst(new File(["y"], "second.png", { type: "image/png" })));

        // Spending an AI turn (and a credit) to re-sync an image that would be
        // discarded at confirmation anyway would silently burn credits for
        // nothing, so the second image must never reach the API.
        expect(api.attachProductDraftImageService).not.toHaveBeenCalled();
    });

    it("shows the server's message rather than a generic one", async () => {
        vi.mocked(api.startProductDraftService).mockResolvedValue(draft());
        vi.mocked(api.attachProductDraftImageService).mockRejectedValue(
            new ApiError(
                { type: "Validation", code: "INVALID_PRODUCT_IMAGE", message: "Images must be 5 MB or smaller.", traceId: "t" },
                400
            )
        );

        const { result } = renderVoiceDraft();

        await act(async () => {
            await result.current.start();
        });
        await waitFor(() => expect(result.current.draft).toBeDefined());

        act(() => result.current.attachImageIfFirst(new File(["x"], "p.png", { type: "image/png" })));

        await waitFor(() => expect(result.current.error).toBe("Images must be 5 MB or smaller."));
    });

    it("approving an edited image sends the approval and takes the new state", async () => {
        vi.mocked(api.startProductDraftService).mockResolvedValue(
            draft({ status: "WaitingForImageApproval", processedImageUrl: "/uploads/edited.png" })
        );
        vi.mocked(api.resolveProductDraftImageService).mockResolvedValue(
            draft({ status: "CollectingInformation", originalImageUrl: "/uploads/edited.png" })
        );

        const { result } = renderVoiceDraft();

        await act(async () => {
            await result.current.start();
        });
        await waitFor(() => expect(result.current.draft).toBeDefined());

        act(() => result.current.resolveImage(true));

        await waitFor(() => expect(result.current.draft!.status).toBe("CollectingInformation"));
        expect(api.resolveProductDraftImageService).toHaveBeenCalledWith(
            BUSINESS_ID,
            expect.any(String),
            true
        );
        expect(result.current.draft!.originalImageUrl).toBe("/uploads/edited.png");
    });

    it("confirming reports the new product and deactivates the draft", async () => {
        const onProductCreated = vi.fn();

        vi.mocked(api.startProductDraftService).mockResolvedValue(draft({ canConfirm: true }));
        vi.mocked(api.confirmProductDraftService).mockResolvedValue({
            id: "44444444-4444-4444-8444-444444444444",
        } as never);

        const { result } = renderVoiceDraft(onProductCreated);

        await act(async () => {
            await result.current.start();
        });
        await waitFor(() => expect(result.current.draft).toBeDefined());

        act(() => result.current.confirm());

        await waitFor(() => expect(onProductCreated).toHaveBeenCalledOnce());
        expect(result.current.isActive).toBe(false);
    });

    it("stays active when confirmation is rejected", async () => {
        const onProductCreated = vi.fn();

        vi.mocked(api.startProductDraftService).mockResolvedValue(draft({ canConfirm: true }));
        vi.mocked(api.confirmProductDraftService).mockRejectedValue(
            new ApiError(
                { type: "Conflict", code: "PRODUCT_DRAFT_INVALID_STATE", message: "The product is still missing: price.", traceId: "t" },
                409
            )
        );

        const { result } = renderVoiceDraft(onProductCreated);

        await act(async () => {
            await result.current.start();
        });
        await waitFor(() => expect(result.current.draft).toBeDefined());

        act(() => result.current.confirm());

        await waitFor(() => expect(result.current.error).toContain("still missing"));

        // Deactivating here would strand the owner with no way back to the draft.
        expect(result.current.isActive).toBe(true);
        expect(onProductCreated).not.toHaveBeenCalled();
    });

    it("cancelling tells the backend and deactivates even if that call fails", async () => {
        vi.mocked(api.startProductDraftService).mockResolvedValue(draft());
        vi.mocked(api.cancelProductDraftService).mockRejectedValue(new Error("network"));

        const { result } = renderVoiceDraft();

        await act(async () => {
            await result.current.start();
        });
        await waitFor(() => expect(result.current.draft).toBeDefined());

        act(() => result.current.cancel());

        // The owner asked to leave; a failed cleanup call must not trap them.
        await waitFor(() => expect(result.current.isActive).toBe(false));
        expect(api.cancelProductDraftService).toHaveBeenCalled();
    });
});
