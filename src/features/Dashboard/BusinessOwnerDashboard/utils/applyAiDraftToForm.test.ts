import { describe, expect, it, vi } from "vitest";
import { applyAiDraftToForm } from "./applyAiDraftToForm";
import type { ProductDraftProduct, ProductFormField } from "../types";

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

const COLOR_FIELD: ProductFormField = { key: "colors", label: "Colors", valueType: "ColorList" };

describe("applyAiDraftToForm", () => {
    it("applies every non-null field when no restriction is given", () => {
        const setField = vi.fn();
        const setMetadataField = vi.fn();

        applyAiDraftToForm(
            draft({ title: "A mug", price: 12, tags: ["ceramic"] }),
            [],
            { setField, setMetadataField }
        );

        expect(setField).toHaveBeenCalledWith("title", "A mug");
        expect(setField).toHaveBeenCalledWith("price", "12");
        expect(setField).toHaveBeenCalledWith("tags", "ceramic");
    });

    it("leaves every null field untouched", () => {
        const setField = vi.fn();
        const setMetadataField = vi.fn();

        applyAiDraftToForm(draft({ title: "A mug" }), [], { setField, setMetadataField });

        expect(setField).toHaveBeenCalledTimes(1);
        expect(setField).toHaveBeenCalledWith("title", "A mug");
    });

    it("restricts to only the given fields when `only` is provided", () => {
        const setField = vi.fn();
        const setMetadataField = vi.fn();

        applyAiDraftToForm(
            draft({ title: "A mug", description: "Ceramic mug", price: 12 }),
            [],
            { setField, setMetadataField },
            new Set(["title"])
        );

        expect(setField).toHaveBeenCalledOnce();
        expect(setField).toHaveBeenCalledWith("title", "A mug");
    });

    it("applies filled metadata fields, matched by key, and skips fields the business doesn't have", () => {
        const setField = vi.fn();
        const setMetadataField = vi.fn();

        applyAiDraftToForm(
            draft({ metadata: { colors: ["#FF0000"], unknownKey: "x" } }),
            [COLOR_FIELD],
            { setField, setMetadataField }
        );

        expect(setMetadataField).toHaveBeenCalledOnce();
        expect(setMetadataField).toHaveBeenCalledWith("colors", "#FF0000");
    });

    it("excludes metadata when `only` doesn't include it", () => {
        const setField = vi.fn();
        const setMetadataField = vi.fn();

        applyAiDraftToForm(
            draft({ title: "A mug", metadata: { colors: ["#FF0000"] } }),
            [COLOR_FIELD],
            { setField, setMetadataField },
            new Set(["title"])
        );

        expect(setMetadataField).not.toHaveBeenCalled();
    });
});
