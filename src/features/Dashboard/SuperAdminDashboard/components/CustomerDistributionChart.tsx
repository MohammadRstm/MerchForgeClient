import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { CHART_COLORS, numberFormatter } from "../../BusinessOwnerDashboard/utils/chartMetrics";
import type { KeyCount } from "../types";

type CustomerDistributionChartProps = {
    data?: KeyCount[];
    isLoading: boolean;
    isError: boolean;
    onSelectBusiness: (businessName: string) => void;
};

const BAR_COLORS = [CHART_COLORS.secondary, CHART_COLORS.revenue, CHART_COLORS.tertiary, "#12875a", "#d92d20", "#6b7280"];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: KeyCount }[] }) => {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const entry = payload[0].payload;

    return (
        <div className="analytics-tooltip">
            <p className="analytics-tooltip-heading">{entry.key}</p>
            <div className="analytics-tooltip-row">
                <span>{numberFormatter.format(entry.count)} customer{entry.count === 1 ? "" : "s"}</span>
            </div>
        </div>
    );
};

/**
 * Customers *associated with* each business, not a share of unique platform
 * customers - a global customer who ordered from two businesses is counted
 * once in each bar, so the bars can sum to more than the total customer
 * count. The disclaimer below says this explicitly rather than implying a
 * percentage-of-unique-customers breakdown.
 */
const CustomerDistributionChart = ({ data, isLoading, isError, onSelectBusiness }: CustomerDistributionChartProps) => {
    const sorted = [...(data ?? [])].sort((a, b) => b.count - a.count);
    const height = Math.max(160, sorted.length * 44);

    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Customer Distribution by Business</h3>
            </div>

            {isLoading ? (
                <div className="dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="dashboard-table-message dashboard-table-message--error">
                    Unable to load customer distribution.
                </p>
            ) : sorted.length === 0 ? (
                <p className="dashboard-table-message">No customer orders recorded yet.</p>
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
                                width={130}
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
                                    onSelectBusiness(point.key);
                                }}
                                style={{ cursor: "pointer" }}
                                barSize={20}
                            >
                                {sorted.map((entry, index) => (
                                    <Cell key={entry.key} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <p className="dashboard-chart-disclaimer">
                        Customers associated with each business - a customer ordering from more than one business is
                        counted in each, so bars can add up to more than your total unique customer count. Click a bar
                        to filter the table below.
                    </p>
                </>
            )}
        </section>
    );
};

export default CustomerDistributionChart;
