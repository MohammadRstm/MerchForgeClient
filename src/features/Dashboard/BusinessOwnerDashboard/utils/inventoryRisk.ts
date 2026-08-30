import type { InventoryProductPerformanceEntry, InventoryRiskLevel } from "../types";

const CRITICAL_DAYS_REMAINING = 7;
const WATCH_DAYS_REMAINING = 30;

/**
 * Deterministic restock-urgency bucket — combines the threshold (a fixed line) with
 * sales velocity (how fast that line is actually approaching), which is a stronger
 * signal than the threshold alone. A product with no sales data never lands in
 * Critical/Watch on velocity grounds — there's nothing to forecast from — so it can
 * only get there via the threshold check, same as Low Stock Alerts.
 */
export const classifyRisk = (
    product: InventoryProductPerformanceEntry,
    threshold: number,
    periodDays: number
): InventoryRiskLevel | null => {
    if (product.stockQuantity === null) return null; // untracked — no risk concept
    if (product.stockQuantity === 0) return "OutOfStock";

    const velocity = product.unitsSold / Math.max(periodDays, 1);
    const daysRemaining = velocity > 0 ? product.stockQuantity / velocity : null;

    if (product.stockQuantity <= threshold || (daysRemaining !== null && daysRemaining <= CRITICAL_DAYS_REMAINING)) {
        return "Critical";
    }
    if (daysRemaining !== null && daysRemaining <= WATCH_DAYS_REMAINING) {
        return "Watch";
    }
    return "Healthy";
};
