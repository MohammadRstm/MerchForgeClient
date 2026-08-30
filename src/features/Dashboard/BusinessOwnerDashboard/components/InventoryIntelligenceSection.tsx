import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import InventoryAnalyticsSection from "./InventoryAnalyticsSection";
import InventoryInsights from "./InventoryInsights";
import FastMovingProducts from "./FastMovingProducts";
import InventoryRiskSection from "./InventoryRiskSection";
import LowStockAlertsSection from "./LowStockAlertsSection";
import OutOfStockSection from "./OutOfStockSection";
import UntrackedProductsSection from "./UntrackedProductsSection";
import DeadStockSection from "./DeadStockSection";
import CategoryInventoryAnalytics from "./CategoryInventoryAnalytics";
import type useInventoryAnalyticsSection from "../hooks/ui/useInventoryAnalyticsSection";
import type { StockAdjustmentProductRef } from "../types";

type InventoryIntelligenceSectionProps = {
    state: ReturnType<typeof useInventoryAnalyticsSection>;
    hasAnyProducts: boolean;
    lowStockThreshold: number;
    onAddStock: (product: StockAdjustmentProductRef) => void;
};

/**
 * Everything below the KPI cards and health donut: the range-scoped stock-movement
 * chart, deterministic insights, fast movers, risk categorization, low-stock/
 * out-of-stock/untracked callouts, dead stock, and category inventory analytics —
 * all driven by one shared fetch (useInventoryAnalyticsSection) so every section
 * reflects the same selected period.
 */
const InventoryIntelligenceSection = ({
    state,
    hasAnyProducts,
    lowStockThreshold,
    onAddStock,
}: InventoryIntelligenceSectionProps) => {
    if (!hasAnyProducts) {
        return (
            <section className="business-dashboard-table-card analytics-section">
                <div className="business-dashboard-table-header">
                    <h3>Inventory Performance</h3>
                </div>
                <p className="business-dashboard-table-message">
                    Your catalog is empty
                    <br />
                    <span className="business-dashboard-form-hint">Add your first product to start tracking inventory.</span>
                </p>
            </section>
        );
    }

    const { performance, performanceLoading, performanceError, from, to } = state;

    const periodDays = from && to
        ? Math.max(Math.round((new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24)), 1)
        : 1;

    return (
        <>
            <InventoryAnalyticsSection state={state} />

            {performance && (
                <InventoryInsights
                    products={performance.products}
                    categories={performance.categories}
                    threshold={lowStockThreshold}
                    periodDays={periodDays}
                />
            )}

            {performanceLoading ? (
                <div className="business-dashboard-table-card business-dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : performanceError ? (
                <div className="business-dashboard-table-card">
                    <p className="business-dashboard-table-message business-dashboard-table-message--error">
                        Unable to load inventory performance. Try again.
                    </p>
                </div>
            ) : performance ? (
                <>
                    <div className="product-performance-row">
                        <FastMovingProducts products={performance.products} periodDays={periodDays} />
                        <InventoryRiskSection products={performance.products} threshold={lowStockThreshold} periodDays={periodDays} />
                    </div>

                    <div className="product-performance-row">
                        <LowStockAlertsSection products={performance.products} threshold={lowStockThreshold} onAddStock={onAddStock} />
                        <OutOfStockSection products={performance.products} onAddStock={onAddStock} />
                    </div>

                    <UntrackedProductsSection
                        products={performance.products.filter((p) => p.stockQuantity === null)}
                        totalCount={performance.products.filter((p) => p.stockQuantity === null).length}
                    />

                    <DeadStockSection products={performance.products} />

                    <CategoryInventoryAnalytics categories={performance.categories} />
                </>
            ) : null}
        </>
    );
};

export default InventoryIntelligenceSection;
