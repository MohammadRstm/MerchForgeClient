import type { InventoryProductPerformanceEntry } from "../types";

const MAX_ITEMS = 8;
const NO_SALE_DAYS_THRESHOLD = 60;
const MIN_AGE_DAYS_TO_QUALIFY = 30;

const daysSince = (isoDate: string) => Math.floor((Date.now() - new Date(isoDate).getTime()) / (1000 * 60 * 60 * 24));

type DeadStockSectionProps = {
    products: InventoryProductPerformanceEntry[];
};

/**
 * Tracked products sitting on real stock with no recent sale — never or not in 60+
 * days — and old enough (30+ days since creation) to rule out. A newly added product
 * with zero sales yet is excluded on purpose, per the requirement not to mislabel a
 * fresh listing as "dead."
 */
const DeadStockSection = ({ products }: DeadStockSectionProps) => {
    const deadStock = products
        .filter((p) => p.stockQuantity !== null && p.stockQuantity > 0)
        .filter((p) => daysSince(p.createdAt) >= MIN_AGE_DAYS_TO_QUALIFY)
        .filter((p) => p.lastSaleAt === null || daysSince(p.lastSaleAt) >= NO_SALE_DAYS_THRESHOLD)
        .sort((a, b) => {
            const aDays = a.lastSaleAt ? daysSince(a.lastSaleAt) : daysSince(a.createdAt);
            const bDays = b.lastSaleAt ? daysSince(b.lastSaleAt) : daysSince(b.createdAt);
            return bDays - aDays;
        })
        .slice(0, MAX_ITEMS);

    return (
        <section className="business-dashboard-table-card">
            <div className="business-dashboard-table-header">
                <h3>Dead &amp; Slow-Moving Stock</h3>
            </div>

            {deadStock.length === 0 ? (
                <p className="business-dashboard-table-message">No tracked product has gone quiet for 60+ days.</p>
            ) : (
                <div className="business-dashboard-table-wrapper">
                    <table className="business-dashboard-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Last Sale</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deadStock.map((product) => (
                                <tr key={product.productId}>
                                    <td>{product.title}</td>
                                    <td>{product.categoryName}</td>
                                    <td>{product.stockQuantity} units</td>
                                    <td>
                                        {product.lastSaleAt
                                            ? `${daysSince(product.lastSaleAt)}d ago`
                                            : "Never sold"}
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

export default DeadStockSection;
