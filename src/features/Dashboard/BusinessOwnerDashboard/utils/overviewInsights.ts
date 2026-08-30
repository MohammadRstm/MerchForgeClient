import { currencyFormatter } from "./chartMetrics";
import type { ProductPerformanceEntry } from "../types";

// Small enough that a percent swing below this is normal week-to-week noise, not
// something worth calling out as a trend.
const TREND_THRESHOLD_PERCENT = 5;
const MAX_INSIGHTS = 4;

export type OverviewInsight = { key: string; text: string };

type BuildInsightsArgs = {
    revenueChangePercent: number | null;
    orderCountChangePercent: number | null;
    topProduct: ProductPerformanceEntry | undefined;
    outOfStockCount: number;
    newCustomersInPeriod: number;
};

/** Deterministic, real-data-only observations — no AI, no invented trends. Every insight traces back to a number already fetched for another section of the page. */
export const buildOverviewInsights = ({
    revenueChangePercent,
    orderCountChangePercent,
    topProduct,
    outOfStockCount,
    newCustomersInPeriod,
}: BuildInsightsArgs): OverviewInsight[] => {
    const insights: OverviewInsight[] = [];

    if (revenueChangePercent !== null && Math.abs(revenueChangePercent) >= TREND_THRESHOLD_PERCENT) {
        const direction = revenueChangePercent >= 0 ? "up" : "down";
        insights.push({
            key: "revenue-trend",
            text: `Revenue is ${direction} ${Math.abs(revenueChangePercent).toFixed(0)}% compared with the previous period.`,
        });
    }

    if (topProduct && topProduct.revenue > 0) {
        insights.push({
            key: "top-product",
            text: `${topProduct.title} is your best-selling product this period, with ${currencyFormatter.format(topProduct.revenue)} in revenue.`,
        });
    }

    if (outOfStockCount > 0) {
        insights.push({
            key: "out-of-stock",
            text: `${outOfStockCount} product${outOfStockCount === 1 ? " is" : "s are"} currently out of stock.`,
        });
    }

    if (orderCountChangePercent !== null && Math.abs(orderCountChangePercent) >= TREND_THRESHOLD_PERCENT) {
        const direction = orderCountChangePercent >= 0 ? "up" : "down";
        insights.push({
            key: "orders-trend",
            text: `Orders are ${direction} ${Math.abs(orderCountChangePercent).toFixed(0)}% compared with the previous period.`,
        });
    }

    if (newCustomersInPeriod > 0) {
        insights.push({
            key: "new-customers",
            text: `${newCustomersInPeriod} new customer${newCustomersInPeriod === 1 ? "" : "s"} bought from you this period.`,
        });
    }

    return insights.slice(0, MAX_INSIGHTS);
};
