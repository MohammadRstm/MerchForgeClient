import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ImageEditJob } from "../../types";

vi.mock("../../../../../services/api/imageEditing.api", () => ({
    editProductImageService: vi.fn(),
}));

import { editProductImageService } from "../../../../../services/api/imageEditing.api";
import useMultiAngleImages from "./useMultiAngleImages";

const BUSINESS_ID = "33333333-3333-4333-8333-333333333333";
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

const renderMultiAngle = (imagesOverride?: Parameters<typeof useMultiAngleImages>[1]["images"]) => {
    const addImage = vi.fn();
    const replaceImage = vi.fn();
    const images = imagesOverride ?? [{ url: MAIN_IMAGE_URL, isMain: true }];

    const { result, rerender } = renderHook(
        () => useMultiAngleImages(BUSINESS_ID, { images, addImage, replaceImage }),
        { wrapper }
    );

    return { result, rerender, addImage, replaceImage };
};

describe("useMultiAngleImages", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("starts closed with nothing selected", () => {
        const { result } = renderMultiAngle();

        expect(result.current.isOpen).toBe(false);
        expect(result.current.selectedKeys).toEqual([]);
        expect(result.current.results).toBeUndefined();
    });

    it("selects up to 4 angles and refuses a 5th", () => {
        const { result } = renderMultiAngle();

        act(() => result.current.open());
        act(() => result.current.toggleAngle("front"));
        act(() => result.current.toggleAngle("back"));
        act(() => result.current.toggleAngle("left"));
        act(() => result.current.toggleAngle("right"));

        expect(result.current.selectedKeys).toEqual(["front", "back", "left", "right"]);

        act(() => result.current.toggleAngle("top-down"));
        expect(result.current.selectedKeys).toHaveLength(4);
        expect(result.current.selectedKeys).not.toContain("top-down");
    });

    it("deselects an already-picked angle", () => {
        const { result } = renderMultiAngle();

        act(() => result.current.open());
        act(() => result.current.toggleAngle("front"));
        act(() => result.current.toggleAngle("front"));

        expect(result.current.selectedKeys).toEqual([]);
    });

    it("does nothing without a main image", () => {
        const { result } = renderMultiAngle([]);

        act(() => result.current.open());
        act(() => result.current.toggleAngle("front"));
        act(() => result.current.generate());

        expect(editProductImageService).not.toHaveBeenCalled();
        expect(result.current.hasMainImage).toBe(false);
    });

    it("fires one call per selected angle at once, not one after another", async () => {
        const front = deferred<ImageEditJob>();
        const back = deferred<ImageEditJob>();

        vi.mocked(editProductImageService).mockImplementation((_businessId, payload) =>
            payload.prompt?.includes("front") ? front.promise : back.promise
        );

        const { result } = renderMultiAngle();

        act(() => result.current.open());
        act(() => result.current.toggleAngle("front"));
        act(() => result.current.toggleAngle("back"));
        act(() => result.current.generate());

        // Both requests are already in flight before either has resolved --
        // proof the second didn't wait for the first.
        expect(editProductImageService).toHaveBeenCalledTimes(2);
        expect(result.current.results).toEqual([
            { key: "front", label: "Front view", status: "pending" },
            { key: "back", label: "Back view", status: "pending" },
        ]);

        // The *second* angle's call finishes first -- its slot must update
        // immediately, without waiting for "front" to settle too.
        act(() => back.resolve(job({ outputImageUrl: "/uploads/back.png" })));
        await waitFor(() =>
            expect(result.current.results?.find((r) => r.key === "back")?.status).toBe("done")
        );
        expect(result.current.results?.find((r) => r.key === "front")?.status).toBe("pending");
        expect(result.current.isGenerating).toBe(true);

        act(() => front.resolve(job({ outputImageUrl: "/uploads/front.png" })));
        await waitFor(() =>
            expect(result.current.results?.find((r) => r.key === "front")?.status).toBe("done")
        );
        expect(result.current.isGenerating).toBe(false);
    });

    it("falls back to the main image and adds new images when there are no existing non-main images", async () => {
        vi.mocked(editProductImageService).mockImplementation((_businessId, payload) =>
            Promise.resolve(job({ outputImageUrl: `/uploads/${payload.prompt?.includes("front") ? "front" : "back"}.png` }))
        );

        const { result, addImage, replaceImage } = renderMultiAngle([{ url: MAIN_IMAGE_URL, isMain: true }]);

        act(() => result.current.open());
        act(() => result.current.toggleAngle("front"));
        act(() => result.current.toggleAngle("back"));
        act(() => result.current.generate());

        expect(editProductImageService).toHaveBeenCalledWith(
            BUSINESS_ID,
            expect.objectContaining({ imageUrl: MAIN_IMAGE_URL })
        );

        await waitFor(() => expect(result.current.isGenerating).toBe(false));

        expect(addImage).toHaveBeenCalledWith({ url: "/uploads/front.png" });
        expect(addImage).toHaveBeenCalledWith({ url: "/uploads/back.png" });
        expect(replaceImage).not.toHaveBeenCalled();
    });

    it("reuses existing non-main images as sources and replaces each one in place, instead of removing anything", async () => {
        const extraUrl = "/uploads/products/extra.png";

        vi.mocked(editProductImageService).mockImplementation((_businessId, payload) =>
            Promise.resolve(job({ outputImageUrl: `/uploads/${payload.prompt?.includes("front") ? "front" : "back"}.png` }))
        );

        const { result, addImage, replaceImage } = renderMultiAngle([
            { url: MAIN_IMAGE_URL, isMain: true },
            { url: extraUrl, isMain: false },
        ]);

        act(() => result.current.open());
        act(() => result.current.toggleAngle("front"));
        act(() => result.current.toggleAngle("back"));
        act(() => result.current.generate());

        // One angle reuses the existing non-main image as its source; the other,
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
        expect(replaceImage).toHaveBeenCalledWith(extraUrl, "/uploads/front.png");
        // The overflow angle (no existing image left to reuse) is added fresh.
        expect(addImage).toHaveBeenCalledWith({ url: "/uploads/back.png" });
    });

    it("leaves an existing non-main image untouched when fewer angles are requested than images exist", async () => {
        const usedUrl = "/uploads/products/used.png";
        const untouchedUrl = "/uploads/products/untouched.png";

        vi.mocked(editProductImageService).mockResolvedValue(job({ outputImageUrl: "/uploads/front.png" }));

        const { result, replaceImage } = renderMultiAngle([
            { url: MAIN_IMAGE_URL, isMain: true },
            { url: usedUrl, isMain: false },
            { url: untouchedUrl, isMain: false },
        ]);

        act(() => result.current.open());
        act(() => result.current.toggleAngle("front"));
        act(() => result.current.generate());

        await waitFor(() => expect(result.current.isGenerating).toBe(false));

        expect(editProductImageService).toHaveBeenCalledTimes(1);
        expect(editProductImageService).toHaveBeenCalledWith(
            BUSINESS_ID,
            expect.objectContaining({ imageUrl: usedUrl })
        );
        expect(replaceImage).toHaveBeenCalledWith(usedUrl, "/uploads/front.png");
        expect(replaceImage).not.toHaveBeenCalledWith(untouchedUrl, expect.anything());
    });

    it("never touches the gallery when every angle fails", async () => {
        vi.mocked(editProductImageService).mockRejectedValue(new Error("provider down"));

        const { result, addImage, replaceImage } = renderMultiAngle();

        act(() => result.current.open());
        act(() => result.current.toggleAngle("front"));
        act(() => result.current.generate());

        await waitFor(() => expect(result.current.isGenerating).toBe(false));

        expect(addImage).not.toHaveBeenCalled();
        expect(replaceImage).not.toHaveBeenCalled();
        expect(result.current.results?.[0].status).toBe("error");
    });

    it("keeps one angle's failure from affecting another's success", async () => {
        vi.mocked(editProductImageService).mockImplementation((_businessId, payload) =>
            payload.prompt?.includes("front")
                ? Promise.reject(new Error("out of credits"))
                : Promise.resolve(job({ outputImageUrl: "/uploads/back.png" }))
        );

        const { result, addImage } = renderMultiAngle();

        act(() => result.current.open());
        act(() => result.current.toggleAngle("front"));
        act(() => result.current.toggleAngle("back"));
        act(() => result.current.generate());

        await waitFor(() => expect(result.current.isGenerating).toBe(false));

        expect(result.current.results?.find((r) => r.key === "front")?.status).toBe("error");
        expect(result.current.results?.find((r) => r.key === "back")?.status).toBe("done");
        expect(addImage).toHaveBeenCalledWith({ url: "/uploads/back.png" });
    });

    it("won't close while a batch is still generating", async () => {
        const pending = deferred<ImageEditJob>();
        vi.mocked(editProductImageService).mockReturnValue(pending.promise);

        const { result } = renderMultiAngle();

        act(() => result.current.open());
        act(() => result.current.toggleAngle("front"));
        act(() => result.current.generate());

        act(() => result.current.close());
        expect(result.current.isOpen).toBe(true);

        act(() => pending.resolve(job()));
        await waitFor(() => expect(result.current.isGenerating).toBe(false));

        act(() => result.current.close());
        expect(result.current.isOpen).toBe(false);
    });
});
