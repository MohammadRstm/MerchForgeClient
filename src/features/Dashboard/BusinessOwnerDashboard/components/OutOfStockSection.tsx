import { currencyFormatter } from "../utils/chartMetrics";
import type { InventoryProductPerformanceEntry, StockAdjustmentProductRef } from "../types";

const MAX_ITEMS = 8;

type OutOfStockSectionProps = {
    products: InventoryProductPerformanceEntry[];
    onAddStock: (product: StockAdjustmentProductRef) => void;
};

/** Tracked products at exactly 0 units. Deliberately never includes untracked products — those have no stock concept at all, not "0". */
const OutOfStockSection = ({ products, onAddStock }: OutOfStockSectionProps) => {
    const outOfStock = products
        .filter((p) => p.stockQuantity === 0)
        .sort((a, b) => b.unitsSold - a.unitsSold)
        .slice(0, MAX_ITEMS);

    return (
        <section className="business-dashboard-table-card">
            <div className="business-dashboard-table-header">
                <h3>Out of Stock</h3>
            </div>

            {outOfStock.length === 0 ? (
                <p className="business-dashboard-table-message">No tracked products are out of stock.</p>
            ) : (
                <div className="business-dashboard-table-wrapper">
                    <table className="business-dashboard-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Units Sold</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {outOfStock.map((product) => (
                                <tr key={product.productId}>
                                    <td>{product.title}</td>
                                    <td>{product.categoryName}</td>
                                    <td>
                                        {product.unitsSold} · {currencyFormatter.format(product.revenue)}
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="business-dashboard-button-secondary"
                                            onClick={() =>
                                                onAddStock({
                                                    id: product.productId,
                                                    title: product.title,
                                                    stockQuantity: product.stockQuantity,
                                                })
                                            }
                                        >
                                            Add Stock
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default OutOfStockSection;
