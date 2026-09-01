import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import AnalyticsChart from "../../BusinessOwnerDashboard/components/AnalyticsChart";
import { revenueMetric, orderCountMetric } from "../../BusinessOwnerDashboard/utils/chartMetrics";
import type { OrderAnalytics, AnalyticsRangePreset } from "../../BusinessOwnerDashboard/types";

const REVENUE_METRIC = revenueMetric();
const ORDERS_METRIC = orderCountMetric();
const TOOLTIP_METRICS = [REVENUE_METRIC, ORDERS_METRIC];

type BusinessSalesPerformanceProps = {
    analytics?: OrderAnalytics;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    preset: AnalyticsRangePreset;
    presets: { value: AnalyticsRangePreset; label: string }[];
    onChangePreset: (preset: AnalyticsRangePreset) => void;
    metric: "revenue" | "orders";
    onChangeMetric: (metric: "revenue" | "orders") => void;
};

const BusinessSalesPerformance = ({
    analytics,
    isLoading,
    isFetching,
    isError,
    preset,
    presets,
    onChangePreset,
    metric,
    onChangeMetric,
}: BusinessSalesPerformanceProps) => {
    const hasPointsInRange = (analytics?.points.length ?? 0) > 0 && analytics!.currentPeriod.orderCount > 0;
    const activeMetric = metric === "revenue" ? REVENUE_METRIC : ORDERS_METRIC;

    return (
        <section className="business-dashboard-table-card analytics-section">
            <div className="analytics-header">
                <h3>Sales Performance</h3>

                <div className="analytics-header-controls">
                    <div className="analytics-range-selector" role="group" aria-label="Time range">
                        {presets.map((p) => (
                            <button
                                key={p.value}
                                type="button"
                                className={`analytics-range-btn${preset === p.value ? " analytics-range-btn--active" : ""}`}
                                onClick={() => onChangePreset(p.value)}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

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
            </div>

            <div className="analytics-chart-area" style={{ opacity: isFetching && !isLoading ? 0.6 : 1 }}>
                {isLoading ? (
                    <div className="business-dashboard-table-loading">
                        <Spinner size={28} />
                    </div>
                ) : isError ? (
                    <p className="business-dashboard-table-message business-dashboard-table-message--error">
                        Unable to load sales analytics.
                    </p>
                ) : !hasPointsInRange ? (
                    <p className="business-dashboard-table-message">No orders yet in this range.</p>
                ) : (
                    <AnalyticsChart
                        points={analytics!.points}
                        activeMetric={activeMetric}
                        tooltipMetrics={TOOLTIP_METRICS}
                        granularity={analytics!.granularity}
                        height={300}
                    />
                )}
            </div>

            <p className="dashboard-chart-disclaimer">
                Recorded order totals — MerchForge doesn't process real payments yet, so this isn't money collected.
            </p>
        </section>
    );
};

export default BusinessSalesPerformance;
