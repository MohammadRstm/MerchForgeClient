import { currencyFormatter } from "../utils/chartMetrics";
import type { InventoryProductPerformanceEntry } from "../types";

const MAX_ITEMS = 8;

type UntrackedProductsSectionProps = {
    products: InventoryProductPerformanceEntry[];
    totalCount: number;
};

/** Untracked products, framed as a legitimate configuration choice — no warning styling, no "fix this" call to action. Sales still show, since untracked doesn't mean "doesn't sell." */
const UntrackedProductsSection = ({ products, totalCount }: UntrackedProductsSectionProps) => {
    const untracked = [...products].sort((a, b) => b.revenue - a.revenue).slice(0, MAX_ITEMS);

    return (
        <section className="business-dashboard-table-card">
            <div className="business-dashboard-table-header">
                <h3>Untracked Products</h3>
            </div>

            {untracked.length === 0 ? (
                <p className="business-dashboard-table-message">Every product in your catalog has stock tracking enabled.</p>
            ) : (
                <>
                    <p className="business-dashboard-form-hint" style={{ padding: "0 0 12px" }}>
                        These products don't have a stock count set — that's a normal choice for made-to-order or unlimited items,
                        not a problem to fix.
                    </p>
                    <div className="business-dashboard-table-wrapper">
                        <table className="business-dashboard-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Units Sold</th>
                                    <th>Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {untracked.map((product) => (
                                    <tr key={product.productId}>
                                        <td>{product.title}</td>
                                        <td>{product.categoryName}</td>
                                        <td>{product.unitsSold}</td>
                                        <td>{currencyFormatter.format(product.revenue)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {totalCount > untracked.length && (
                        <p className="business-dashboard-form-hint" style={{ padding: "12px 0 0" }}>
                            +{totalCount - untracked.length} more untracked product{totalCount - untracked.length === 1 ? "" : "s"}.
                        </p>
                    )}
                </>
            )}
        </section>
    );
};

export default UntrackedProductsSection;
