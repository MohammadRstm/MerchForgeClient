import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { CHART_COLORS } from "../../BusinessOwnerDashboard/utils/chartMetrics";
import type { DomainTemplateSummary } from "../types";

type TemplateDomainSummaryProps = {
    data?: DomainTemplateSummary[];
    isLoading: boolean;
    isError: boolean;
};

const BAR_COLORS = [CHART_COLORS.secondary, CHART_COLORS.revenue, CHART_COLORS.tertiary, "#12875a", "#d92d20", "#6b7280"];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: DomainTemplateSummary }[] }) => {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const entry = payload[0].payload;

    return (
        <div className="analytics-tooltip">
            <p className="analytics-tooltip-heading">{entry.domainName}</p>
            <div className="analytics-tooltip-row">
                <span>{entry.templateCount} template{entry.templateCount === 1 ? "" : "s"}</span>
            </div>
            <div className="analytics-tooltip-row">
                <span>{entry.businessCount} business{entry.businessCount === 1 ? "" : "es"}</span>
            </div>
        </div>
    );
};

/** How MerchForge's configured domains relate to the template catalogue - how many templates each has, and how many businesses in total are on them. */
const TemplateDomainSummary = ({ data, isLoading, isError }: TemplateDomainSummaryProps) => {
    const sorted = [...(data ?? [])].sort((a, b) => b.templateCount - a.templateCount);
    const height = Math.max(140, sorted.length * 48);

    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Templates by Domain</h3>
            </div>

            {isLoading ? (
                <div className="dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="dashboard-table-message dashboard-table-message--error">
                    Unable to load domain distribution.
                </p>
            ) : sorted.length === 0 ? (
                <p className="dashboard-table-message">No storefront templates have been created yet.</p>
            ) : (
                <ResponsiveContainer width="100%" height={height}>
                    <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
                        <XAxis type="number" hide allowDecimals={false} />
                        <YAxis
                            type="category"
                            dataKey="domainName"
                            axisLine={false}
                            tickLine={false}
                            fontSize={13}
                            width={90}
                            stroke="#9a9a9a"
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                        <Bar
                            dataKey="templateCount"
                            radius={[0, 6, 6, 0]}
                            isAnimationActive
                            animationDuration={500}
                            animationEasing="ease-out"
                            barSize={22}
                        >
                            {sorted.map((entry, index) => (
                                <Cell key={entry.businessDomainId} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </section>
    );
};

export default TemplateDomainSummary;
