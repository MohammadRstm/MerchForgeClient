import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { CHART_COLORS, numberFormatter } from "../../BusinessOwnerDashboard/utils/chartMetrics";
import type { WebsiteTemplateResponse } from "../types";

type TemplateUsageChartProps = {
    templates: WebsiteTemplateResponse[];
    isLoading: boolean;
    isError: boolean;
    onSelectTemplate: (templateId: string) => void;
};

const BAR_COLORS = [CHART_COLORS.revenue, CHART_COLORS.secondary, CHART_COLORS.tertiary, "#12875a", "#d92d20", "#6b7280"];

type ChartPoint = { id: string; label: string; domainName: string; businesses: number };

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: ChartPoint }[] }) => {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const entry = payload[0].payload;

    return (
        <div className="analytics-tooltip">
            <p className="analytics-tooltip-heading">{entry.label}</p>
            <div className="analytics-tooltip-row">
                <span>{entry.domainName}</span>
            </div>
            <div className="analytics-tooltip-row">
                <span>{numberFormatter.format(entry.businesses)} business{entry.businesses === 1 ? "" : "es"}</span>
            </div>
        </div>
    );
};

/** Reuses the already-loaded template page data - no separate endpoint needed for this chart. */
const TemplateUsageChart = ({ templates, isLoading, isError, onSelectTemplate }: TemplateUsageChartProps) => {
    const sorted = [...templates]
        .sort((a, b) => b.businessesUsingIt - a.businessesUsingIt)
        .map((t): ChartPoint => ({ id: t.id, label: t.label, domainName: t.domainName, businesses: t.businessesUsingIt }));

    const height = Math.max(160, sorted.length * 44);

    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Template Usage</h3>
            </div>

            {isLoading ? (
                <div className="dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="dashboard-table-message dashboard-table-message--error">
                    Unable to load template usage.
                </p>
            ) : sorted.length === 0 ? (
                <p className="dashboard-table-message">No storefront templates have been created yet.</p>
            ) : (
                <>
                    <ResponsiveContainer width="100%" height={height}>
                        <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
                            <XAxis type="number" hide allowDecimals={false} />
                            <YAxis
                                type="category"
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                fontSize={13}
                                width={140}
                                stroke="#9a9a9a"
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                            <Bar
                                dataKey="businesses"
                                radius={[0, 6, 6, 0]}
                                isAnimationActive
                                animationDuration={500}
                                animationEasing="ease-out"
                                onClick={(entry: unknown) => {
                                    const point = entry as ChartPoint;
                                    onSelectTemplate(point.id);
                                }}
                                style={{ cursor: "pointer" }}
                                barSize={20}
                            >
                                {sorted.map((entry, index) => (
                                    <Cell key={entry.id} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <p className="dashboard-chart-disclaimer">Click a template to open its details.</p>
                </>
            )}
        </section>
    );
};

export default TemplateUsageChart;
