import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ImageEditJob } from "../../types";

vi.mock("../../../../../services/api/imageEditing.api", () => ({
    editProductImageService: vi.fn(),
}));

import { editProductImageService } from "../../../../../services/api/imageEditing.api";
import useColorImages from "./useColorImages";

const BUSINESS_ID = "44444444-4444-4444-8444-444444444444";
const PRODUCT_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const MAIN_IMAGE_URL = "/uploads/products/main.png";

const job = (overrides: Partial<ImageEditJob> = {}): ImageEditJob => ({
    id: "job-id",
    status: "Completed",
    prompt: "prompt",
    inputImageUrls: [MAIN_IMAGE_URL],
    outputImageUrl: "/uploads/products/generated.png",
    errorMessage: null,
    createdAt: "2026-02-01T10:00:00Z",
    ...overrides,
});

/** A promise the test controls the resolution timing of, to prove calls settle independently rather than in submission order. */
const deferred = <T,>() => {
    let resolve!: (value: T) => void;
    let reject!: (reason?: unknown) => void;
    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
};

const wrapper = ({ children }: { children: ReactNode }) => {
    const client = new QueryClient({
        defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
    });

    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

const renderColorImages = (
    colors: string[],
    imagesOverride?: Parameters<typeof useColorImages>[1]["images"]
) => {
    const addImage = vi.fn();
    const replaceImage = vi.fn();
    const images = imagesOverride ?? [{ url: MAIN_IMAGE_URL, isMain: true }];

    const { result, rerender } = renderHook(
        () => useColorImages(BUSINESS_ID, { productId: PRODUCT_ID, images, colors, addImage, replaceImage }),
        { wrapper }
    );

    return { result, rerender, addImage, replaceImage };
};

describe("useColorImages", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("starts closed with no colors selected", () => {
        const { result } = renderColorImages(["#FF0000", "#00FF00"]);

        expect(result.current.isOpen).toBe(false);
        expect(result.current.selectedColors).toEqual([]);
        expect(result.current.results).toBeUndefined();
    });

    it("pre-selects every color when there are 4 or fewer, needing no picking", () => {
        const { result } = renderColorImages(["#FF0000", "#00FF00", "#0000FF"]);

        act(() => result.current.open());

        expect(result.current.needsPicking).toBe(false);
        expect(result.current.selectedColors).toEqual(["#FF0000", "#00FF00", "#0000FF"]);
    });

    it("starts with nothing selected and requires picking when there are more than 4 colors", () => {
        const { result } = renderColorImages(["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF"]);

        act(() => result.current.open());

        expect(result.current.needsPicking).toBe(true);
        expect(result.current.selectedColors).toEqual([]);
    });

    it("selects up to 4 colors and refuses a 5th", () => {
        const { result } = renderColorImages(["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF"]);

        act(() => result.current.open());
        act(() => result.current.toggleColor("#FF0000"));
        act(() => result.current.toggleColor("#00FF00"));
        act(() => result.current.toggleColor("#0000FF"));
        act(() => result.current.toggleColor("#FFFF00"));

        expect(result.current.selectedColors).toHaveLength(4);

        act(() => result.current.toggleColor("#00FFFF"));
        expect(result.current.selectedColors).toHaveLength(4);
        expect(result.current.selectedColors).not.toContain("#00FFFF");
    });

    it("deselects an already-picked color", () => {
        const { result } = renderColorImages(["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF"]);

        act(() => result.current.open());
        act(() => result.current.toggleColor("#FF0000"));
        act(() => result.current.toggleColor("#FF0000"));

        expect(result.current.selectedColors).toEqual([]);
    });

    it("does nothing without a main image", () => {
        const { result } = renderColorImages(["#FF0000"], []);

        act(() => result.current.open());
        act(() => result.current.generate());

        expect(editProductImageService).not.toHaveBeenCalled();
        expect(result.current.hasMainImage).toBe(false);
    });

    it("reports no colors when the product has none", () => {
        const { result } = renderColorImages([]);

        expect(result.current.hasColors).toBe(false);
    });

    it("fires one call per selected color at once, not one after another", async () => {
        const red = deferred<ImageEditJob>();
        const blue = deferred<ImageEditJob>();

        vi.mocked(editProductImageService).mockImplementation((_businessId, payload) =>
            payload.prompt?.includes("#FF0000") ? red.promise : blue.promise
        );

        const { result } = renderColorImages(["#FF0000", "#0000FF"]);

        act(() => result.current.open());
        act(() => result.current.generate());

        expect(editProductImageService).toHaveBeenCalledTimes(2);
        expect(result.current.results).toEqual([
            { hex: "#FF0000", status: "pending" },
            { hex: "#0000FF", status: "pending" },
        ]);

        act(() => blue.resolve(job({ outputImageUrl: "/uploads/blue.png" })));
        await waitFor(() =>
            expect(result.current.results?.find((r) => r.hex === "#0000FF")?.status).toBe("done")
        );
        expect(result.current.results?.find((r) => r.hex === "#FF0000")?.status).toBe("pending");
        expect(result.current.isGenerating).toBe(true);

        act(() => red.resolve(job({ outputImageUrl: "/uploads/red.png" })));
        await waitFor(() =>
            expect(result.current.results?.find((r) => r.hex === "#FF0000")?.status).toBe("done")
        );
        expect(result.current.isGenerating).toBe(false);
    });

    it("falls back to the main image and adds new images when there are no existing non-main images", async () => {
        vi.mocked(editProductImageService).mockImplementation((_businessId, payload) =>
            Promise.resolve(job({ outputImageUrl: payload.prompt?.includes("#FF0000") ? "/uploads/red.png" : "/uploads/blue.png" }))
        );

        const { result, addImage, replaceImage } = renderColorImages(
            ["#FF0000", "#0000FF"],
            [{ url: MAIN_IMAGE_URL, isMain: true }]
        );

        act(() => result.current.open());
        act(() => result.current.generate());

        expect(editProductImageService).toHaveBeenCalledWith(
            BUSINESS_ID,
            expect.objectContaining({ imageUrl: MAIN_IMAGE_URL })
        );

        await waitFor(() => expect(result.current.isGenerating).toBe(false));

        expect(addImage).toHaveBeenCalledWith({ url: "/uploads/red.png" });
        expect(addImage).toHaveBeenCalledWith({ url: "/uploads/blue.png" });
        expect(replaceImage).not.toHaveBeenCalled();
    });

    it("reuses existing non-main images as sources and replaces each one in place, instead of removing anything", async () => {
        const extraUrl = "/uploads/products/extra.png";

        vi.mocked(editProductImageService).mockImplementation((_businessId, payload) =>
            Promise.resolve(job({ outputImageUrl: payload.prompt?.includes("#FF0000") ? "/uploads/red.png" : "/uploads/blue.png" }))
        );

        const { result, addImage, replaceImage } = renderColorImages(
            ["#FF0000", "#0000FF"],
            [
                { url: MAIN_IMAGE_URL, isMain: true },
                { url: extraUrl, isMain: false },
            ]
        );

        act(() => result.current.open());
        act(() => result.current.generate());

        // One color reuses the existing non-main image as its source; the other,
        // with nothing left to reuse, falls back to the main image.
        expect(editProductImageService).toHaveBeenCalledWith(
            BUSINESS_ID,
            expect.objectContaining({ imageUrl: extraUrl })
        );
        expect(editProductImageService).toHaveBeenCalledWith(
            BUSINESS_ID,
            expect.objectContaining({ imageUrl: MAIN_IMAGE_URL })
        );

        await waitFor(() => expect(result.current.isGenerating).toBe(false));

        // The existing image is replaced in place by its own result, never removed.
        expect(replaceImage).toHaveBeenCalledWith(extraUrl, "/uploads/red.png");
        // The overflow color (no existing image left to reuse) is added fresh.
        expect(addImage).toHaveBeenCalledWith({ url: "/uploads/blue.png" });
    });

    it("leaves an existing non-main image untouched when fewer colors are requested than images exist", async () => {
        const usedUrl = "/uploads/products/used.png";
        const untouchedUrl = "/uploads/products/untouched.png";

        vi.mocked(editProductImageService).mockResolvedValue(job({ outputImageUrl: "/uploads/red.png" }));

        const { result, replaceImage } = renderColorImages(["#FF0000"], [
            { url: MAIN_IMAGE_URL, isMain: true },
            { url: usedUrl, isMain: false },
            { url: untouchedUrl, isMain: false },
        ]);

        act(() => result.current.open());
        act(() => result.current.generate());

        await waitFor(() => expect(result.current.isGenerating).toBe(false));

        expect(editProductImageService).toHaveBeenCalledTimes(1);
        expect(editProductImageService).toHaveBeenCalledWith(
            BUSINESS_ID,
            expect.objectContaining({ imageUrl: usedUrl })
        );
        expect(replaceImage).toHaveBeenCalledWith(usedUrl, "/uploads/red.png");
        expect(replaceImage).not.toHaveBeenCalledWith(untouchedUrl, expect.anything());
    });

    it("never touches the gallery when every color fails", async () => {
        vi.mocked(editProductImageService).mockRejectedValue(new Error("provider down"));

        const { result, addImage, replaceImage } = renderColorImages(["#FF0000"]);

        act(() => result.current.open());
        act(() => result.current.generate());

        await waitFor(() => expect(result.current.isGenerating).toBe(false));

        expect(addImage).not.toHaveBeenCalled();
        expect(replaceImage).not.toHaveBeenCalled();
        expect(result.current.results?.[0].status).toBe("error");
    });

    it("keeps one color's failure from affecting another's success", async () => {
        vi.mocked(editProductImageService).mockImplementation((_businessId, payload) =>
            payload.prompt?.includes("#FF0000")
                ? Promise.reject(new Error("out of credits"))
                : Promise.resolve(job({ outputImageUrl: "/uploads/blue.png" }))
        );

        const { result, addImage } = renderColorImages(["#FF0000", "#0000FF"]);

        act(() => result.current.open());
        act(() => result.current.generate());

        await waitFor(() => expect(result.current.isGenerating).toBe(false));

        expect(result.current.results?.find((r) => r.hex === "#FF0000")?.status).toBe("error");
        expect(result.current.results?.find((r) => r.hex === "#0000FF")?.status).toBe("done");
        expect(addImage).toHaveBeenCalledWith({ url: "/uploads/blue.png" });
    });

    it("won't close while a batch is still generating", async () => {
        const pending = deferred<ImageEditJob>();
        vi.mocked(editProductImageService).mockReturnValue(pending.promise);

        const { result } = renderColorImages(["#FF0000"]);

        act(() => result.current.open());
        act(() => result.current.generate());

        act(() => result.current.close());
        expect(result.current.isOpen).toBe(true);

        act(() => pending.resolve(job()));
        await waitFor(() => expect(result.current.isGenerating).toBe(false));

        act(() => result.current.close());
        expect(result.current.isOpen).toBe(false);
    });
});
