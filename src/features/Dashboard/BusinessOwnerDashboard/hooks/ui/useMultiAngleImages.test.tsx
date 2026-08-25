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
    const removeNonMainImages = vi.fn();
    const images = imagesOverride ?? [{ url: MAIN_IMAGE_URL, isMain: true }];

    const { result, rerender } = renderHook(
        () => useMultiAngleImages(BUSINESS_ID, { images, addImage, removeNonMainImages }),
        { wrapper }
    );

    return { result, rerender, addImage, removeNonMainImages };
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

    it("clears the non-main images once, right before the first successful result, and adds each result as it lands", async () => {
        const front = deferred<ImageEditJob>();
        const back = deferred<ImageEditJob>();

        vi.mocked(editProductImageService).mockImplementation((_businessId, payload) =>
            payload.prompt?.includes("front") ? front.promise : back.promise
        );

        const { result, addImage, removeNonMainImages } = renderMultiAngle([
            { url: MAIN_IMAGE_URL, isMain: true },
            { url: "/uploads/extra.png", isMain: false },
        ]);

        act(() => result.current.open());
        act(() => result.current.toggleAngle("front"));
        act(() => result.current.toggleAngle("back"));
        act(() => result.current.generate());

        expect(removeNonMainImages).not.toHaveBeenCalled();

        act(() => back.resolve(job({ outputImageUrl: "/uploads/back.png" })));
        await waitFor(() => expect(removeNonMainImages).toHaveBeenCalledTimes(1));
        expect(addImage).toHaveBeenCalledWith({ url: "/uploads/back.png" });

        act(() => front.resolve(job({ outputImageUrl: "/uploads/front.png" })));
        await waitFor(() => expect(addImage).toHaveBeenCalledWith({ url: "/uploads/front.png" }));

        // Only cleared once, not once per successful angle.
        expect(removeNonMainImages).toHaveBeenCalledTimes(1);
    });

    it("never touches the gallery when every angle fails", async () => {
        vi.mocked(editProductImageService).mockRejectedValue(new Error("provider down"));

        const { result, addImage, removeNonMainImages } = renderMultiAngle();

        act(() => result.current.open());
        act(() => result.current.toggleAngle("front"));
        act(() => result.current.generate());

        await waitFor(() => expect(result.current.isGenerating).toBe(false));

        expect(removeNonMainImages).not.toHaveBeenCalled();
        expect(addImage).not.toHaveBeenCalled();
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
