import { resolveImageUrl } from "../utils/resolveImageUrl";
import type { InventoryProductPerformanceEntry, StockAdjustmentProductRef } from "../types";

const MAX_ITEMS = 8;

type LowStockAlertsSectionProps = {
    products: InventoryProductPerformanceEntry[];
    threshold: number;
    onAddStock: (product: StockAdjustmentProductRef) => void;
};

/** Tracked products at or below the business's low-stock threshold, most urgent (fewest units) first. */
const LowStockAlertsSection = ({ products, threshold, onAddStock }: LowStockAlertsSectionProps) => {
    const lowStock = products
        .filter((p) => p.stockQuantity !== null && p.stockQuantity > 0 && p.stockQuantity <= threshold)
        .sort((a, b) => (a.stockQuantity ?? 0) - (b.stockQuantity ?? 0))
        .slice(0, MAX_ITEMS);

    return (
        <section className="business-dashboard-table-card needs-attention">
            <div className="business-dashboard-table-header">
                <h3>Low Stock Alerts</h3>
            </div>

            {lowStock.length === 0 ? (
                <p className="business-dashboard-table-message">Nothing is running low right now.</p>
            ) : (
                <ul className="needs-attention-list">
                    {lowStock.map((product) => (
                        <li key={product.productId} className="needs-attention-item">
                            <span className="inventory-alert-row">
                                {product.imageUrl ? (
                                    <img
                                        src={resolveImageUrl(product.imageUrl)}
                                        alt=""
                                        className="business-dashboard-product-thumb"
                                    />
                                ) : (
                                    <span className="business-dashboard-product-thumb-placeholder" aria-hidden="true">
                                        {product.title.charAt(0).toUpperCase()}
                                    </span>
                                )}
                                <span>
                                    <strong>{product.title}</strong>
                                    <br />
                                    <span className="business-dashboard-badge business-dashboard-badge--status-pastdue">
                                        {product.stockQuantity} left
                                    </span>{" "}
                                    of {threshold} threshold
                                </span>
                            </span>
                            <button
                                type="button"
                                className="business-dashboard-button-secondary"
                                onClick={() =>
                                    onAddStock({ id: product.productId, title: product.title, stockQuantity: product.stockQuantity })
                                }
                            >
                                Add Stock
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default LowStockAlertsSection;
