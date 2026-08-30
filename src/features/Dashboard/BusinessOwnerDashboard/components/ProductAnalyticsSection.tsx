import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import AnalyticsChart from "./AnalyticsChart";
import ChangeIndicator from "./ChangeIndicator";
import { ANALYTICS_RANGE_PRESETS } from "../utils/analyticsDateRange";
import { currencyFormatter, numberFormatter, orderCountMetric, revenueMetric, unitsSoldMetric } from "../utils/chartMetrics";
import type useProductAnalyticsSection from "../hooks/ui/useProductAnalyticsSection";

const REVENUE_METRIC = revenueMetric();
const UNITS_METRIC = unitsSoldMetric();
const ORDERS_METRIC = orderCountMetric();
const TOOLTIP_METRICS = [REVENUE_METRIC, UNITS_METRIC, ORDERS_METRIC];
const METRIC_CONFIG = { revenue: REVENUE_METRIC, unitsSold: UNITS_METRIC, orders: ORDERS_METRIC };

type ProductAnalyticsSectionProps = {
    state: ReturnType<typeof useProductAnalyticsSection>;
};

/** The chart+summary+range-selector half of the Product Performance block — the ranking/distribution/insight sections around it all share this same state, lifted one level up so every section reflects the same selected range from one fetch. */
const ProductAnalyticsSection = ({ state }: ProductAnalyticsSectionProps) => {
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

    const hasPointsInRange = (analytics?.points.length ?? 0) > 0 && analytics!.currentPeriod.orderCount > 0;
    const activeMetric = METRIC_CONFIG[metric];

    return (
        <section className="business-dashboard-table-card analytics-section">
            <div className="analytics-header">
                <div>
                    <h3>Product Performance</h3>
                    <p className="analytics-header-hint">Analytics for the selected period — your catalog above shows everything.</p>
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
                    className={`analytics-summary-block analytics-summary-block--revenue${metric === "revenue" ? " analytics-summary-block--active" : ""}`}
                    onClick={() => setMetric("revenue")}
                >
                    <span className="analytics-summary-label">Product Revenue</span>
                    <span className="analytics-summary-value">
                        {currencyFormatter.format(analytics?.currentPeriod.revenue ?? 0)}
                    </span>
                    <ChangeIndicator percent={analytics?.revenueChangePercent ?? null} />
                </button>

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
                    className={`analytics-summary-block analytics-summary-block--product-orders${metric === "orders" ? " analytics-summary-block--active" : ""}`}
                    onClick={() => setMetric("orders")}
                >
                    <span className="analytics-summary-label">Orders</span>
                    <span className="analytics-summary-value">
                        {numberFormatter.format(analytics?.currentPeriod.orderCount ?? 0)}
                    </span>
                    <ChangeIndicator percent={analytics?.orderCountChangePercent ?? null} />
                </button>
            </div>

            {analytics && analytics.currentPeriod.orderCount > 0 && (
                <p className="analytics-secondary-stat">
                    Average order product value:{" "}
                    <strong>{currencyFormatter.format(analytics.currentPeriod.revenue / analytics.currentPeriod.orderCount)}</strong>
                </p>
            )}

            <div className="analytics-chart-area" style={{ opacity: analyticsFetching && !analyticsLoading ? 0.6 : 1 }}>
                {isWaitingForCustomRange ? (
                    <p className="business-dashboard-table-message">Choose both dates to see the custom range.</p>
                ) : analyticsLoading ? (
                    <div className="business-dashboard-table-loading">
                        <Spinner size={28} />
                    </div>
                ) : analyticsError ? (
                    <p className="business-dashboard-table-message business-dashboard-table-message--error">
                        Unable to load product analytics. Try again.
                    </p>
                ) : !hasPointsInRange ? (
                    <p className="business-dashboard-table-message">
                        Your products are ready to sell
                        <br />
                        <span className="business-dashboard-form-hint">
                            Once customers start placing orders, product performance data will appear here.
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

export default ProductAnalyticsSection;
