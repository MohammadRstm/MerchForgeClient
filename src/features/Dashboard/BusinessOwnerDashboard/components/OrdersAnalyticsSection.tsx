import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import AnalyticsChart from "./AnalyticsChart";
import useOrdersAnalyticsSection from "../hooks/ui/useOrdersAnalyticsSection";
import { ANALYTICS_RANGE_PRESETS } from "../utils/analyticsDateRange";

const currencyFormatter = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });
const numberFormatter = new Intl.NumberFormat(undefined);

const ChangeIndicator = ({ percent }: { percent: number | null }) => {
    if (percent === null) return null;

    const isPositive = percent >= 0;

    return (
        <span className={`analytics-change${isPositive ? " analytics-change--up" : " analytics-change--down"}`}>
            {isPositive ? "↑" : "↓"} {Math.abs(percent).toFixed(1)}% vs previous period
        </span>
    );
};

type OrdersAnalyticsSectionProps = {
    businessId: string;
    /** Store-wide, unaffected by the selected range — drives the "no order data yet" empty state. */
    hasAnyOrders: boolean;
};

const OrdersAnalyticsSection = ({ businessId, hasAnyOrders }: OrdersAnalyticsSectionProps) => {
    const {
        rangePreset,
        changeRangePreset,
        customFrom,
        customTo,
        setCustomFrom,
        setCustomTo,
        metric,
        setMetric,
        analytics,
        isLoading,
        isFetching,
        isError,
        isWaitingForCustomRange,
    } = useOrdersAnalyticsSection(businessId);

    if (!hasAnyOrders) {
        return (
            <section className="business-dashboard-table-card analytics-section">
                <div className="business-dashboard-table-header">
                    <h3>Performance</h3>
                </div>
                <p className="business-dashboard-table-message">
                    No order data yet
                    <br />
                    <span className="business-dashboard-form-hint">
                        Once customers start placing orders, your performance analytics will appear here.
                    </span>
                </p>
            </section>
        );
    }

    const hasPointsInRange = (analytics?.points.length ?? 0) > 0 && analytics!.currentPeriod.orderCount > 0;

    return (
        <section className="business-dashboard-table-card analytics-section">
            <div className="analytics-header">
                <h3>Performance</h3>

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

            <div className="analytics-summary">
                <button
                    type="button"
                    className={`analytics-summary-block analytics-summary-block--revenue${metric === "revenue" ? " analytics-summary-block--active" : ""}`}
                    onClick={() => setMetric("revenue")}
                >
                    <span className="analytics-summary-label">Revenue</span>
                    <span className="analytics-summary-value">
                        {currencyFormatter.format(analytics?.currentPeriod.revenue ?? 0)}
                    </span>
                    <ChangeIndicator percent={analytics?.revenueChangePercent ?? null} />
                </button>

                <button
                    type="button"
                    className={`analytics-summary-block analytics-summary-block--orders${metric === "orders" ? " analytics-summary-block--active" : ""}`}
                    onClick={() => setMetric("orders")}
                >
                    <span className="analytics-summary-label">Orders</span>
                    <span className="analytics-summary-value">
                        {numberFormatter.format(analytics?.currentPeriod.orderCount ?? 0)}
                    </span>
                    <ChangeIndicator percent={analytics?.orderCountChangePercent ?? null} />
                </button>
            </div>

            <div className="analytics-chart-area" style={{ opacity: isFetching && !isLoading ? 0.6 : 1 }}>
                {isWaitingForCustomRange ? (
                    <p className="business-dashboard-table-message">Choose both dates to see the custom range.</p>
                ) : isLoading ? (
                    <div className="business-dashboard-table-loading">
                        <Spinner size={28} />
                    </div>
                ) : isError ? (
                    <p className="business-dashboard-table-message business-dashboard-table-message--error">
                        Failed to load analytics. Please try again.
                    </p>
                ) : !hasPointsInRange ? (
                    <p className="business-dashboard-table-message">No orders in the selected period.</p>
                ) : (
                    <AnalyticsChart points={analytics!.points} metric={metric} granularity={analytics!.granularity} />
                )}
            </div>
        </section>
    );
};

export default OrdersAnalyticsSection;
