import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ColorImagesModal from "./ColorImagesModal";

// The component renders purely from the hook's return value, so it's supplied as a
// plain object rather than being run - what's under test is that state maps to the
// right UI, not how that state was produced.
type ColorImages = Parameters<typeof ColorImagesModal>[0]["colorImages"];

const colorImages = (overrides: Partial<ColorImages> = {}): ColorImages =>
    ({
        isOpen: true,
        open: vi.fn(),
        close: vi.fn(),
        hasMainImage: true,
        hasColors: true,
        colors: ["#FF0000", "#00FF00"],
        needsPicking: false,
        selectedColors: ["#FF0000", "#00FF00"],
        toggleColor: vi.fn(),
        results: undefined,
        isGenerating: false,
        generate: vi.fn(),
        creditsRemaining: 10,
        creditsGrantedTotal: 10,
        includedInPlan: false,
        outOfCredits: false,
        ...overrides,
    }) as ColorImages;

describe("ColorImagesModal", () => {
    it("pre-selects and just asks to confirm when there are 4 or fewer colors", () => {
        render(<ColorImagesModal colorImages={colorImages()} />);

        expect(screen.getByText("#FF0000")).toBeTruthy();
        expect(screen.getByText("#00FF00")).toBeTruthy();
        expect(screen.getByText(/this will use 2 credits/i)).toBeTruthy();
        expect(screen.getByRole("button", { name: "Confirm" })).toBeTruthy();
    });

    it("requires picking up to 4 when there are more than 4 colors", () => {
        render(
            <ColorImagesModal
                colorImages={colorImages({
                    colors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF"],
                    needsPicking: true,
                    selectedColors: [],
                })}
            />
        );

        expect(screen.getByText(/this product has 5 colors/i)).toBeTruthy();
        expect(screen.getByRole("button", { name: "Generate" })).toBeTruthy();
        const confirmButton = (screen.getByRole("button", { name: "Generate" }) as HTMLButtonElement);
        expect(confirmButton.disabled).toBe(true);
    });

    it("toggles a color on click when picking is required", () => {
        const toggleColor = vi.fn();

        render(
            <ColorImagesModal
                colorImages={colorImages({
                    colors: ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF"],
                    needsPicking: true,
                    selectedColors: [],
                    toggleColor,
                })}
            />
        );

        screen.getByRole("button", { name: /#FF0000/i }).click();

        expect(toggleColor).toHaveBeenCalledWith("#FF0000");
    });

    it("calls generate on confirm", () => {
        const generate = vi.fn();

        render(<ColorImagesModal colorImages={colorImages({ generate })} />);

        screen.getByRole("button", { name: "Confirm" }).click();

        expect(generate).toHaveBeenCalledOnce();
    });

    it("blocks generating without a main image", () => {
        render(<ColorImagesModal colorImages={colorImages({ hasMainImage: false })} />);

        expect(screen.getByText(/add a main image first/i)).toBeTruthy();
        expect((screen.getByRole("button", { name: "Confirm" }) as HTMLButtonElement).disabled).toBe(true);
    });

    it("blocks generating without any product colors", () => {
        render(<ColorImagesModal colorImages={colorImages({ hasColors: false, colors: [], selectedColors: [] })} />);

        expect(screen.getByText(/add at least one product color/i)).toBeTruthy();
    });

    it("blocks generating when out of credits", () => {
        render(<ColorImagesModal colorImages={colorImages({ outOfCredits: true })} />);

        expect(screen.getByText(/out of ai image-editing credits/i)).toBeTruthy();
        expect((screen.getByRole("button", { name: "Confirm" }) as HTMLButtonElement).disabled).toBe(true);
    });

    it("shows each color's own status once results exist", () => {
        render(
            <ColorImagesModal
                colorImages={colorImages({
                    results: [
                        { hex: "#FF0000", status: "pending" },
                        { hex: "#00FF00", status: "done", url: "/uploads/green.png" },
                        { hex: "#0000FF", status: "error", error: "Couldn't generate this color." },
                    ],
                    isGenerating: true,
                })}
            />
        );

        expect(screen.getByText("#FF0000")).toBeTruthy();
        expect(screen.getByText("#00FF00")).toBeTruthy();
        expect(screen.getByText("Couldn't generate this color.")).toBeTruthy();
        expect(
            (screen.getByRole("button", { name: /generating… \(2\/3\)/i }) as HTMLButtonElement).disabled
        ).toBe(true);
    });

    it("lets the owner close once every color has settled", () => {
        const close = vi.fn();

        render(
            <ColorImagesModal
                colorImages={colorImages({
                    results: [{ hex: "#FF0000", status: "done", url: "/uploads/red.png" }],
                    isGenerating: false,
                    close,
                })}
            />
        );

        const doneButton = screen.getByRole("button", { name: /done — 1 of 1 generated/i }) as HTMLButtonElement;
        expect(doneButton.disabled).toBe(false);

        doneButton.click();
        expect(close).toHaveBeenCalledOnce();
    });
});
