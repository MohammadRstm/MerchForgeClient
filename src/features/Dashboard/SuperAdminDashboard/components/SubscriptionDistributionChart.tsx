import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { CHART_COLORS, numberFormatter } from "../../BusinessOwnerDashboard/utils/chartMetrics";
import type { KeyCount } from "../types";

type SubscriptionDistributionChartProps = {
    data?: KeyCount[];
    isLoading: boolean;
    isError: boolean;
    onSelectPlan: (planName: string) => void;
};

const BAR_COLORS = [CHART_COLORS.revenue, CHART_COLORS.secondary, CHART_COLORS.tertiary, "#12875a", "#d92d20", "#6b7280"];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: KeyCount }[] }) => {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const entry = payload[0].payload;

    return (
        <div className="analytics-tooltip">
            <p className="analytics-tooltip-heading">{entry.key}</p>
            <div className="analytics-tooltip-row">
                <span>{numberFormatter.format(entry.count)} business{entry.count === 1 ? "" : "es"}</span>
            </div>
        </div>
    );
};

const SubscriptionDistributionChart = ({ data, isLoading, isError, onSelectPlan }: SubscriptionDistributionChartProps) => {
    const sorted = [...(data ?? [])].sort((a, b) => b.count - a.count);
    const height = Math.max(160, sorted.length * 48);

    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Subscription Distribution</h3>
            </div>

            {isLoading ? (
                <div className="dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="dashboard-table-message dashboard-table-message--error">
                    Unable to load subscription distribution.
                </p>
            ) : sorted.length === 0 ? (
                <p className="dashboard-table-message">No active subscriptions yet.</p>
            ) : (
                <>
                    <ResponsiveContainer width="100%" height={height}>
                        <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
                            <XAxis type="number" hide allowDecimals={false} />
                            <YAxis
                                type="category"
                                dataKey="key"
                                axisLine={false}
                                tickLine={false}
                                fontSize={13}
                                width={110}
                                stroke="#9a9a9a"
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                            <Bar
                                dataKey="count"
                                radius={[0, 6, 6, 0]}
                                isAnimationActive
                                animationDuration={500}
                                animationEasing="ease-out"
                                onClick={(entry: unknown) => {
                                    const point = entry as KeyCount;
                                    onSelectPlan(point.key);
                                }}
                                style={{ cursor: "pointer" }}
                                barSize={22}
                            >
                                {sorted.map((entry, index) => (
                                    <Cell key={entry.key} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <p className="dashboard-chart-disclaimer">Click a plan to see its subscribers.</p>
                </>
            )}
        </section>
    );
};

export default SubscriptionDistributionChart;
