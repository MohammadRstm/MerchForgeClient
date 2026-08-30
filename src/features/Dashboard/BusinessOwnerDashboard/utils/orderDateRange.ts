import type { OrderDateFilterPreset } from "../types";

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

/**
 * Resolves a date-filter preset (plus, for "custom", a pair of yyyy-MM-dd strings
 * from <input type="date">) into the inclusive UTC ISO from/to bounds the backend's
 * OrdersQueryRequest.From/To expect. "all" resolves to no bounds at all.
 */
export const resolveOrderDateRange = (
    preset: OrderDateFilterPreset,
    customFrom: string,
    customTo: string
): { from?: string; to?: string } => {
    const now = new Date();

    switch (preset) {
        case "today":
            return { from: startOfDay(now).toISOString(), to: endOfDay(now).toISOString() };

        case "yesterday": {
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            return { from: startOfDay(yesterday).toISOString(), to: endOfDay(yesterday).toISOString() };
        }

        case "last7": {
            const start = new Date(now);
            start.setDate(start.getDate() - 6);
            return { from: startOfDay(start).toISOString(), to: endOfDay(now).toISOString() };
        }

        case "last30": {
            const start = new Date(now);
            start.setDate(start.getDate() - 29);
            return { from: startOfDay(start).toISOString(), to: endOfDay(now).toISOString() };
        }

        case "custom": {
            const from = customFrom ? startOfDay(new Date(`${customFrom}T00:00:00`)).toISOString() : undefined;
            const to = customTo ? endOfDay(new Date(`${customTo}T00:00:00`)).toISOString() : undefined;
            return { from, to };
        }

        case "all":
        default:
            return {};
    }
};
