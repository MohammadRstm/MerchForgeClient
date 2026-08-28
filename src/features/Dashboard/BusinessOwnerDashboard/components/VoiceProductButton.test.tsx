import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ProductDraft } from "../types";
import VoiceProductButton from "./VoiceProductButton";

// The component renders from the hook's return value alone, so it's supplied as a
// plain object rather than being run - what is under test is that state maps to
// the right UI, not how that state was produced.
type VoiceDraft = Parameters<typeof VoiceProductButton>[0]["voiceDraft"];

const draft = (overrides: Partial<ProductDraft> = {}): ProductDraft => ({
    id: "11111111-1111-4111-8111-111111111111",
    status: "CollectingInformation",
    messages: [],
    draft: null,
    missingFields: [],
    originalImageUrl: null,
    processedImageUrl: null,
    imageModificationPrompt: null,
    canConfirm: false,
    productId: null,
    ...overrides,
});

const voiceDraft = (overrides: Partial<VoiceDraft> = {}): VoiceDraft =>
    ({
        isActive: false,
        start: vi.fn(),
        close: vi.fn(),
        cancel: vi.fn(),
        draft: undefined,
        isStarting: false,
        isBusy: false,
        isConfirming: false,
        error: undefined,
        includedInPlan: false,
        outOfCredits: false,
        attachImageIfFirst: vi.fn(),
        resolveImage: vi.fn(),
        confirm: vi.fn(),
        voice: {
            isSupported: true,
            isRecording: false,
            error: undefined,
            waveform: [],
            elapsedMs: 0,
            start: vi.fn(),
            stop: vi.fn(),
            cancel: vi.fn(),
        },
        ...overrides,
    }) as VoiceDraft;

