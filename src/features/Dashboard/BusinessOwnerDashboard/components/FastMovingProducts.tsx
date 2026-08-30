import { resolveImageUrl } from "../utils/resolveImageUrl";
import type { InventoryProductPerformanceEntry } from "../types";

const MAX_ITEMS = 6;

type FastMovingProductsProps = {
    products: InventoryProductPerformanceEntry[];
    /** Length of the selected analytics period, in days — the denominator for units/day velocity. */
    periodDays: number;
};

/**
 * Fastest-selling tracked products in the selected period, each paired with its
 * days-of-stock-remaining forecast. No forecast is shown for a product with zero
 * sales in the period — there's nothing to project from, so this deliberately shows
 * "Not enough sales data" rather than dividing by zero or inventing a number.
 */
const FastMovingProducts = ({ products, periodDays }: FastMovingProductsProps) => {
    const ranked = products
        .filter((p) => p.unitsSold > 0)
        .map((p) => ({ ...p, velocity: p.unitsSold / Math.max(periodDays, 1) }))
        .sort((a, b) => b.velocity - a.velocity)
        .slice(0, MAX_ITEMS);

    return (
        <section className="business-dashboard-table-card product-ranking-card">
            <div className="analytics-header">
                <h3>Fastest Moving Products</h3>
            </div>

            {ranked.length === 0 ? (
                <p className="business-dashboard-table-message">No sales in the selected period yet.</p>
            ) : (
                <ol className="product-ranking-list">
                    {ranked.map((product, index) => {
                        const daysRemaining =
                            product.stockQuantity !== null && product.velocity > 0
                                ? Math.floor(product.stockQuantity / product.velocity)
                                : null;

                        return (
                            <li key={product.productId}>
                                <div className="product-ranking-row product-ranking-row--static">
                                    <span className="product-ranking-position">{index + 1}</span>

                                    {product.imageUrl ? (
                                        <img src={resolveImageUrl(product.imageUrl)} alt="" className="product-ranking-image" />
                                    ) : (
                                        <span className="product-ranking-image product-ranking-image--placeholder" aria-hidden="true">
                                            {product.title.charAt(0).toUpperCase()}
                                        </span>
                                    )}

                                    <div className="product-ranking-body">
                                        <span className="product-ranking-title">{product.title}</span>
                                        <span className="product-ranking-category">
                                            {product.velocity.toFixed(1)} units/day
                                        </span>
                                    </div>

                                    <div className="product-ranking-stats">
                                        <span className="product-ranking-stat--emphasized">{product.unitsSold} sold</span>
                                        {product.stockQuantity === null ? (
                                            <span className="business-dashboard-form-hint">Not tracked</span>
                                        ) : daysRemaining === null ? (
                                            <span className="business-dashboard-form-hint">Not enough sales data</span>
                                        ) : (
                                            <span
                                                className={
                                                    daysRemaining <= 7
                                                        ? "analytics-change analytics-change--down"
                                                        : "business-dashboard-form-hint"
                                                }
                                            >
                                                ~{daysRemaining} day{daysRemaining === 1 ? "" : "s"} of stock left
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ol>
            )}
        </section>
    );
};

export default FastMovingProducts;
