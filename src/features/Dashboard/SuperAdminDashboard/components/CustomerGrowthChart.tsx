import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { CHART_COLORS } from "../../BusinessOwnerDashboard/utils/chartMetrics";
import { GROWTH_PERIOD_OPTIONS } from "../hooks/ui/useCustomerGrowthPeriod";
import type { TimeSeriesPoint } from "../types";

type CustomerGrowthChartProps = {
    points?: TimeSeriesPoint[];
    isLoading: boolean;
    isError: boolean;
    days: number;
    onDaysChange: (days: number) => void;
};

const formatTick = (period: string, isDaily: boolean) => {
    const date = new Date(period.length > 7 ? period : `${period}-01`);
    return isDaily
        ? date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
        : date.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
};

const CustomTooltip = ({
    active,
    payload,
    label,
    isDaily,
}: {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
    isDaily: boolean;
}) => {
    if (!active || !payload || payload.length === 0 || !label) {
        return null;
    }

    return (
        <div className="analytics-tooltip">
            <p className="analytics-tooltip-heading">{formatTick(label, isDaily)}</p>
            <div className="analytics-tooltip-row">
                <span>{payload[0].value} new customer{payload[0].value === 1 ? "" : "s"}</span>
            </div>
        </div>
    );
};

/** New-customer registrations over time - a gradient area, matching the Owner dashboard's own chart language. */
const CustomerGrowthChart = ({ points, isLoading, isError, days, onDaysChange }: CustomerGrowthChartProps) => {
    const isDaily = days <= 90;

    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Customer Growth</h3>
                <div className="order-status-tabs" role="tablist" aria-label="Growth chart period">
                    {GROWTH_PERIOD_OPTIONS.map((option) => (
                        <button
                            key={option.days}
                            type="button"
                            role="tab"
                            aria-selected={days === option.days}
                            className={`order-status-tab${days === option.days ? " order-status-tab--active" : ""}`}
                            onClick={() => onDaysChange(option.days)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="dashboard-table-message dashboard-table-message--error">
                    Unable to load customer growth.
                </p>
            ) : !points || points.every((p) => p.count === 0) ? (
                <p className="dashboard-table-message">No new customers in this period.</p>
            ) : (
                <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={points} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="customer-growth-gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLORS.revenue} stopOpacity={0.32} />
                                <stop offset="100%" stopColor={CHART_COLORS.revenue} stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="#eef0f2" />

                        <XAxis
                            dataKey="period"
                            tickFormatter={(value: string) => formatTick(value, isDaily)}
                            axisLine={false}
                            tickLine={false}
                            fontSize={12}
                            stroke="#9a9a9a"
                            minTickGap={24}
                            dy={8}
                        />

                        <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#9a9a9a" width={32} allowDecimals={false} />

                        <Tooltip content={<CustomTooltip isDaily={isDaily} />} cursor={{ stroke: CHART_COLORS.revenue, strokeWidth: 1, strokeDasharray: "4 4" }} />

                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke={CHART_COLORS.revenue}
                            strokeWidth={2.5}
                            fill="url(#customer-growth-gradient)"
                            dot={false}
                            activeDot={{ r: 5 }}
                            isAnimationActive
                            animationDuration={500}
                            animationEasing="ease-out"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </section>
    );
};

export default CustomerGrowthChart;
