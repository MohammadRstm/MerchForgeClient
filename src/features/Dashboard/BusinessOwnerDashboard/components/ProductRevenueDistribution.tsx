import { currencyFormatter } from "../utils/chartMetrics";
import type { ProductPerformanceEntry } from "../types";

type ProductRevenueDistributionProps = {
    products: ProductPerformanceEntry[];
    totalRevenue: number;
    totalProductCount: number;
    onSelectProduct: (productId: string) => void;
    onViewAll: () => void;
};

const TAKE = 8;

/** Top products by revenue, as a horizontal bar chart scaled to the leading product — not a generic Recharts BarChart, since a simple width-scaled div reads cleaner at this size and avoids a second charting pattern for something this simple. */
const ProductRevenueDistribution = ({
    products,
    totalRevenue,
    totalProductCount,
    onSelectProduct,
    onViewAll,
}: ProductRevenueDistributionProps) => {
    const ranked = [...products].filter((p) => p.revenue > 0).sort((a, b) => b.revenue - a.revenue).slice(0, TAKE);
    const maxRevenue = ranked[0]?.revenue ?? 0;

    return (
        <section className="business-dashboard-table-card">
            <div className="business-dashboard-table-header">
                <h3>Product Revenue Distribution</h3>
            </div>

            {ranked.length === 0 ? (
                <p className="business-dashboard-table-message">No product revenue in the selected period.</p>
            ) : (
                <>
                    <ul className="revenue-distribution-list">
                        {ranked.map((product) => {
                            const widthPercent = maxRevenue > 0 ? (product.revenue / maxRevenue) * 100 : 0;
                            const shareOfTotal = totalRevenue > 0 ? (product.revenue / totalRevenue) * 100 : 0;

                            return (
                                <li key={product.productId}>
                                    <button
                                        type="button"
                                        className="revenue-distribution-row"
                                        onClick={() => onSelectProduct(product.productId)}
                                    >
                                        <span className="revenue-distribution-name">{product.title}</span>
                                        <div className="revenue-distribution-bar-track">
                                            <div className="revenue-distribution-bar" style={{ width: `${widthPercent}%` }} />
                                        </div>
                                        <span className="revenue-distribution-value">
                                            {currencyFormatter.format(product.revenue)}
                                            <span className="revenue-distribution-share">{shareOfTotal.toFixed(0)}%</span>
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    {totalProductCount > ranked.length && (
                        <button type="button" className="business-dashboard-button-ghost revenue-distribution-view-all" onClick={onViewAll}>
                            View all products →
                        </button>
                    )}
                </>
            )}
        </section>
    );
};

export default ProductRevenueDistribution;
