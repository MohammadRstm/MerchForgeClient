import { currencyFormatter } from "../utils/chartMetrics";
import type { CategoryPerformanceEntry, ProductPerformanceEntry } from "../types";

// Same thresholds ProductsNeedingAttention uses, kept in sync deliberately — an
// insight referencing "growing" or "needs attention" should count the same things
// those sections actually show.
const GROWTH_THRESHOLD_PERCENT = 20;
const MIN_PREVIOUS_UNITS_FOR_SIGNAL = 3;
const STRONG_CATEGORY_SHARE_PERCENT = 30;

type Insight = { key: string; label: string; text: string };

const buildInsights = (
    products: ProductPerformanceEntry[],
    categories: CategoryPerformanceEntry[],
    totalRevenue: number
): Insight[] => {
    const insights: Insight[] = [];

    const topProduct = [...products].filter((p) => p.revenue > 0).sort((a, b) => b.revenue - a.revenue)[0];
    if (topProduct) {
        insights.push({
            key: "top-product",
            label: "Your top product",
            text: `${topProduct.title} generated ${currencyFormatter.format(topProduct.revenue)} in revenue during the selected period.`,
        });
    }

    const topCategory = totalRevenue > 0 ? [...categories].sort((a, b) => b.revenue - a.revenue)[0] : undefined;
    if (topCategory) {
        const share = (topCategory.revenue / totalRevenue) * 100;
        if (share >= STRONG_CATEGORY_SHARE_PERCENT) {
            insights.push({
                key: "strong-category",
                label: "Strong category",
                text: `${topCategory.categoryName} generated ${share.toFixed(0)}% of your product revenue.`,
            });
        }
    }

    const zeroSalesCount = products.filter((p) => p.unitsSold === 0).length;
    if (zeroSalesCount > 0) {
        insights.push({
            key: "needs-attention",
            label: "Needs attention",
            text: `${zeroSalesCount} product${zeroSalesCount === 1 ? " hasn't" : "s haven't"} generated a sale in the selected period.`,
        });
    }

    const growing = [...products]
        .filter((p) => p.previousUnitsSold >= MIN_PREVIOUS_UNITS_FOR_SIGNAL)
        .filter((p) => (p.unitsSoldChangePercent ?? 0) >= GROWTH_THRESHOLD_PERCENT)
        .sort((a, b) => (b.unitsSoldChangePercent ?? 0) - (a.unitsSoldChangePercent ?? 0))[0];
    if (growing) {
        insights.push({
            key: "growing-product",
            label: "Growing product",
            text: `${growing.title} sales increased ${growing.unitsSoldChangePercent!.toFixed(0)}% compared with the previous period.`,
        });
    }

    return insights;
};

type ProductInsightsProps = {
    products: ProductPerformanceEntry[];
    categories: CategoryPerformanceEntry[];
    totalRevenue: number;
};

const ProductInsights = ({ products, categories, totalRevenue }: ProductInsightsProps) => {
    const insights = buildInsights(products, categories, totalRevenue);

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

export default ProductInsights;
