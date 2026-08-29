import type { ProductPerformanceEntry } from "../types";

// A product counts as "declining" only when it actually had a meaningful previous
// baseline (avoids flagging a product that simply had 1 unit sell once) and has
// dropped by at least this much — a deliberate, documented threshold, not a guess
// rendered as fact.
const DECLINE_THRESHOLD_PERCENT = 20;
const MIN_PREVIOUS_UNITS_FOR_DECLINE_SIGNAL = 3;
const MAX_ITEMS = 6;

type AttentionItem = {
    product: ProductPerformanceEntry;
    reason: string;
};

type ProductsNeedingAttentionProps = {
    products: ProductPerformanceEntry[];
    onSelectProduct: (productId: string) => void;
};

const buildAttentionItems = (products: ProductPerformanceEntry[]): AttentionItem[] => {
    const declining: AttentionItem[] = [];
    const zeroSales: AttentionItem[] = [];

    for (const product of products) {
        if (
            product.previousUnitsSold >= MIN_PREVIOUS_UNITS_FOR_DECLINE_SIGNAL &&
            product.unitsSoldChangePercent !== null &&
            product.unitsSoldChangePercent <= -DECLINE_THRESHOLD_PERCENT
        ) {
            declining.push({
                product,
                reason: `Sales down ${Math.abs(product.unitsSoldChangePercent).toFixed(0)}% vs previous period`,
            });
        } else if (product.unitsSold === 0) {
            zeroSales.push({ product, reason: "0 sales in the selected period" });
        }
    }

    // Declining products are more actionable (something changed) than a product
    // that's simply never sold, so they lead the list.
    return [...declining, ...zeroSales].slice(0, MAX_ITEMS);
};

const ProductsNeedingAttention = ({ products, onSelectProduct }: ProductsNeedingAttentionProps) => {
    const items = buildAttentionItems(products);

    return (
        <section className="business-dashboard-table-card needs-attention">
            <div className="business-dashboard-table-header">
                <h3>Products That Need Attention</h3>
            </div>

            {items.length === 0 ? (
                <p className="business-dashboard-table-message">Nothing needs attention — every product is holding steady or better.</p>
            ) : (
                <ul className="needs-attention-list">
                    {items.map(({ product, reason }) => (
                        <li key={product.productId} className="needs-attention-item">
                            <span>
                                <strong>{product.title}</strong>
                                <br />
                                {reason}
                            </span>
                            <button
                                type="button"
                                className="business-dashboard-button-ghost"
                                onClick={() => onSelectProduct(product.productId)}
                            >
                                View Product →
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default ProductsNeedingAttention;
