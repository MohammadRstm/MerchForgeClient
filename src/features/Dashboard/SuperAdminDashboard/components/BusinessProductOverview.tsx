import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { formatCurrency } from "../utils/formatCurrency";
import type { ProductPerformanceEntry } from "../../BusinessOwnerDashboard/types";
import type { KeyCount } from "../types";

type BusinessProductOverviewProps = {
    productCount: number;
    productsByCategory: KeyCount[];
    productDraftCount: number;
    topProducts: ProductPerformanceEntry[];
    currency: string;
    isLoading: boolean;
    isError: boolean;
};

const BusinessProductOverview = ({
    productCount,
    productsByCategory,
    productDraftCount,
    topProducts,
    currency,
    isLoading,
    isError,
}: BusinessProductOverviewProps) => {
    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Products</h3>
            </div>

            {productCount === 0 ? (
                <p className="dashboard-table-message">No products have been added yet.</p>
            ) : (
                <>
                    <dl className="business-detail-grid">
                        <div>
                            <dt>Total products</dt>
                            <dd>{productCount}</dd>
                        </div>
                        <div>
                            <dt>Draft products</dt>
                            <dd>{productDraftCount}</dd>
                        </div>
                    </dl>

                    {productsByCategory.length > 0 && (
                        <div className="product-overview-categories">
                            {productsByCategory.map((entry) => (
                                <span key={entry.key} className="dashboard-badge dashboard-badge--neutral">
                                    {entry.key} · {entry.count}
                                </span>
                            ))}
                        </div>
                    )}

                    <h4 className="dashboard-subsection-heading">Top products</h4>

                    {isLoading ? (
                        <div className="dashboard-table-loading">
                            <Spinner size={20} />
                        </div>
                    ) : isError ? (
                        <p className="dashboard-table-message dashboard-table-message--error">
                            Unable to load product performance.
                        </p>
                    ) : topProducts.length === 0 ? (
                        <p className="dashboard-table-message">No sales recorded yet.</p>
                    ) : (
                        <ol className="product-overview-top-list">
                            {topProducts.map((product, index) => (
                                <li key={product.productId}>
                                    <span className="product-overview-rank">{index + 1}</span>
                                    <span className="product-overview-title">{product.title}</span>
                                    <span className="dashboard-table-muted">{product.unitsSold} sold</span>
                                    <span className="product-overview-revenue">
                                        {formatCurrency(product.revenue, currency)}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    )}
                </>
            )}
        </section>
    );
};

export default BusinessProductOverview;
