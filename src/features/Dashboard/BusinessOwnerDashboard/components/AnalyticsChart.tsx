import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DotProps } from "recharts";
import AnalyticsTooltip from "./AnalyticsTooltip";
import type { AnalyticsMetric, OrderAnalyticsGranularity, OrderAnalyticsPoint } from "../types";

const METRIC_COLOR: Record<AnalyticsMetric, string> = {
    revenue: "#ff9b00",
    orders: "#3b82f6",
};

const compactCurrencyFormatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
});

const compactNumberFormatter = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 });

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
    points: OrderAnalyticsPoint[];
    metric: AnalyticsMetric;
    granularity: OrderAnalyticsGranularity;
};

const AnalyticsChart = ({ points, metric, granularity }: AnalyticsChartProps) => {
    const color = METRIC_COLOR[metric];
    const dataKey: keyof OrderAnalyticsPoint = metric === "revenue" ? "revenue" : "orderCount";
    const gradientId = `analytics-gradient-${metric}`;

    return (
        <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={points} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.32} />
                        <stop offset="100%" stopColor={color} stopOpacity={0} />
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
                    tickFormatter={(value: number) =>
                        metric === "revenue" ? compactCurrencyFormatter.format(value) : compactNumberFormatter.format(value)
                    }
                    axisLine={false}
                    tickLine={false}
                    fontSize={12}
                    stroke="#9a9a9a"
                    width={56}
                    allowDecimals={false}
                />

                <Tooltip
                    content={(props) => <AnalyticsTooltip {...props} metric={metric} granularity={granularity} />}
                    cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "4 4" }}
                />

                <Area
                    type="monotone"
                    dataKey={dataKey}
                    stroke={color}
                    strokeWidth={2.5}
                    fill={`url(#${gradientId})`}
                    dot={false}
                    activeDot={<ActiveDot fill={color} />}
                    isAnimationActive
                    animationDuration={500}
                    animationEasing="ease-out"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default AnalyticsChart;
