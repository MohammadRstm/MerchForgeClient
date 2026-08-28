import { describe, expect, it } from "vitest";
import { productDraftSchema } from "./validation";

/**
 * The backend response contract. These guard the boundary: the chat renders
 * entirely from this shape, so a drifted field should fail here rather than surface
 * as an empty modal.
 */
describe("productDraftSchema", () => {
    const valid = {
        id: "11111111-1111-4111-8111-111111111111",
        status: "CollectingInformation",
        messages: [
            { role: "assistant", text: "Hi!", kind: "text", at: "2026-02-01T10:00:00Z" },
        ],
        draft: null,
        missingFields: ["title"],
        originalImageUrl: null,
        processedImageUrl: null,
        imageModificationPrompt: null,
        canConfirm: false,
        productId: null,
    };

    it("accepts a fresh draft", () => {
        expect(productDraftSchema.parse(valid).status).toBe("CollectingInformation");
    });

    it("accepts a fully populated draft", () => {
        const populated = {
            ...valid,
            status: "WaitingForProductApproval",
            draft: {
                title: "Pizza",
                description: "Cheesy.",
                price: 14.5,
                compareAtPrice: null,
                categoryId: "22222222-2222-4222-8222-222222222222",
                categoryName: "Pizza",
                sku: null,
                stockQuantity: null,
                tags: [],
                saleEndsAt: null,
                metadata: { ingredients: ["Cheese"], spicy: false, calories: 900 },
            },
            missingFields: [],
            originalImageUrl: "/uploads/a.png",
            canConfirm: true,
        };

        const parsed = productDraftSchema.parse(populated);

        // Metadata keeps its value types rather than being flattened to strings.
        expect(parsed.draft!.metadata).toEqual({
            ingredients: ["Cheese"],
            spicy: false,
            calories: 900,
        });
        expect(parsed.canConfirm).toBe(true);
    });

    it("accepts metadata keys the client has never seen, since they differ per business", () => {
        const parsed = productDraftSchema.parse({
            ...valid,
            draft: {
                title: "Shirt",
                description: "Cotton.",
                price: 25,
                compareAtPrice: null,
                categoryId: null,
                categoryName: null,
                sku: null,
                stockQuantity: null,
                tags: [],
                saleEndsAt: null,
                metadata: { someVerticalSpecificField: "value", another: [1, 2] },
            },
        });

        expect(parsed.draft!.metadata).toHaveProperty("someVerticalSpecificField");
    });

    it("rejects a status the client does not know how to render", () => {
        // A closed union on purpose: an unknown state would otherwise fall through
        // every branch and render an empty modal with no clue why.
        expect(() => productDraftSchema.parse({ ...valid, status: "SomeNewState" })).toThrow();
    });

    it("rejects a message with an unknown role", () => {
        expect(() =>
            productDraftSchema.parse({
                ...valid,
                messages: [{ role: "system", text: "x", kind: "text", at: "2026-02-01T10:00:00Z" }],
            })
        ).toThrow();
    });

    it("rejects a response missing canConfirm, which gates product creation", () => {
        const { canConfirm: _omitted, ...withoutCanConfirm } = valid;

        expect(() => productDraftSchema.parse(withoutCanConfirm)).toThrow();
    });

    it("rejects a non-uuid draft id", () => {
        expect(() => productDraftSchema.parse({ ...valid, id: "not-a-uuid" })).toThrow();
    });
});
