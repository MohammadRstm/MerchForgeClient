import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ImageToolsMenuModal from "./ImageToolsMenuModal";

type Props = Parameters<typeof ImageToolsMenuModal>[0];

const baseProps = (overrides: Partial<Props> = {}): Props =>
    ({
        isOpen: true,
        onClose: vi.fn(),
        imageEditChat: { open: vi.fn() },
        multiAngle: { open: vi.fn() },
        colorImages: { open: vi.fn(), hasColors: true },
        quickImageEdits: { open: vi.fn() },
        suggestDetails: { open: vi.fn() },
        ...overrides,
    }) as unknown as Props;

describe("ImageToolsMenuModal", () => {
    it("lists all six image-tool options", () => {
        render(<ImageToolsMenuModal {...baseProps()} />);

        expect(screen.getByText("Custom edit")).toBeTruthy();
        expect(screen.getByText("Generate in multiple angles")).toBeTruthy();
        expect(screen.getByText("Add images with colors")).toBeTruthy();
        expect(screen.getByText("Remove background")).toBeTruthy();
        expect(screen.getByText("Enhance photo")).toBeTruthy();
        expect(screen.getByText("Suggest details from photo")).toBeTruthy();
    });

    it("opens the custom edit chat and closes the menu on select", () => {
        const open = vi.fn();
        const onClose = vi.fn();

        render(<ImageToolsMenuModal {...baseProps({ imageEditChat: { open } as never, onClose })} />);

        screen.getByText("Custom edit").click();

        expect(open).toHaveBeenCalledOnce();
        expect(onClose).toHaveBeenCalledOnce();
    });

    it("opens remove-background with the right action key", () => {
        const open = vi.fn();

        render(<ImageToolsMenuModal {...baseProps({ quickImageEdits: { open } as never })} />);

        screen.getByText("Remove background").click();

        expect(open).toHaveBeenCalledWith("remove-background");
    });

    it("opens enhance-photo with the right action key", () => {
        const open = vi.fn();

        render(<ImageToolsMenuModal {...baseProps({ quickImageEdits: { open } as never })} />);

        screen.getByText("Enhance photo").click();

        expect(open).toHaveBeenCalledWith("enhance-photo");
    });

    it("disables the colors row with an explanatory title when the product has no colors", () => {
        render(<ImageToolsMenuModal {...baseProps({ colorImages: { open: vi.fn(), hasColors: false } as never })} />);

        const button = screen.getByText("Add images with colors").closest("button") as HTMLButtonElement;

        expect(button.disabled).toBe(true);
        expect(button.title).toMatch(/pick at least one product color/i);
    });

    it("calls suggestDetails.open and closes when picked", () => {
        const open = vi.fn();
        const onClose = vi.fn();

        render(<ImageToolsMenuModal {...baseProps({ suggestDetails: { open } as never, onClose })} />);

        screen.getByText("Suggest details from photo").click();

        expect(open).toHaveBeenCalledOnce();
        expect(onClose).toHaveBeenCalledOnce();
    });
});
