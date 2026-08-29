import type { TooltipContentProps } from "recharts";
import type { ChartMetricConfig, ChartPoint } from "../utils/chartMetrics";
import type { OrderAnalyticsGranularity } from "../types";

type AnalyticsTooltipProps = TooltipContentProps & {
    activeKey: string;
    metrics: ChartMetricConfig[];
    granularity: OrderAnalyticsGranularity;
};

const formatPeriodHeading = (period: string, granularity: OrderAnalyticsGranularity) => {
    const date = new Date(period);
    return granularity === "Daily"
        ? date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })
        : date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
};

/**
 * Fully custom — not Recharts' default tooltip — so it reads as a MerchForge UI
 * element rather than a library widget. Renders one row per configured metric (only
 * metrics the caller actually has data for), with whichever one is currently charted
 * emphasized, per the "adapt accordingly when the metric switches" requirement.
 */
const AnalyticsTooltip = ({ active, payload, activeKey, metrics, granularity }: AnalyticsTooltipProps) => {
    if (!active || !payload || payload.length === 0) return null;

    const point = payload[0].payload as ChartPoint;

    return (
        <div className="analytics-tooltip">
            <div className="analytics-tooltip-heading">{formatPeriodHeading(point.period, granularity)}</div>

            {metrics.map((metric) => (
                <div
                    key={metric.key}
                    className={`analytics-tooltip-row${metric.key === activeKey ? " analytics-tooltip-row--active" : ""}`}
                >
                    <span className="analytics-tooltip-dot" style={{ background: metric.color }} />
                    <span className="analytics-tooltip-label">{metric.label}</span>
                    <span className="analytics-tooltip-value">{metric.formatValue(Number(point[metric.key] ?? 0))}</span>
                </div>
            ))}
        </div>
    );
};

export default AnalyticsTooltip;
