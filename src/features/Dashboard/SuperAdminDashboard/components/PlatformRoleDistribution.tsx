import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { CHART_COLORS, numberFormatter } from "../../BusinessOwnerDashboard/utils/chartMetrics";
import type { KeyCount, SystemRoleFilter } from "../types";

type PlatformRoleDistributionProps = {
    data?: KeyCount[];
    isLoading: boolean;
    isError: boolean;
    onSelectRole: (role: SystemRoleFilter) => void;
};

const BAR_COLORS = [CHART_COLORS.secondary, CHART_COLORS.revenue, CHART_COLORS.tertiary];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: KeyCount }[] }) => {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const entry = payload[0].payload;

    return (
        <div className="analytics-tooltip">
            <p className="analytics-tooltip-heading">{entry.key}</p>
            <div className="analytics-tooltip-row">
                <span>{numberFormatter.format(entry.count)} user{entry.count === 1 ? "" : "s"}</span>
            </div>
        </div>
    );
};

/** System-role counts, reused from the platform stats endpoint. Clicking a bar filters the Users table to that role. */
const PlatformRoleDistribution = ({ data, isLoading, isError, onSelectRole }: PlatformRoleDistributionProps) => {
    const sorted = [...(data ?? [])].sort((a, b) => b.count - a.count);
    const height = Math.max(140, sorted.length * 52);

    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Platform Role Distribution</h3>
            </div>

            {isLoading ? (
                <div className="dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="dashboard-table-message dashboard-table-message--error">
                    Unable to load role distribution.
                </p>
            ) : sorted.length === 0 ? (
                <p className="dashboard-table-message">No platform users yet.</p>
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
                                width={90}
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
                                    onSelectRole(point.key as SystemRoleFilter);
                                }}
                                style={{ cursor: "pointer" }}
                                barSize={26}
                            >
                                {sorted.map((entry, index) => (
                                    <Cell key={entry.key} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <p className="dashboard-chart-disclaimer">Click a role to filter the table below.</p>
                </>
            )}
        </section>
    );
};

export default PlatformRoleDistribution;
