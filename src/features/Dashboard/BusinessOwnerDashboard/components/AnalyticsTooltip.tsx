import type { TooltipContentProps } from "recharts";
import type { AnalyticsMetric, OrderAnalyticsGranularity } from "../types";

const currencyFormatter = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });

type TooltipPayloadPoint = {
    period: string;
    revenue: number;
    orderCount: number;
};

type AnalyticsTooltipProps = TooltipContentProps & {
    metric: AnalyticsMetric;
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
 * element rather than a library widget. Always shows both metrics (the underlying
 * point already carries both), with whichever one is currently charted emphasized,
 * per the "adapt accordingly when the metric switches" requirement.
 */
const AnalyticsTooltip = ({ active, payload, metric, granularity }: AnalyticsTooltipProps) => {
    if (!active || !payload || payload.length === 0) return null;

    const point = payload[0].payload as TooltipPayloadPoint;

    return (
        <div className="analytics-tooltip">
            <div className="analytics-tooltip-heading">{formatPeriodHeading(point.period, granularity)}</div>

            <div className={`analytics-tooltip-row${metric === "revenue" ? " analytics-tooltip-row--active" : ""}`}>
                <span className="analytics-tooltip-dot analytics-tooltip-dot--revenue" />
                <span className="analytics-tooltip-label">Revenue</span>
                <span className="analytics-tooltip-value">{currencyFormatter.format(point.revenue)}</span>
            </div>

            <div className={`analytics-tooltip-row${metric === "orders" ? " analytics-tooltip-row--active" : ""}`}>
                <span className="analytics-tooltip-dot analytics-tooltip-dot--orders" />
                <span className="analytics-tooltip-label">Orders</span>
                <span className="analytics-tooltip-value">{point.orderCount}</span>
            </div>
        </div>
    );
};

export default AnalyticsTooltip;
