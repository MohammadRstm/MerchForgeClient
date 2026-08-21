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
    sendProductDraftMessageService: vi.fn(),
    sendProductDraftVoiceService: vi.fn(),
    attachProductDraftImageService: vi.fn(),
    resolveProductDraftImageService: vi.fn(),
    confirmProductDraftService: vi.fn(),
    cancelProductDraftService: vi.fn(),
}));

import * as api from "../../../../../services/api/productDrafts.api";
import useProductAiChat from "./useProductAiChat";

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

const renderChat = (onProductCreated = vi.fn()) =>
    renderHook(() => useProductAiChat(BUSINESS_ID, onProductCreated), { wrapper });

describe("useProductAiChat", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("starts closed with no draft", () => {
        const { result } = renderChat();

        expect(result.current.isOpen).toBe(false);
        expect(result.current.draft).toBeUndefined();
    });

    it("opening starts a conversation and stores the returned draft", async () => {
        vi.mocked(api.startProductDraftService).mockResolvedValue(draft());

        const { result } = renderChat();

        act(() => result.current.open());

        expect(result.current.isOpen).toBe(true);
        await waitFor(() => expect(result.current.draft).toBeDefined());
        expect(result.current.draft!.messages[0].text).toBe("Hi!");
    });

    it("closing clears the conversation so reopening does not show a stale one", async () => {
        vi.mocked(api.startProductDraftService).mockResolvedValue(draft());

        const { result } = renderChat();

        act(() => result.current.open());
        await waitFor(() => expect(result.current.draft).toBeDefined());

        act(() => result.current.close());

        expect(result.current.isOpen).toBe(false);
        expect(result.current.draft).toBeUndefined();
    });

    it("sending a message replaces the draft with the backend's new state", async () => {
        vi.mocked(api.startProductDraftService).mockResolvedValue(draft());
        vi.mocked(api.sendProductDraftMessageService).mockResolvedValue(
            draft({
                status: "WaitingForProductApproval",
                canConfirm: true,
                draft: {
                    title: "Pizza",
                    description: "Cheesy.",
                    price: 14.5,
                    compareAtPrice: null,
                    categoryId: null,
                    categoryName: "Pizza",
                    sku: null,
                    stockQuantity: null,
                    tags: [],
                    saleEndsAt: null,
                    metadata: null,
                },
            })
        );

        const { result } = renderChat();

        act(() => result.current.open());
        await waitFor(() => expect(result.current.draft).toBeDefined());

        act(() => result.current.setMessageInput("a pizza for $14.50"));
        act(() => result.current.sendMessage());

        await waitFor(() => expect(result.current.draft!.canConfirm).toBe(true));
        expect(result.current.draft!.status).toBe("WaitingForProductApproval");
        expect(result.current.draft!.draft!.title).toBe("Pizza");
    });

    it("clears the composer on send so the message is not sent twice", async () => {
        vi.mocked(api.startProductDraftService).mockResolvedValue(draft());
        vi.mocked(api.sendProductDraftMessageService).mockResolvedValue(draft());

        const { result } = renderChat();

        act(() => result.current.open());
        await waitFor(() => expect(result.current.draft).toBeDefined());

        act(() => result.current.setMessageInput("hello"));
        act(() => result.current.sendMessage());

        expect(result.current.messageInput).toBe("");
    });

    it("restores what was typed when a turn fails", async () => {
        vi.mocked(api.startProductDraftService).mockResolvedValue(draft());
        vi.mocked(api.sendProductDraftMessageService).mockRejectedValue(
            new ApiError(
                { type: "Unexpected", code: "AI_CONVERSATION_FAILED", message: "The assistant is unavailable right now.", traceId: "t" },
                500
            )
        );

        const { result } = renderChat();

        act(() => result.current.open());
        await waitFor(() => expect(result.current.draft).toBeDefined());

        act(() => result.current.setMessageInput("a pizza for $14.50"));
        act(() => result.current.sendMessage());

        // Losing the message on a transient failure would mean retyping it.
        await waitFor(() => expect(result.current.messageInput).toBe("a pizza for $14.50"));
        expect(result.current.error).toBe("The assistant is unavailable right now.");
    });

    it("shows the server's message rather than a generic one", async () => {
        vi.mocked(api.startProductDraftService).mockResolvedValue(draft());
        vi.mocked(api.attachProductDraftImageService).mockRejectedValue(
            new ApiError(
                { type: "Validation", code: "INVALID_PRODUCT_IMAGE", message: "Images must be 5 MB or smaller.", traceId: "t" },
                400
            )
        );

        const { result } = renderChat();

        act(() => result.current.open());
        await waitFor(() => expect(result.current.draft).toBeDefined());

        act(() => result.current.attachImage(new File(["x"], "p.png", { type: "image/png" })));

        await waitFor(() => expect(result.current.error).toBe("Images must be 5 MB or smaller."));
    });

    it("does not send an empty or whitespace-only message", async () => {
        vi.mocked(api.startProductDraftService).mockResolvedValue(draft());

        const { result } = renderChat();

        act(() => result.current.open());
        await waitFor(() => expect(result.current.draft).toBeDefined());

        act(() => result.current.setMessageInput("   "));
        act(() => result.current.sendMessage());

        expect(api.sendProductDraftMessageService).not.toHaveBeenCalled();
    });

    it("approving an edited image sends the approval and takes the new state", async () => {
        vi.mocked(api.startProductDraftService).mockResolvedValue(
            draft({ status: "WaitingForImageApproval", processedImageUrl: "/uploads/edited.png" })
        );
        vi.mocked(api.resolveProductDraftImageService).mockResolvedValue(
            draft({ status: "CollectingInformation", originalImageUrl: "/uploads/edited.png" })
        );

        const { result } = renderChat();

        act(() => result.current.open());
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

    it("confirming reports the new product and closes the chat", async () => {
        const onProductCreated = vi.fn();

        vi.mocked(api.startProductDraftService).mockResolvedValue(draft({ canConfirm: true }));
        vi.mocked(api.confirmProductDraftService).mockResolvedValue({
            id: "44444444-4444-4444-8444-444444444444",
        } as never);

        const { result } = renderChat(onProductCreated);

        act(() => result.current.open());
        await waitFor(() => expect(result.current.draft).toBeDefined());

        act(() => result.current.confirm());

        await waitFor(() => expect(onProductCreated).toHaveBeenCalledOnce());
        expect(result.current.isOpen).toBe(false);
    });

    it("keeps the chat open when confirmation is rejected", async () => {
        const onProductCreated = vi.fn();

        vi.mocked(api.startProductDraftService).mockResolvedValue(draft({ canConfirm: true }));
        vi.mocked(api.confirmProductDraftService).mockRejectedValue(
            new ApiError(
                { type: "Conflict", code: "PRODUCT_DRAFT_INVALID_STATE", message: "The product is still missing: price.", traceId: "t" },
                409
            )
        );

        const { result } = renderChat(onProductCreated);

        act(() => result.current.open());
        await waitFor(() => expect(result.current.draft).toBeDefined());

        act(() => result.current.confirm());

        await waitFor(() => expect(result.current.error).toContain("still missing"));

        // Closing here would strand the owner with no way back to the conversation.
        expect(result.current.isOpen).toBe(true);
        expect(onProductCreated).not.toHaveBeenCalled();
    });

    it("cancelling tells the backend and closes even if that call fails", async () => {
        vi.mocked(api.startProductDraftService).mockResolvedValue(draft());
        vi.mocked(api.cancelProductDraftService).mockRejectedValue(new Error("network"));

        const { result } = renderChat();

        act(() => result.current.open());
        await waitFor(() => expect(result.current.draft).toBeDefined());

        act(() => result.current.cancel());

        // The owner asked to leave; a failed cleanup call must not trap them.
        await waitFor(() => expect(result.current.isOpen).toBe(false));
        expect(api.cancelProductDraftService).toHaveBeenCalled();
    });
});
