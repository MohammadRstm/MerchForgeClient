import { classifyRisk } from "../utils/inventoryRisk";
import type { InventoryCategoryPerformanceEntry, InventoryProductPerformanceEntry } from "../types";

const NO_SALE_DAYS_THRESHOLD = 60;

type Insight = { key: string; label: string; text: string };

const daysSince = (isoDate: string) => Math.floor((Date.now() - new Date(isoDate).getTime()) / (1000 * 60 * 60 * 24));

const buildInsights = (
    products: InventoryProductPerformanceEntry[],
    categories: InventoryCategoryPerformanceEntry[],
    threshold: number,
    periodDays: number
): Insight[] => {
    const insights: Insight[] = [];

    const critical = products.filter((p) => {
        const risk = classifyRisk(p, threshold, periodDays);
        return risk === "Critical" || risk === "OutOfStock";
    });
    if (critical.length > 0) {
        insights.push({
            key: "restock-needed",
            label: "Restock needed",
            text: `${critical.length} product${critical.length === 1 ? " needs" : "s need"} restocking soon based on current sales pace.`,
        });
    }

    const fastest = [...products].filter((p) => p.unitsSold > 0).sort((a, b) => b.unitsSold - a.unitsSold)[0];
    if (fastest) {
        insights.push({
            key: "fastest-mover",
            label: "Fastest mover",
            text: `${fastest.title} sold ${fastest.unitsSold} unit${fastest.unitsSold === 1 ? "" : "s"} in the selected period.`,
        });
    }

    const deadStockCount = products.filter(
        (p) =>
            p.stockQuantity !== null &&
            p.stockQuantity > 0 &&
            (p.lastSaleAt === null || daysSince(p.lastSaleAt) >= NO_SALE_DAYS_THRESHOLD) &&
            daysSince(p.createdAt) >= 30
    ).length;
    if (deadStockCount > 0) {
        insights.push({
            key: "dead-stock",
            label: "Sitting idle",
            text: `${deadStockCount} product${deadStockCount === 1 ? " hasn't" : "s haven't"} sold in 60+ days despite being in stock.`,
        });
    }

    const topStockCategory = categories.filter((c) => c.unitsInStock > 0).sort((a, b) => b.unitsInStock - a.unitsInStock)[0];
    if (topStockCategory) {
        insights.push({
            key: "top-stock-category",
            label: "Most stock held",
            text: `${topStockCategory.categoryName} holds ${topStockCategory.unitsInStock} units across ${topStockCategory.trackedProductCount} tracked product${topStockCategory.trackedProductCount === 1 ? "" : "s"}.`,
        });
    }

    return insights;
};

type InventoryInsightsProps = {
    products: InventoryProductPerformanceEntry[];
    categories: InventoryCategoryPerformanceEntry[];
    threshold: number;
    periodDays: number;
};

const InventoryInsights = ({ products, categories, threshold, periodDays }: InventoryInsightsProps) => {
    const insights = buildInsights(products, categories, threshold, periodDays);

    if (insights.length === 0) return null;

    return (
        <ul className="product-insights">
            {insights.map((insight) => (
                <li key={insight.key} className="product-insight-card">
                    <span className="product-insight-label">{insight.label}</span>
                    <span className="product-insight-text">{insight.text}</span>
                </li>
            ))}
        </ul>
    );
};

export default InventoryInsights;
