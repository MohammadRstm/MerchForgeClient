import { resolveImageUrl } from "../utils/resolveImageUrl";
import ChangeIndicator from "./ChangeIndicator";
import { currencyFormatter, numberFormatter } from "../utils/chartMetrics";
import type { ProductAnalyticsMetric, ProductPerformanceEntry } from "../types";

const METRIC_LABEL: Record<ProductAnalyticsMetric, string> = {
    revenue: "Revenue",
    unitsSold: "Units Sold",
    orders: "Orders",
};

type ProductRankingListProps = {
    title: string;
    products: ProductPerformanceEntry[];
    /** Which figure is currently driving the sort — visually emphasized in each row. */
    metric: ProductAnalyticsMetric;
    /** Renders a Revenue | Units Sold | Orders switcher when provided. */
    metricOptions?: ProductAnalyticsMetric[];
    onMetricChange?: (metric: ProductAnalyticsMetric) => void;
    /** Best Sellers wants a trend arrow per row; Top Products doesn't need it twice alongside the ranking metric itself. */
    showTrend?: boolean;
    onSelectProduct: (productId: string) => void;
    emptyMessage: string;
};

const ProductRankingList = ({
    title,
    products,
    metric,
    metricOptions,
    onMetricChange,
    showTrend,
    onSelectProduct,
    emptyMessage,
}: ProductRankingListProps) => {
    return (
        <section className="business-dashboard-table-card product-ranking-card">
            <div className="analytics-header">
                <h3>{title}</h3>

                {metricOptions && onMetricChange && (
                    <div className="analytics-range-selector">
                        {metricOptions.map((option) => (
                            <button
                                key={option}
                                type="button"
                                className={`analytics-range-btn${metric === option ? " analytics-range-btn--active" : ""}`}
                                onClick={() => onMetricChange(option)}
                            >
                                {METRIC_LABEL[option]}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {products.length === 0 ? (
                <p className="business-dashboard-table-message">{emptyMessage}</p>
            ) : (
                <ol className="product-ranking-list">
                    {products.map((product, index) => (
                        <li key={product.productId}>
                            <button
                                type="button"
                                className="product-ranking-row"
                                onClick={() => onSelectProduct(product.productId)}
                            >
                                <span className="product-ranking-position">{index + 1}</span>

                                {product.imageUrl ? (
                                    <img
                                        src={resolveImageUrl(product.imageUrl)}
                                        alt=""
                                        className="product-ranking-image"
                                    />
                                ) : (
                                    <span className="product-ranking-image product-ranking-image--placeholder" aria-hidden="true">
                                        {product.title.charAt(0).toUpperCase()}
                                    </span>
                                )}

                                <div className="product-ranking-body">
                                    <span className="product-ranking-title">{product.title}</span>
                                    <span className="product-ranking-category">{product.categoryName}</span>
                                </div>

                                <div className="product-ranking-stats">
                                    <span className={metric === "unitsSold" ? "product-ranking-stat--emphasized" : undefined}>
                                        {numberFormatter.format(product.unitsSold)} sold
                                    </span>
                                    <span className={metric === "revenue" ? "product-ranking-stat--emphasized" : undefined}>
                                        {currencyFormatter.format(product.revenue)}
                                    </span>
                                    {showTrend && (
                                        <ChangeIndicator
                                            percent={
                                                metric === "revenue" ? product.revenueChangePercent : product.unitsSoldChangePercent
                                            }
                                            suffix="vs previous period"
                                        />
                                    )}
                                </div>
                            </button>
                        </li>
                    ))}
                </ol>
            )}
        </section>
    );
};

export default ProductRankingList;
