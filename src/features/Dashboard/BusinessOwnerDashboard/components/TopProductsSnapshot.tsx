import { useNavigate } from "react-router";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { routes } from "../../../../config/routes";
import { resolveImageUrl } from "../utils/resolveImageUrl";
import { currencyFormatter, numberFormatter } from "../utils/chartMetrics";
import type { ProductPerformanceEntry } from "../types";

type TopProductsSnapshotProps = {
    products: ProductPerformanceEntry[];
    isLoading: boolean;
    isError: boolean;
};

const TopProductsSnapshot = ({ products, isLoading, isError }: TopProductsSnapshotProps) => {
    const navigate = useNavigate();

    return (
        <section className="business-dashboard-table-card">
            <div className="business-dashboard-table-header">
                <h3>Top Performing Products</h3>
            </div>

            {isLoading ? (
                <div className="business-dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="business-dashboard-table-message business-dashboard-table-message--error">
                    Unable to load product performance right now.
                </p>
            ) : products.length === 0 ? (
                <p className="business-dashboard-table-message">No sales in the selected period yet.</p>
            ) : (
                <>
                    <ol className="product-ranking-list">
                        {products.map((product, index) => (
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
                                        <span className="product-ranking-category">{numberFormatter.format(product.unitsSold)} sold</span>
                                    </div>

                                    <div className="product-ranking-stats">
                                        <span className="product-ranking-stat--emphasized">
                                            {currencyFormatter.format(product.revenue)}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ol>

                    <button
                        type="button"
                        className="business-dashboard-button-ghost overview-section-link"
                        onClick={() => navigate(routes.DASHBOARD_PRODUCTS)}
                    >
                        View Product Analytics →
                    </button>
                </>
            )}
        </section>
    );
};

export default TopProductsSnapshot;