describe("VoiceProductButton", () => {
    it("renders an idle mic button before any draft exists", () => {
        render(<VoiceProductButton voiceDraft={voiceDraft()} />);

        expect(screen.getByRole("button", { name: /add with/i })).toBeTruthy();
    });

    it("starts a draft on first press", () => {
        const start = vi.fn();

        render(<VoiceProductButton voiceDraft={voiceDraft({ start })} />);

        screen.getByRole("button", { name: /add with/i }).click();

        expect(start).toHaveBeenCalledOnce();
    });

    it("begins another recording instead of restarting the draft once one is active", () => {
        const start = vi.fn();
        const voiceStart = vi.fn();

        render(
            <VoiceProductButton
                voiceDraft={voiceDraft({
                    isActive: true,
                    draft: draft(),
                    start,
                    voice: { isSupported: true, isRecording: false, error: undefined, waveform: [], elapsedMs: 0, start: voiceStart, stop: vi.fn(), cancel: vi.fn() },
                })}
            />
        );

        screen.getByRole("button", { name: /add with/i }).click();

        expect(voiceStart).toHaveBeenCalledOnce();
        expect(start).not.toHaveBeenCalled();
    });

    it("shows a processing state inside the button once a recording is sent for transcription", () => {
        render(
            <VoiceProductButton
                voiceDraft={voiceDraft({
                    isActive: true,
                    isBusy: true,
                    draft: draft(),
                    voice: { isSupported: true, isRecording: false, error: undefined, waveform: [], elapsedMs: 0, start: vi.fn(), stop: vi.fn(), cancel: vi.fn() },
                })}
            />
        );

        const button = screen.getByRole("button", { name: /processing/i });
        expect(button.hasAttribute("disabled")).toBe(true);
        // Not the idle label — otherwise pressing again mid-turn would look possible.
        expect(screen.queryByText(/^add with/i)).toBeNull();
    });

    it("stops recording on press while recording", () => {
        const stop = vi.fn();

        render(
            <VoiceProductButton
                voiceDraft={voiceDraft({
                    isActive: true,
                    draft: draft(),
                    voice: { isSupported: true, isRecording: true, error: undefined, waveform: [0.2, 0.5], elapsedMs: 3200, start: vi.fn(), stop, cancel: vi.fn() },
                })}
            />
        );

        screen.getByRole("button", { name: /^stop$/i }).click();

        expect(stop).toHaveBeenCalledOnce();
    });

    it("shows the waveform pill while recording", () => {
        render(
            <VoiceProductButton
                voiceDraft={voiceDraft({
                    isActive: true,
                    draft: draft(),
                    voice: { isSupported: true, isRecording: true, error: undefined, waveform: [0.1, 0.4, 0.9], elapsedMs: 5000, start: vi.fn(), stop: vi.fn(), cancel: vi.fn() },
                })}
            />
        );

        expect(screen.getByText("0:05")).toBeTruthy();
    });

    it("discarding the draft calls cancel", () => {
        const cancel = vi.fn();

        render(
            <VoiceProductButton
                voiceDraft={voiceDraft({ isActive: true, draft: draft(), cancel })}
            />
        );

        screen.getByRole("button", { name: /discard ai draft/i }).click();

        expect(cancel).toHaveBeenCalledOnce();
    });

    it("disables the button when the browser cannot record", () => {
        render(
            <VoiceProductButton
                voiceDraft={voiceDraft({
                    voice: { isSupported: false, isRecording: false, error: undefined, waveform: [], elapsedMs: 0, start: vi.fn(), stop: vi.fn(), cancel: vi.fn() },
                })}
            />
        );

        const button = screen.getByRole("button", { name: /add with/i });
        expect(button.hasAttribute("disabled")).toBe(true);
    });

    it("disables the button when the business isn't entitled to AI product creation", () => {
        const start = vi.fn();

        render(<VoiceProductButton voiceDraft={voiceDraft({ start, outOfCredits: true })} />);

        const button = screen.getByRole("button", { name: /add with/i });
        expect(button.hasAttribute("disabled")).toBe(true);

        button.click();
        expect(start).not.toHaveBeenCalled();
    });

    it("does not block continuing an already-active draft even if entitlement is lost mid-session", () => {
        render(
            <VoiceProductButton
                voiceDraft={voiceDraft({
                    isActive: true,
                    draft: draft(),
                    outOfCredits: true,
                    voice: { isSupported: true, isRecording: false, error: undefined, waveform: [], elapsedMs: 0, start: vi.fn(), stop: vi.fn(), cancel: vi.fn() },
                })}
            />
        );

        const button = screen.getByRole("button", { name: /add with/i });
        expect(button.hasAttribute("disabled")).toBe(false);
    });

    it("stacks the credit tracker above the audio tracker while recording", () => {
        const { container } = render(
            <VoiceProductButton
                voiceDraft={voiceDraft({
                    isActive: true,
                    draft: draft(),
                    voice: { isSupported: true, isRecording: true, error: undefined, waveform: [0.3], elapsedMs: 1000, start: vi.fn(), stop: vi.fn(), cancel: vi.fn() },
                })}
            />
        );

        const stack = container.querySelector(".voice-product-button__stack");
        const creditPill = stack?.querySelector(".voice-product-button__controls");
        const audioPill = stack?.querySelector(".ai-chat__recording");

        expect(creditPill).toBeTruthy();
        expect(audioPill).toBeTruthy();

        // DOCUMENT_POSITION_FOLLOWING means audioPill comes after creditPill in
        // source order, which — under the stack's plain column flex-direction —
        // is what puts the credit tracker visually above the audio tracker.
        const position = creditPill!.compareDocumentPosition(audioPill!);
        expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it("surfaces an error to the owner", () => {
        render(
            <VoiceProductButton
                voiceDraft={voiceDraft({ isActive: true, draft: draft(), error: "Couldn't send that recording." })}
            />
        );

        expect(screen.getByRole("alert").textContent).toContain("Couldn't send that recording.");
    });
});
