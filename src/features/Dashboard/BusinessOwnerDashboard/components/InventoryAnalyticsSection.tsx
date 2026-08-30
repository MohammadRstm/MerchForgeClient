import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import AnalyticsChart from "./AnalyticsChart";
import ChangeIndicator from "./ChangeIndicator";
import { ANALYTICS_RANGE_PRESETS } from "../utils/analyticsDateRange";
import { CHART_COLORS, numberFormatter, unitsSoldMetric, type ChartMetricConfig } from "../utils/chartMetrics";
import type useInventoryAnalyticsSection from "../hooks/ui/useInventoryAnalyticsSection";

const UNITS_SOLD_METRIC = unitsSoldMetric("Units sold");
const STOCK_ADDED_METRIC: ChartMetricConfig = {
    key: "stockAdded",
    label: "Stock added",
    color: "#12875a",
    formatValue: (v) => numberFormatter.format(v),
    formatValueCompact: (v) => numberFormatter.format(v),
};
const STOCK_REMOVED_METRIC: ChartMetricConfig = {
    key: "stockRemoved",
    label: "Stock removed",
    color: CHART_COLORS.tertiary,
    formatValue: (v) => numberFormatter.format(v),
    formatValueCompact: (v) => numberFormatter.format(v),
};
const TOOLTIP_METRICS = [UNITS_SOLD_METRIC, STOCK_ADDED_METRIC, STOCK_REMOVED_METRIC];
const METRIC_CONFIG = { unitsSold: UNITS_SOLD_METRIC, stockAdded: STOCK_ADDED_METRIC, stockRemoved: STOCK_REMOVED_METRIC };

type InventoryAnalyticsSectionProps = {
    state: ReturnType<typeof useInventoryAnalyticsSection>;
};

/** The chart+summary+range-selector half of Inventory Performance — same infrastructure (AnalyticsChart/AnalyticsTooltip/ANALYTICS_RANGE_PRESETS) the Orders/Products pages already use, plotting units sold vs. stock added/removed instead of revenue. */
const InventoryAnalyticsSection = ({ state }: InventoryAnalyticsSectionProps) => {
    const {
        rangePreset,
        changeRangePreset,
        customFrom,
        customTo,
        setCustomFrom,
        setCustomTo,
        isWaitingForCustomRange,
        metric,
        setMetric,
        analytics,
        analyticsLoading,
        analyticsFetching,
        analyticsError,
    } = state;

    const hasPointsInRange =
        (analytics?.points.length ?? 0) > 0 &&
        (analytics!.currentPeriod.unitsSold > 0 || analytics!.currentPeriod.stockAdded > 0 || analytics!.currentPeriod.stockRemoved > 0);
    const activeMetric = METRIC_CONFIG[metric];

    return (
        <section className="business-dashboard-table-card analytics-section">
            <div className="analytics-header">
                <div>
                    <h3>Inventory Performance</h3>
                    <p className="analytics-header-hint">How stock moved over the selected period — sales, restocks, and manual removals.</p>
                </div>

                <div className="analytics-range-selector">
                    {ANALYTICS_RANGE_PRESETS.map((preset) => (
                        <button
                            key={preset.value}
                            type="button"
                            className={`analytics-range-btn${rangePreset === preset.value ? " analytics-range-btn--active" : ""}`}
                            onClick={() => changeRangePreset(preset.value)}
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>
            </div>

            {rangePreset === "custom" && (
                <div className="orders-toolbar-date-range analytics-custom-range">
                    <input
                        type="date"
                        className="business-dashboard-form-input"
                        aria-label="From date"
                        value={customFrom}
                        onChange={(e) => setCustomFrom(e.target.value)}
                    />
                    <span>to</span>
                    <input
                        type="date"
                        className="business-dashboard-form-input"
                        aria-label="To date"
                        value={customTo}
                        min={customFrom || undefined}
                        onChange={(e) => setCustomTo(e.target.value)}
                    />
                </div>
            )}

            <div className="analytics-summary analytics-summary--triple">
                <button
                    type="button"
                    className={`analytics-summary-block analytics-summary-block--units${metric === "unitsSold" ? " analytics-summary-block--active" : ""}`}
                    onClick={() => setMetric("unitsSold")}
                >
                    <span className="analytics-summary-label">Units Sold</span>
                    <span className="analytics-summary-value">
                        {numberFormatter.format(analytics?.currentPeriod.unitsSold ?? 0)}
                    </span>
                    <ChangeIndicator percent={analytics?.unitsSoldChangePercent ?? null} />
                </button>

                <button
                    type="button"
                    className={`analytics-summary-block${metric === "stockAdded" ? " analytics-summary-block--active" : ""}`}
                    onClick={() => setMetric("stockAdded")}
                >
                    <span className="analytics-summary-label">Stock Added</span>
                    <span className="analytics-summary-value">
                        {numberFormatter.format(analytics?.currentPeriod.stockAdded ?? 0)}
                    </span>
                </button>

                <button
                    type="button"
                    className={`analytics-summary-block${metric === "stockRemoved" ? " analytics-summary-block--active" : ""}`}
                    onClick={() => setMetric("stockRemoved")}
                >
                    <span className="analytics-summary-label">Stock Removed</span>
                    <span className="analytics-summary-value">
                        {numberFormatter.format(analytics?.currentPeriod.stockRemoved ?? 0)}
                    </span>
                </button>
            </div>

            <div className="analytics-chart-area" style={{ opacity: analyticsFetching && !analyticsLoading ? 0.6 : 1 }}>
                {isWaitingForCustomRange ? (
                    <p className="business-dashboard-table-message">Choose both dates to see the custom range.</p>
                ) : analyticsLoading ? (
                    <div className="business-dashboard-table-loading">
                        <Spinner size={28} />
                    </div>
                ) : analyticsError ? (
                    <p className="business-dashboard-table-message business-dashboard-table-message--error">
                        Unable to load inventory analytics. Try again.
                    </p>
                ) : !hasPointsInRange ? (
                    <p className="business-dashboard-table-message">
                        No stock activity in this period
                        <br />
                        <span className="business-dashboard-form-hint">
                            Sales, restocks, and manual adjustments will appear here once they happen.
                        </span>
                    </p>
                ) : (
                    <AnalyticsChart
                        points={analytics!.points}
                        activeMetric={activeMetric}
                        tooltipMetrics={TOOLTIP_METRICS}
                        granularity={analytics!.granularity}
                    />
                )}
            </div>
        </section>
    );
};

export default InventoryAnalyticsSection;
