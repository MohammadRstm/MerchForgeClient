import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { BusinessOrderResponse } from "../../types";
import useOrderSelection from "./useOrderSelection";

const order = (id: string): BusinessOrderResponse => ({
    id,
    customerName: "Mia Sato",
    customerEmail: "mia.sato@example.com",
    customerPhone: null,
    status: "Confirmed",
    paymentStatus: "Paid",
    total: 188,
    currency: "USD",
    itemCount: 3,
    createdAt: "2026-08-24T10:00:00Z",
});

const A = "11111111-1111-4111-8111-111111111111";
const B = "22222222-2222-4222-8222-222222222222";
const C = "33333333-3333-4333-8333-333333333333";

describe("useOrderSelection", () => {
    it("toggles ids on and off", () => {
        const items = [order(A), order(B)];
        const { result } = renderHook(() => useOrderSelection(items));

        act(() => result.current.toggle(A));
        expect([...result.current.selectedIds]).toEqual([A]);
        expect(result.current.selectedOrders.map((o) => o.id)).toEqual([A]);

        act(() => result.current.toggle(A));
        expect(result.current.selectedIds.size).toBe(0);
    });

    it("keeps the selection when the same items array is passed again", () => {
        const items = [order(A), order(B)];
        const { result, rerender } = renderHook(({ list }) => useOrderSelection(list), {
            initialProps: { list: items },
        });

        act(() => result.current.toggle(A));
        rerender({ list: items });

        expect([...result.current.selectedIds]).toEqual([A]);
    });

    it("prunes ids that are no longer on the current page", () => {
        const first = [order(A), order(B)];
        const { result, rerender } = renderHook(({ list }) => useOrderSelection(list), {
            initialProps: { list: first },
        });

        act(() => {
            result.current.toggle(A);
            result.current.toggle(B);
        });
        expect(result.current.selectedIds.size).toBe(2);

        // A different page: only B survives, A is dropped.
        rerender({ list: [order(B), order(C)] });

        expect([...result.current.selectedIds]).toEqual([B]);
    });

    /**
     * The prune above adjusts state during render, keyed on the identity of `items`.
     * A caller that allocates a fresh array each render (an inline `data?.items ?? []`)
     * makes that check always true and loops until React throws "Too many re-renders" —
     * which is exactly what crashed the Orders page. Callers must memoize; this asserts
     * the hook is stable under the contract it documents.
     */
    it("settles instead of looping when a stable empty array is reused", () => {
        const empty: BusinessOrderResponse[] = [];
        const { result, rerender } = renderHook(({ list }) => useOrderSelection(list), {
            initialProps: { list: empty },
        });

        rerender({ list: empty });
        rerender({ list: empty });

        expect(result.current.selectedIds.size).toBe(0);
        expect(result.current.isAllSelected).toBe(false);
    });

    it("selects and clears every visible order with toggleAll", () => {
        const items = [order(A), order(B)];
        const { result } = renderHook(() => useOrderSelection(items));

        act(() => result.current.toggleAll());
        expect(result.current.isAllSelected).toBe(true);

        act(() => result.current.toggleAll());
        expect(result.current.selectedIds.size).toBe(0);
    });
});
