import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DotProps } from "recharts";
import AnalyticsTooltip from "./AnalyticsTooltip";
import type { ChartMetricConfig, ChartPoint } from "../utils/chartMetrics";
import type { OrderAnalyticsGranularity } from "../types";

const formatXAxisTick = (period: string, granularity: OrderAnalyticsGranularity) => {
    const date = new Date(period);
    return granularity === "Daily"
        ? date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
        : date.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
};

/** A glowing ring around the hovered point — the one deliberate "depth" touch, not a decoration sprayed everywhere. */
const ActiveDot = (props: DotProps & { fill?: string }) => {
    const { cx, cy, fill } = props;
    if (cx == null || cy == null) return null;

    return (
        <g>
            <circle cx={cx} cy={cy} r={9} fill={fill} fillOpacity={0.18} />
            <circle cx={cx} cy={cy} r={4.5} fill="#fff" stroke={fill} strokeWidth={2.5} />
        </g>
    );
};

type AnalyticsChartProps = {
    points: ChartPoint[];
    /** The metric actually plotted as the area/line. */
    activeMetric: ChartMetricConfig;
    /** Every metric shown in the hover tooltip — usually includes activeMetric plus its siblings. */
    tooltipMetrics: ChartMetricConfig[];
    granularity: OrderAnalyticsGranularity;
    height?: number;
};

/**
 * One chart implementation shared by the Orders analytics section, the Products
 * analytics section, and a single product's trend chart — which metric it plots and
 * what the tooltip shows are the only things that differ between those three uses.
 */
const AnalyticsChart = ({ points, activeMetric, tooltipMetrics, granularity, height = 260 }: AnalyticsChartProps) => {
    const gradientId = `analytics-gradient-${activeMetric.key}`;

    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={points} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={activeMetric.color} stopOpacity={0.32} />
                        <stop offset="100%" stopColor={activeMetric.color} stopOpacity={0} />
                    </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="#eef0f2" />

                <XAxis
                    dataKey="period"
                    tickFormatter={(value: string) => formatXAxisTick(value, granularity)}
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    stroke="#9a9a9a"
                    minTickGap={24}
                    dy={8}
                />

                <YAxis
                    tickFormatter={(value: number) => activeMetric.formatValueCompact(value)}
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    stroke="#9a9a9a"
                    width={56}
                    allowDecimals={false}
                />

                <Tooltip
                    content={(props) => (
                        <AnalyticsTooltip {...props} activeKey={activeMetric.key} metrics={tooltipMetrics} granularity={granularity} />
                    )}
                    cursor={{ stroke: activeMetric.color, strokeWidth: 1, strokeDasharray: "4 4" }}
                />

                <Area
                    type="monotone"
                    dataKey={activeMetric.key}
                    stroke={activeMetric.color}
                    strokeWidth={2.5}
                    fill={`url(#${gradientId})`}
                    dot={false}
                    activeDot={<ActiveDot fill={activeMetric.color} />}
                    isAnimationActive
                    animationDuration={500}
                    animationEasing="ease-out"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default AnalyticsChart;
