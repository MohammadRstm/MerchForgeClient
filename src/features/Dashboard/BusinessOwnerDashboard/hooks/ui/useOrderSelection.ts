import { useState } from "react";
import type { BusinessOrderResponse } from "../../types";

/**
 * Bulk-selection state, scoped to whatever page of orders is currently loaded —
 * selection doesn't persist across a page/filter change, since the rows it referred
 * to may no longer be visible (or may mean something different now).
 */
const useOrderSelection = (items: BusinessOrderResponse[]) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Prunes stale ids when the page of orders changes. Adjusting state during
    // render, per
    // https://react.dev/reference/react/useState#storing-information-from-previous-renders,
    // rather than in an effect, so this doesn't trigger an extra cascading render.
    const [prevItems, setPrevItems] = useState(items);
    if (items !== prevItems) {
        setPrevItems(items);
        setSelectedIds((prev) => {
            if (prev.size === 0) return prev;

            const validIds = new Set(items.map((item) => item.id));
            const next = new Set([...prev].filter((id) => validIds.has(id)));

            return next.size === prev.size ? prev : next;
        });
    }

    const toggle = (orderId: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(orderId)) next.delete(orderId);
            else next.add(orderId);
            return next;
        });
    };

    const toggleAll = () => {
        setSelectedIds((prev) => (prev.size === items.length && items.length > 0 ? new Set() : new Set(items.map((item) => item.id))));
    };

    const clear = () => setSelectedIds(new Set());

    const selectedOrders = items.filter((item) => selectedIds.has(item.id));
    const isAllSelected = items.length > 0 && selectedIds.size === items.length;

    return {
        selectedIds,
        selectedOrders,
        toggle,
        toggleAll,
        clear,
        isAllSelected,
    };
};

export default useOrderSelection;
