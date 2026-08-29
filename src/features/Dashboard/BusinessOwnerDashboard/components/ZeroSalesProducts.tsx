import { currencyFormatter } from "../utils/chartMetrics";
import type { ProductPerformanceEntry } from "../types";

const RECENTLY_ADDED_DAYS = 14;
const MAX_ITEMS = 8;

const daysSince = (isoDate: string) => Math.floor((Date.now() - new Date(isoDate).getTime()) / (1000 * 60 * 60 * 24));

type ZeroSalesProductsProps = {
    products: ProductPerformanceEntry[];
    onSelectProduct: (productId: string) => void;
};

/** Products with zero sales in the selected period — framed by how long they've actually had to sell, so a 3-day-old listing doesn't read as a failing product. */
const ZeroSalesProducts = ({ products, onSelectProduct }: ZeroSalesProductsProps) => {
    const zeroSales = products
        .filter((p) => p.unitsSold === 0)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .slice(0, MAX_ITEMS);

    return (
        <section className="business-dashboard-table-card">
            <div className="business-dashboard-table-header">
                <h3>Products With No Sales</h3>
            </div>

            {zeroSales.length === 0 ? (
                <p className="business-dashboard-table-message">Every product sold at least once in the selected period.</p>
            ) : (
                <div className="business-dashboard-table-wrapper">
                    <table className="business-dashboard-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {zeroSales.map((product) => {
                                const age = daysSince(product.createdAt);
                                const isRecent = age <= RECENTLY_ADDED_DAYS;

                                return (
                                    <tr key={product.productId} className="business-dashboard-table-row--clickable" onClick={() => onSelectProduct(product.productId)}>
                                        <td>{product.title}</td>
                                        <td>{product.categoryName}</td>
                                        <td>{currencyFormatter.format(product.price)}</td>
                                        <td>
                                            <span className={`business-dashboard-badge business-dashboard-badge--status-${isRecent ? "trialing" : "pastdue"}`}>
                                                {isRecent
                                                    ? `No sales yet · Added ${age === 0 ? "today" : `${age}d ago`}`
                                                    : `No sales · Added ${age}d ago`}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="business-dashboard-button-ghost"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSelectProduct(product.productId);
                                                }}
                                            >
                                                View →
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default ZeroSalesProducts;
