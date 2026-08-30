import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import AnalyticsChart from "./AnalyticsChart";
import { revenueMetric, orderCountMetric } from "../utils/chartMetrics";
import type { OrderAnalytics } from "../types";

const REVENUE_METRIC = revenueMetric();
const ORDERS_METRIC = orderCountMetric("Orders", "#3b82f6");
const TOOLTIP_METRICS = [REVENUE_METRIC, ORDERS_METRIC];

type RevenueOverviewChartProps = {
    analytics?: OrderAnalytics;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    isWaitingForCustomRange: boolean;
    metric: "revenue" | "orders";
    onChangeMetric: (metric: "revenue" | "orders") => void;
};

/** The page's visual centerpiece — reuses the exact AnalyticsChart/AnalyticsTooltip infrastructure Orders/Products already use, driven by the page-level range selector rather than its own. */
const RevenueOverviewChart = ({
    analytics,
    isLoading,
    isFetching,
    isError,
    isWaitingForCustomRange,
    metric,
    onChangeMetric,
}: RevenueOverviewChartProps) => {
    const hasPointsInRange = (analytics?.points.length ?? 0) > 0 && analytics!.currentPeriod.orderCount > 0;
    const activeMetric = metric === "revenue" ? REVENUE_METRIC : ORDERS_METRIC;

    return (
        <section className="business-dashboard-table-card analytics-section overview-revenue-chart">
            <div className="analytics-header">
                <h3>Revenue Overview</h3>

                <div className="analytics-range-selector">
                    <button
                        type="button"
                        className={`analytics-range-btn${metric === "revenue" ? " analytics-range-btn--active" : ""}`}
                        onClick={() => onChangeMetric("revenue")}
                    >
                        Revenue
                    </button>
                    <button
                        type="button"
                        className={`analytics-range-btn${metric === "orders" ? " analytics-range-btn--active" : ""}`}
                        onClick={() => onChangeMetric("orders")}
                    >
                        Orders
                    </button>
                </div>
            </div>

            <div className="analytics-chart-area overview-revenue-chart__area" style={{ opacity: isFetching && !isLoading ? 0.6 : 1 }}>
                {isWaitingForCustomRange ? (
                    <p className="business-dashboard-table-message">Choose both dates to see the custom range.</p>
                ) : isLoading ? (
                    <div className="business-dashboard-table-loading">
                        <Spinner size={28} />
                    </div>
                ) : isError ? (
                    <p className="business-dashboard-table-message business-dashboard-table-message--error">
                        Unable to load revenue analytics.
                    </p>
                ) : !hasPointsInRange ? (
                    <p className="business-dashboard-table-message">
                        Not enough sales data yet
                        <br />
                        <span className="business-dashboard-form-hint">
                            Once customers start placing orders, your revenue trend will appear here.
                        </span>
                    </p>
                ) : (
                    <AnalyticsChart
                        points={analytics!.points}
                        activeMetric={activeMetric}
                        tooltipMetrics={TOOLTIP_METRICS}
                        granularity={analytics!.granularity}
                        height={320}
                    />
                )}
            </div>
        </section>
    );
};

export default RevenueOverviewChart;
