import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MultiAngleImagesModal from "./MultiAngleImagesModal";

// The component renders purely from the hook's return value, so it's supplied as a
// plain object rather than being run - what's under test is that state maps to the
// right UI, not how that state was produced.
type MultiAngle = Parameters<typeof MultiAngleImagesModal>[0]["multiAngle"];

const multiAngle = (overrides: Partial<MultiAngle> = {}): MultiAngle =>
    ({
        isOpen: true,
        open: vi.fn(),
        close: vi.fn(),
        hasMainImage: true,
        selectedKeys: [],
        toggleAngle: vi.fn(),
        results: undefined,
        isGenerating: false,
        generate: vi.fn(),
        creditsRemaining: 10,
        creditsGrantedTotal: 10,
        includedInPlan: false,
        ...overrides,
    }) as MultiAngle;

describe("MultiAngleImagesModal", () => {
    it("shows the angle presets and a cost hint while picking", () => {
        render(<MultiAngleImagesModal multiAngle={multiAngle()} />);

        expect(screen.getByRole("button", { name: /front view/i })).toBeTruthy();
        expect(screen.getByText(/1 credit per angle/i)).toBeTruthy();
    });

    it("updates the cost line as angles are selected", () => {
        render(<MultiAngleImagesModal multiAngle={multiAngle({ selectedKeys: ["front", "back"] })} />);

        expect(screen.getByText(/this will use 2 credits/i)).toBeTruthy();
    });

    it("toggles an angle on click", () => {
        const toggleAngle = vi.fn();

        render(<MultiAngleImagesModal multiAngle={multiAngle({ toggleAngle })} />);

        screen.getByRole("button", { name: /front view/i }).click();

        expect(toggleAngle).toHaveBeenCalledWith("front");
    });

    it("disables Generate until an angle is picked", () => {
        render(<MultiAngleImagesModal multiAngle={multiAngle()} />);

        const button = screen.getByRole("button", { name: "Generate" }) as HTMLButtonElement;
        expect(button.disabled).toBe(true);
    });

    it("calls generate on confirm once an angle is selected", () => {
        const generate = vi.fn();

        render(<MultiAngleImagesModal multiAngle={multiAngle({ selectedKeys: ["front"], generate })} />);

        screen.getByRole("button", { name: "Generate" }).click();

        expect(generate).toHaveBeenCalledOnce();
    });

    it("blocks generating without a main image", () => {
        render(<MultiAngleImagesModal multiAngle={multiAngle({ hasMainImage: false, selectedKeys: ["front"] })} />);

        expect(screen.getByText(/add a main image first/i)).toBeTruthy();
        expect((screen.getByRole("button", { name: "Generate" }) as HTMLButtonElement).disabled).toBe(true);
    });

    it("blocks generating when out of credits", () => {
        render(
            <MultiAngleImagesModal
                multiAngle={multiAngle({ selectedKeys: ["front"], creditsRemaining: 0 })}
            />
        );

        expect(screen.getByText(/out of ai image-editing credits/i)).toBeTruthy();
        expect((screen.getByRole("button", { name: "Generate" }) as HTMLButtonElement).disabled).toBe(true);
    });

    it("shows each angle's own status once results exist", () => {
        render(
            <MultiAngleImagesModal
                multiAngle={multiAngle({
                    results: [
                        { key: "front", label: "Front view", status: "pending" },
                        { key: "back", label: "Back view", status: "done", url: "/uploads/back.png" },
                        { key: "left", label: "Left side", status: "error", error: "Couldn't generate this angle." },
                    ],
                    isGenerating: true,
                })}
            />
        );

        expect(screen.getByText("Front view")).toBeTruthy();
        expect(screen.getByText("Back view")).toBeTruthy();
        expect(screen.getByText("Couldn't generate this angle.")).toBeTruthy();
        expect(
            (screen.getByRole("button", { name: /generating… \(2\/3\)/i }) as HTMLButtonElement).disabled
        ).toBe(true);
    });

    it("lets the owner close once every angle has settled", () => {
        const close = vi.fn();

        render(
            <MultiAngleImagesModal
                multiAngle={multiAngle({
                    results: [
                        { key: "front", label: "Front view", status: "done", url: "/uploads/front.png" },
                    ],
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
