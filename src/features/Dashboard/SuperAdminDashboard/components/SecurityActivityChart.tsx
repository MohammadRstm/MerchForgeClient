import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { CHART_COLORS } from "../../BusinessOwnerDashboard/utils/chartMetrics";
import type { AuthActivityPoint } from "../types";

type SecurityActivityChartProps = {
    points?: AuthActivityPoint[];
    isLoading: boolean;
    isError: boolean;
};

const formatTick = (value: string) => new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) => {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    return (
        <div className="analytics-tooltip">
            <p className="analytics-tooltip-heading">{label ? new Date(label).toLocaleDateString() : ""}</p>
            {payload.map((entry) => (
                <div className="analytics-tooltip-row" key={entry.name}>
                    <span style={{ color: entry.color }}>{entry.name}</span>
                    <span>{entry.value}</span>
                </div>
            ))}
        </div>
    );
};

/** Successful vs failed authentication attempts over the last 30 days - the only series that has real, persisted data behind it today. */
const SecurityActivityChart = ({ points, isLoading, isError }: SecurityActivityChartProps) => {
    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Security Activity</h3>
            </div>

            {isLoading ? (
                <div className="dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="dashboard-table-message dashboard-table-message--error">
                    Unable to load security activity.
                </p>
            ) : !points || points.length === 0 ? (
                <p className="dashboard-table-message">No security activity recorded yet.</p>
            ) : (
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={points} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="#eef0f2" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={formatTick}
                            axisLine={false}
                            tickLine={false}
                            fontSize={12}
                            stroke="#9a9a9a"
                            minTickGap={24}
                            dy={8}
                        />
                        <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#9a9a9a" width={40} allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            iconType="circle"
                            iconSize={8}
                            formatter={(value) => <span style={{ fontSize: 12, color: "var(--dash-text-secondary, #444)" }}>{value}</span>}
                        />
                        <Line
                            type="monotone"
                            dataKey="successfulLogins"
                            name="Successful"
                            stroke={CHART_COLORS.revenue}
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 5 }}
                            isAnimationActive
                            animationDuration={500}
                            animationEasing="ease-out"
                        />
                        <Line
                            type="monotone"
                            dataKey="failedLogins"
                            name="Failed"
                            stroke={CHART_COLORS.secondary}
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{ r: 5 }}
                            isAnimationActive
                            animationDuration={500}
                            animationEasing="ease-out"
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </section>
    );
};

export default SecurityActivityChart;
