import type { ProductPerformanceEntry } from "../types";

// A product counts as "declining" only when it actually had a meaningful previous
// baseline (avoids flagging a product that simply had 1 unit sell once) and has
// dropped by at least this much — a deliberate, documented threshold, not a guess
// rendered as fact.
const DECLINE_THRESHOLD_PERCENT = 20;
const MIN_PREVIOUS_UNITS_FOR_DECLINE_SIGNAL = 3;

export type AttentionItem = {
    product: ProductPerformanceEntry;
    reason: string;
};

/** Every product that needs attention in the selected period — not capped here, since the caller decides how many to preview vs. show in the "view all" modal. */
export const buildAttentionItems = (products: ProductPerformanceEntry[]): AttentionItem[] => {
    const declining: AttentionItem[] = [];
    const zeroSales: AttentionItem[] = [];

    for (const product of products) {
        if (
            product.previousUnitsSold >= MIN_PREVIOUS_UNITS_FOR_DECLINE_SIGNAL &&
            product.unitsSoldChangePercent !== null &&
            product.unitsSoldChangePercent <= -DECLINE_THRESHOLD_PERCENT
        ) {
            declining.push({
                product,
                reason: `Sales down ${Math.abs(product.unitsSoldChangePercent).toFixed(0)}% vs previous period`,
            });
        } else if (product.unitsSold === 0) {
            zeroSales.push({ product, reason: "0 sales in the selected period" });
        }
    }

    // Declining products are more actionable (something changed) than a product
    // that's simply never sold, so they lead the list.
    return [...declining, ...zeroSales];
};
