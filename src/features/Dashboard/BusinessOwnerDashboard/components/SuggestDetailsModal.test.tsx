import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SuggestDetailsModal from "./SuggestDetailsModal";
import type { ProductDraftProduct } from "../types";

// The component renders purely from the hook's return value, so it's supplied as
// a plain object rather than being run.
type SuggestDetails = Parameters<typeof SuggestDetailsModal>[0]["suggestDetails"];

const draft = (overrides: Partial<ProductDraftProduct> = {}): ProductDraftProduct => ({
    title: null,
    description: null,
    price: null,
    compareAtPrice: null,
    categoryId: null,
    categoryName: null,
    sku: null,
    stockQuantity: null,
    tags: [],
    saleEndsAt: null,
    metadata: null,
    ...overrides,
});

const suggestDetails = (overrides: Partial<SuggestDetails> = {}): SuggestDetails =>
    ({
        isOpen: true,
        open: vi.fn(),
        close: vi.fn(),
        hasMainImage: true,
        status: "done",
        suggestion: draft({ title: "Blue mug", tags: ["ceramic"] }),
        selectedFields: new Set(["title", "tags"]),
        toggleField: vi.fn(),
        error: undefined,
        apply: vi.fn(),
        creditsRemaining: 10,
        creditsGrantedTotal: 10,
        includedInPlan: false,
        ...overrides,
    }) as SuggestDetails;

const noop = () => {};

describe("SuggestDetailsModal", () => {
    it("shows only the fields the AI actually filled", () => {
        render(
            <SuggestDetailsModal
                suggestDetails={suggestDetails()}
                fields={[]}
                setField={noop}
                setMetadataField={noop}
            />
        );

        expect(screen.getByText("Title")).toBeTruthy();
        expect(screen.getByText("Blue mug")).toBeTruthy();
        expect(screen.getByText("Tags")).toBeTruthy();
        expect(screen.queryByText("Price")).toBeNull();
    });

    it("shows a spinner while working", () => {
        render(
            <SuggestDetailsModal
                suggestDetails={suggestDetails({ status: "working", suggestion: undefined })}
                fields={[]}
                setField={noop}
                setMetadataField={noop}
            />
        );

        expect(screen.queryByText("Title")).toBeNull();
    });

    it("shows the error message on failure", () => {
        render(
            <SuggestDetailsModal
                suggestDetails={suggestDetails({
                    status: "error",
                    suggestion: undefined,
                    error: "Couldn't read that photo.",
                })}
                fields={[]}
                setField={noop}
                setMetadataField={noop}
            />
        );

        expect(screen.getByText("Couldn't read that photo.")).toBeTruthy();
    });

    it("requires a main image before analyzing", () => {
        render(
            <SuggestDetailsModal
                suggestDetails={suggestDetails({ hasMainImage: false, status: "idle", suggestion: undefined })}
                fields={[]}
                setField={noop}
                setMetadataField={noop}
            />
        );

        expect(screen.getByText(/add a main image first/i)).toBeTruthy();
    });

    it("toggles a field's checkbox on click", () => {
        const toggleField = vi.fn();

        render(
            <SuggestDetailsModal
                suggestDetails={suggestDetails({ toggleField })}
                fields={[]}
                setField={noop}
                setMetadataField={noop}
            />
        );

        screen.getByText("Title").click();

        expect(toggleField).toHaveBeenCalledWith("title");
    });

    it("calls apply with the field list and form callbacks", () => {
        const apply = vi.fn();
        const setField = vi.fn();
        const setMetadataField = vi.fn();

        render(
            <SuggestDetailsModal
                suggestDetails={suggestDetails({ apply })}
                fields={[]}
                setField={setField}
                setMetadataField={setMetadataField}
            />
        );

        screen.getByRole("button", { name: "Apply to form" }).click();

        expect(apply).toHaveBeenCalledWith([], { setField, setMetadataField });
    });

    it("disables Apply when nothing is selected", () => {
        render(
            <SuggestDetailsModal
                suggestDetails={suggestDetails({ selectedFields: new Set() })}
                fields={[]}
                setField={noop}
                setMetadataField={noop}
            />
        );

        expect(
            (screen.getByRole("button", { name: "Apply to form" }) as HTMLButtonElement).disabled
        ).toBe(true);
    });
});
