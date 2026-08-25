import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ImageEditJob } from "../../types";

vi.mock("../../../../../services/api/imageEditing.api", () => ({
    editProductImageService: vi.fn(),
}));

import { editProductImageService } from "../../../../../services/api/imageEditing.api";
import useQuickImageEdits from "./useQuickImageEdits";

const BUSINESS_ID = "55555555-5555-4555-8555-555555555555";
const FRONT_URL = "/uploads/products/front.png";
const BACK_URL = "/uploads/products/back.png";

const job = (overrides: Partial<ImageEditJob> = {}): ImageEditJob => ({
    id: "job-id",
    status: "Completed",
    prompt: "prompt",
    inputImageUrls: [FRONT_URL],
    outputImageUrl: "/uploads/products/generated.png",
    errorMessage: null,
    createdAt: "2026-02-01T10:00:00Z",
    ...overrides,
});

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

const renderQuickEdits = () => {
    const replaceImage = vi.fn();

    const { result } = renderHook(() => useQuickImageEdits(BUSINESS_ID, { replaceImage }), { wrapper });

    return { result, replaceImage };
};

describe("useQuickImageEdits", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("starts closed with nothing selected", () => {
        const { result } = renderQuickEdits();

        expect(result.current.isOpen).toBe(false);
        expect(result.current.selectedUrls.size).toBe(0);
        expect(result.current.results).toBeUndefined();
    });

    it("enters picking mode for the chosen action", () => {
        const { result } = renderQuickEdits();

        act(() => result.current.open("remove-background"));

        expect(result.current.isOpen).toBe(true);
        expect(result.current.isSelecting).toBe(true);
        expect(result.current.actionKey).toBe("remove-background");
    });

    it("toggles image selection on and off", () => {
        const { result } = renderQuickEdits();

        act(() => result.current.open("enhance-photo"));
        act(() => result.current.toggleSelect(FRONT_URL));
        expect(result.current.selectedUrls.has(FRONT_URL)).toBe(true);

        act(() => result.current.toggleSelect(FRONT_URL));
        expect(result.current.selectedUrls.has(FRONT_URL)).toBe(false);
    });

    it("does nothing without an action or selection", () => {
        const { result } = renderQuickEdits();

        act(() => result.current.confirm());

        expect(editProductImageService).not.toHaveBeenCalled();
    });

    it("fires one call per selected image at once, not one after another", async () => {
        const front = deferred<ImageEditJob>();
        const back = deferred<ImageEditJob>();

        vi.mocked(editProductImageService).mockImplementation((_businessId, payload) =>
            payload.imageUrl === FRONT_URL ? front.promise : back.promise
        );

        const { result } = renderQuickEdits();

        act(() => result.current.open("remove-background"));
        act(() => result.current.toggleSelect(FRONT_URL));
        act(() => result.current.toggleSelect(BACK_URL));
        act(() => result.current.confirm());

        expect(editProductImageService).toHaveBeenCalledTimes(2);
        expect(result.current.results).toEqual([
            { url: FRONT_URL, status: "pending" },
            { url: BACK_URL, status: "pending" },
        ]);
        expect(result.current.isSelecting).toBe(false);

        act(() => back.resolve(job({ outputImageUrl: "/uploads/back-done.png" })));
        await waitFor(() =>
            expect(result.current.results?.find((r) => r.url === BACK_URL)?.status).toBe("done")
        );
        expect(result.current.results?.find((r) => r.url === FRONT_URL)?.status).toBe("pending");
        expect(result.current.isGenerating).toBe(true);

        act(() => front.resolve(job({ outputImageUrl: "/uploads/front-done.png" })));
        await waitFor(() =>
            expect(result.current.results?.find((r) => r.url === FRONT_URL)?.status).toBe("done")
        );
        expect(result.current.isGenerating).toBe(false);
    });

    it("replaces each image in place as its own result lands, independent of the others", async () => {
        vi.mocked(editProductImageService).mockImplementation((_businessId, payload) =>
            Promise.resolve(job({ outputImageUrl: `${payload.imageUrl}-edited.png` }))
        );

        const { result, replaceImage } = renderQuickEdits();

        act(() => result.current.open("enhance-photo"));
        act(() => result.current.toggleSelect(FRONT_URL));
        act(() => result.current.toggleSelect(BACK_URL));
        act(() => result.current.confirm());

        await waitFor(() => expect(result.current.isGenerating).toBe(false));

        expect(replaceImage).toHaveBeenCalledWith(FRONT_URL, `${FRONT_URL}-edited.png`);
        expect(replaceImage).toHaveBeenCalledWith(BACK_URL, `${BACK_URL}-edited.png`);
    });

    it("keeps one image's failure from affecting another's success", async () => {
        vi.mocked(editProductImageService).mockImplementation((_businessId, payload) =>
            payload.imageUrl === FRONT_URL
                ? Promise.reject(new Error("provider down"))
                : Promise.resolve(job({ outputImageUrl: "/uploads/back-done.png" }))
        );

        const { result, replaceImage } = renderQuickEdits();

        act(() => result.current.open("remove-background"));
        act(() => result.current.toggleSelect(FRONT_URL));
        act(() => result.current.toggleSelect(BACK_URL));
        act(() => result.current.confirm());

        await waitFor(() => expect(result.current.isGenerating).toBe(false));

        expect(result.current.results?.find((r) => r.url === FRONT_URL)?.status).toBe("error");
        expect(result.current.results?.find((r) => r.url === BACK_URL)?.status).toBe("done");
        expect(replaceImage).toHaveBeenCalledWith(BACK_URL, "/uploads/back-done.png");
        expect(replaceImage).not.toHaveBeenCalledWith(FRONT_URL, expect.anything());
    });

    it("reports still-pending urls via processingImageUrls while generating", async () => {
        const back = deferred<ImageEditJob>();

        vi.mocked(editProductImageService).mockImplementation((_businessId, payload) =>
            payload.imageUrl === FRONT_URL ? Promise.resolve(job()) : back.promise
        );

        const { result } = renderQuickEdits();

        act(() => result.current.open("enhance-photo"));
        act(() => result.current.toggleSelect(FRONT_URL));
        act(() => result.current.toggleSelect(BACK_URL));
        act(() => result.current.confirm());

        await waitFor(() =>
            expect(result.current.results?.find((r) => r.url === FRONT_URL)?.status).toBe("done")
        );
        expect(result.current.processingImageUrls.has(BACK_URL)).toBe(true);
        expect(result.current.processingImageUrls.has(FRONT_URL)).toBe(false);
    });

    it("won't close while a batch is still generating", async () => {
        const pending = deferred<ImageEditJob>();
        vi.mocked(editProductImageService).mockReturnValue(pending.promise);

        const { result } = renderQuickEdits();

        act(() => result.current.open("remove-background"));
        act(() => result.current.toggleSelect(FRONT_URL));
        act(() => result.current.confirm());

        act(() => result.current.close());
        expect(result.current.isOpen).toBe(true);

        act(() => pending.resolve(job()));
        await waitFor(() => expect(result.current.isGenerating).toBe(false));

        act(() => result.current.close());
        expect(result.current.isOpen).toBe(false);
    });
});
