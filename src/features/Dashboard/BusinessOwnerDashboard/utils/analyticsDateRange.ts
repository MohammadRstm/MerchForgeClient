import type { AnalyticsRangePreset } from "../types";

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

export const ANALYTICS_RANGE_PRESETS: { value: AnalyticsRangePreset; label: string }[] = [
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "3m", label: "3 Months" },
    { value: "6m", label: "6 Months" },
    { value: "1y", label: "1 Year" },
    { value: "custom", label: "Custom Range" },
];

/**
 * Resolves an analytics range preset (plus, for "custom", a pair of yyyy-MM-dd
 * strings from <input type="date">) into the inclusive UTC ISO from/to bounds the
 * backend's OrderAnalyticsQueryRequest expects. The backend itself decides daily vs.
 * monthly bucketing from the resulting span — this only picks the span.
 */
export const resolveAnalyticsDateRange = (
    preset: AnalyticsRangePreset,
    customFrom: string,
    customTo: string
): { from?: string; to?: string } => {
    const now = new Date();

    if (preset === "custom") {
        const from = customFrom ? startOfDay(new Date(`${customFrom}T00:00:00`)).toISOString() : undefined;
        const to = customTo ? endOfDay(new Date(`${customTo}T00:00:00`)).toISOString() : undefined;
        return { from, to };
    }

    const daysBack: Record<Exclude<AnalyticsRangePreset, "custom">, number> = {
        "7d": 6,
        "30d": 29,
        "3m": 89,
        "6m": 179,
        "1y": 364,
    };

    const start = new Date(now);
    start.setDate(start.getDate() - daysBack[preset]);

    return { from: startOfDay(start).toISOString(), to: endOfDay(now).toISOString() };
};
