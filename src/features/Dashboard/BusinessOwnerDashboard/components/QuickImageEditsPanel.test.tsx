import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import QuickImageEditsPanel from "./QuickImageEditsPanel";

// The component renders purely from the hook's return value, so it's supplied as
// a plain object rather than being run - what's under test is that state maps to
// the right UI, not how that state was produced.
type QuickEdits = Parameters<typeof QuickImageEditsPanel>[0]["quickEdits"];

const quickEdits = (overrides: Partial<QuickEdits> = {}): QuickEdits =>
    ({
        isOpen: true,
        isSelecting: true,
        actionKey: "remove-background",
        open: vi.fn(),
        selectedUrls: new Set<string>(),
        toggleSelect: vi.fn(),
        results: undefined,
        isGenerating: false,
        processingImageUrls: new Set<string>(),
        confirm: vi.fn(),
        close: vi.fn(),
        creditsRemaining: 10,
        creditsGrantedTotal: 10,
        includedInPlan: false,
        ...overrides,
    }) as QuickEdits;

describe("QuickImageEditsPanel", () => {
    it("renders nothing when closed", () => {
        const { container } = render(<QuickImageEditsPanel quickEdits={quickEdits({ isOpen: false })} />);

        expect(container.firstChild).toBeNull();
    });

    it("shows the action label and a hint before anything is selected", () => {
        render(<QuickImageEditsPanel quickEdits={quickEdits()} />);

        expect(screen.getByText("Remove background")).toBeTruthy();
        expect(screen.getByText(/select the image/i)).toBeTruthy();
    });

    it("updates the live cost line as images are selected", () => {
        render(
            <QuickImageEditsPanel
                quickEdits={quickEdits({ selectedUrls: new Set(["/a.png", "/b.png"]) })}
            />
        );

        expect(screen.getByText(/2 images selected — 2 credits/i)).toBeTruthy();
    });

    it("disables Confirm until an image is selected", () => {
        render(<QuickImageEditsPanel quickEdits={quickEdits()} />);

        const button = screen.getByRole("button", { name: "Confirm" }) as HTMLButtonElement;
        expect(button.disabled).toBe(true);
    });

    it("calls confirm once an image is selected", () => {
        const confirm = vi.fn();

        render(
            <QuickImageEditsPanel
                quickEdits={quickEdits({ selectedUrls: new Set(["/a.png"]), confirm })}
            />
        );

        screen.getByRole("button", { name: "Confirm" }).click();

        expect(confirm).toHaveBeenCalledOnce();
    });

    it("shows each image's own progress once results exist", () => {
        render(
            <QuickImageEditsPanel
                quickEdits={quickEdits({
                    isSelecting: false,
                    results: [
                        { url: "/a.png", status: "pending" },
                        { url: "/b.png", status: "done" },
                        { url: "/c.png", status: "error", error: "Couldn't update this image." },
                    ],
                    isGenerating: true,
                })}
            />
        );

        expect(screen.getByText("Updating…")).toBeTruthy();
        expect(screen.getByText("Done")).toBeTruthy();
        expect(screen.getByText("Couldn't update this image.")).toBeTruthy();
        expect(
            (screen.getByRole("button", { name: /updating… \(2\/3\)/i }) as HTMLButtonElement).disabled
        ).toBe(true);
    });

    it("lets the owner close once every image has settled", () => {
        const close = vi.fn();

        render(
            <QuickImageEditsPanel
                quickEdits={quickEdits({
                    isSelecting: false,
                    results: [{ url: "/a.png", status: "done" }],
                    isGenerating: false,
                    close,
                })}
            />
        );

        const doneButton = screen.getByRole("button", { name: /done — 1 of 1 updated/i }) as HTMLButtonElement;
        expect(doneButton.disabled).toBe(false);

        doneButton.click();
        expect(close).toHaveBeenCalledOnce();
    });
});
