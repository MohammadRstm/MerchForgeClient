import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ProductDraftProduct } from "../../types";

vi.mock("../../../../../services/api/imageSuggestion.api", () => ({
    suggestProductDetailsService: vi.fn(),
}));

import { suggestProductDetailsService } from "../../../../../services/api/imageSuggestion.api";
import useSuggestProductDetails from "./useSuggestProductDetails";

const BUSINESS_ID = "66666666-6666-4666-8666-666666666666";
const MAIN_IMAGE_URL = "/uploads/products/main.png";

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

const wrapper = ({ children }: { children: ReactNode }) => {
    const client = new QueryClient({
        defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
    });

    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

const renderSuggestDetails = (imagesOverride?: Parameters<typeof useSuggestProductDetails>[1]["images"]) => {
    const images = imagesOverride ?? [{ url: MAIN_IMAGE_URL, isMain: true }];

    const { result } = renderHook(() => useSuggestProductDetails(BUSINESS_ID, { images }), { wrapper });

    return { result };
};

describe("useSuggestProductDetails", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("starts closed and idle", () => {
        const { result } = renderSuggestDetails();

        expect(result.current.isOpen).toBe(false);
        expect(result.current.status).toBe("idle");
        expect(result.current.suggestion).toBeUndefined();
    });

    it("calls the service against the main image as soon as it opens", async () => {
        vi.mocked(suggestProductDetailsService).mockResolvedValue(draft({ title: "A mug" }));

        const { result } = renderSuggestDetails();

        act(() => result.current.open());

        expect(result.current.status).toBe("working");
        expect(suggestProductDetailsService).toHaveBeenCalledWith(BUSINESS_ID, { imageUrl: MAIN_IMAGE_URL });

        await waitFor(() => expect(result.current.status).toBe("done"));
        expect(result.current.suggestion?.title).toBe("A mug");
    });

    it("pre-selects every field the AI actually filled, and nothing else", async () => {
        vi.mocked(suggestProductDetailsService).mockResolvedValue(
            draft({ title: "A mug", tags: ["ceramic"], price: null })
        );

        const { result } = renderSuggestDetails();

        act(() => result.current.open());

        await waitFor(() => expect(result.current.status).toBe("done"));

        expect(result.current.selectedFields.has("title")).toBe(true);
        expect(result.current.selectedFields.has("tags")).toBe(true);
        expect(result.current.selectedFields.has("price")).toBe(false);
    });

    it("does nothing without a main image", () => {
        const { result } = renderSuggestDetails([]);

        act(() => result.current.open());

        expect(suggestProductDetailsService).not.toHaveBeenCalled();
        expect(result.current.hasMainImage).toBe(false);
        expect(result.current.isOpen).toBe(true);
    });

    it("surfaces an error and leaves the suggestion empty on failure", async () => {
        vi.mocked(suggestProductDetailsService).mockRejectedValue(new Error("provider down"));

        const { result } = renderSuggestDetails();

        act(() => result.current.open());

        await waitFor(() => expect(result.current.status).toBe("error"));
        expect(result.current.error).toBeTruthy();
        expect(result.current.suggestion).toBeUndefined();
    });

    it("toggles a field's selection", async () => {
        vi.mocked(suggestProductDetailsService).mockResolvedValue(draft({ title: "A mug" }));

        const { result } = renderSuggestDetails();
        act(() => result.current.open());
        await waitFor(() => expect(result.current.status).toBe("done"));

        act(() => result.current.toggleField("title"));
        expect(result.current.selectedFields.has("title")).toBe(false);

        act(() => result.current.toggleField("title"));
        expect(result.current.selectedFields.has("title")).toBe(true);
    });

    it("applies only the checked fields and then closes", async () => {
        vi.mocked(suggestProductDetailsService).mockResolvedValue(
            draft({ title: "A mug", description: "Ceramic mug" })
        );

        const { result } = renderSuggestDetails();
        act(() => result.current.open());
        await waitFor(() => expect(result.current.status).toBe("done"));

        act(() => result.current.toggleField("description"));

        const setField = vi.fn();
        const setMetadataField = vi.fn();

        act(() => result.current.apply([], { setField, setMetadataField }));

        expect(setField).toHaveBeenCalledWith("title", "A mug");
        expect(setField).not.toHaveBeenCalledWith("description", expect.anything());
        expect(result.current.isOpen).toBe(false);
    });
});
