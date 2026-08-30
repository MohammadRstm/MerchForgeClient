/** One bucketed chart point — always a period plus whatever numeric metrics that analytics response carries. */
export type ChartPoint = { period: string } & Record<string, number | string>;

/**
 * Describes one plottable/tooltip-able metric so AnalyticsChart/AnalyticsTooltip stay
 * generic — the same two components render the Orders chart (revenue/orders),
 * the Products chart (revenue/units sold/orders), and a single product's trend
 * chart (revenue or units sold), without a second charting implementation for any
 * of them.
 */
export type ChartMetricConfig = {
    key: string;
    label: string;
    color: string;
    formatValue: (value: number) => string;
    formatValueCompact: (value: number) => string;
};

export const currencyFormatter = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });

export const compactCurrencyFormatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
});

export const numberFormatter = new Intl.NumberFormat(undefined);

export const compactNumberFormatter = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 });

/** Reused across every analytics chart in the dashboard, not invented per-section — matches BreakdownPieChart's existing palette. */
export const CHART_COLORS = {
    revenue: "#ff9b00",
    secondary: "#3b82f6",
    tertiary: "#a855f7",
} as const;

export const revenueMetric = (label = "Revenue"): ChartMetricConfig => ({
    key: "revenue",
    label,
    color: CHART_COLORS.revenue,
    formatValue: (v) => currencyFormatter.format(v),
    formatValueCompact: (v) => compactCurrencyFormatter.format(v),
});

export const unitsSoldMetric = (label = "Units sold"): ChartMetricConfig => ({
    key: "unitsSold",
    label,
    color: CHART_COLORS.secondary,
    formatValue: (v) => numberFormatter.format(v),
    formatValueCompact: (v) => compactNumberFormatter.format(v),
});

export const orderCountMetric = (label = "Orders", color: string = CHART_COLORS.tertiary): ChartMetricConfig => ({
    key: "orderCount",
    label,
    color,
    formatValue: (v) => numberFormatter.format(v),
    formatValueCompact: (v) => compactNumberFormatter.format(v),
});
