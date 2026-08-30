import { useState } from "react";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import ProductAnalyticsSection from "./ProductAnalyticsSection";
import ProductInsights from "./ProductInsights";
import ProductRankingList from "./ProductRankingList";
import ProductRevenueDistribution from "./ProductRevenueDistribution";
import ProductsNeedingAttention from "./ProductsNeedingAttention";
import ZeroSalesProducts from "./ZeroSalesProducts";
import CategoryPerformanceSection from "./CategoryPerformanceSection";
import type useProductAnalyticsSection from "../hooks/ui/useProductAnalyticsSection";
import type { ProductAnalyticsMetric } from "../types";

type ProductIntelligenceSectionProps = {
    state: ReturnType<typeof useProductAnalyticsSection>;
    hasAnyProducts: boolean;
    onSelectProduct: (productId: string) => void;
    onViewAllProducts: () => void;
};

/**
 * Everything below the catalog KPIs: the range-scoped chart, ranked lists, revenue
 * distribution, needs-attention/zero-sales callouts, and category breakdown — all
 * driven by one shared fetch (useProductAnalyticsSection, owned by the page hook) so
 * every section reflects the same selected period.
 */
const ProductIntelligenceSection = ({
    state,
    hasAnyProducts,
    onSelectProduct,
    onViewAllProducts,
}: ProductIntelligenceSectionProps) => {
    const [topProductsMetric, setTopProductsMetric] = useState<ProductAnalyticsMetric>("revenue");

    if (!hasAnyProducts) {
        return (
            <section className="business-dashboard-table-card analytics-section">
                <div className="business-dashboard-table-header">
                    <h3>Product Performance</h3>
                </div>
                <p className="business-dashboard-table-message">
                    Your catalog is empty
                    <br />
                    <span className="business-dashboard-form-hint">Add your first product to start building your store.</span>
                </p>
            </section>
        );
    }

    const { performance, performanceLoading, performanceError } = state;

    return (
        <>
            <ProductAnalyticsSection state={state} />

            {performance && (
                <ProductInsights
                    products={performance.products}
                    categories={performance.categories}
                    totalRevenue={performance.totalRevenue}
                />
            )}

            {performanceLoading ? (
                <div className="business-dashboard-table-card business-dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : performanceError ? (
                <div className="business-dashboard-table-card">
                    <p className="business-dashboard-table-message business-dashboard-table-message--error">
                        Unable to load product performance. Try again.
                    </p>
                </div>
            ) : performance ? (
                <>
                    <div className="product-performance-row">
                        <ProductRankingList
                            title="Top Products"
                            products={[...performance.products]
                                .filter((p) => (topProductsMetric === "revenue" ? p.revenue > 0 : topProductsMetric === "unitsSold" ? p.unitsSold > 0 : p.orderCount > 0))
                                .sort((a, b) =>
                                    topProductsMetric === "revenue"
                                        ? b.revenue - a.revenue
                                        : topProductsMetric === "unitsSold"
                                          ? b.unitsSold - a.unitsSold
                                          : b.orderCount - a.orderCount
                                )
                                .slice(0, 5)}
                            metric={topProductsMetric}
                            metricOptions={["revenue", "unitsSold", "orders"]}
                            onMetricChange={setTopProductsMetric}
                            onSelectProduct={onSelectProduct}
                            emptyMessage="No sales in the selected period yet."
                        />

                        <ProductRankingList
                            title="Best Sellers"
                            products={[...performance.products]
                                .filter((p) => p.unitsSold > 0)
                                .sort((a, b) => b.unitsSold - a.unitsSold)
                                .slice(0, 5)}
                            metric="unitsSold"
                            showTrend
                            onSelectProduct={onSelectProduct}
                            emptyMessage="No units sold in the selected period yet."
                        />
                    </div>

                    <ProductRevenueDistribution
                        products={performance.products}
                        totalRevenue={performance.totalRevenue}
                        totalProductCount={performance.products.length}
                        onSelectProduct={onSelectProduct}
                        onViewAll={onViewAllProducts}
                    />

                    <div className="product-performance-row">
                        <ProductsNeedingAttention products={performance.products} onSelectProduct={onSelectProduct} />
                        <ZeroSalesProducts products={performance.products} onSelectProduct={onSelectProduct} />
                    </div>

                    <CategoryPerformanceSection categories={performance.categories} />
                </>
            ) : null}
        </>
    );
};

export default ProductIntelligenceSection;
