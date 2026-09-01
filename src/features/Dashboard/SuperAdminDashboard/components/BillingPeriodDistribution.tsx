import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { CHART_COLORS } from "../../BusinessOwnerDashboard/utils/chartMetrics";
import type { PlanSubscriptionStats } from "../types";

type BillingPeriodDistributionProps = {
    stats?: PlanSubscriptionStats;
    isLoading: boolean;
    isError: boolean;
};

const BillingPeriodDistribution = ({ stats, isLoading, isError }: BillingPeriodDistributionProps) => {
    const total = stats ? stats.monthlySubscriptions + stats.yearlySubscriptions : 0;
    const monthlyPercent = total > 0 ? Math.round((stats!.monthlySubscriptions / total) * 100) : 0;
    const yearlyPercent = total > 0 ? 100 - monthlyPercent : 0;

    const segments = stats
        ? [
              { name: "Monthly", value: stats.monthlySubscriptions, color: CHART_COLORS.secondary },
              { name: "Yearly", value: stats.yearlySubscriptions, color: CHART_COLORS.revenue },
          ].filter((s) => s.value > 0)
        : [];

    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Billing Period Distribution</h3>
            </div>

            {isLoading ? (
                <div className="dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="dashboard-table-message dashboard-table-message--error">
                    Unable to load billing period distribution.
                </p>
            ) : total === 0 ? (
                <p className="dashboard-table-message">No active subscriptions yet.</p>
            ) : (
                <div className="overview-inventory-snapshot__body">
                    <div className="overview-inventory-snapshot__chart">
                        <ResponsiveContainer width="100%" height={140}>
                            <PieChart>
                                <Pie
                                    data={segments}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={44}
                                    outerRadius={64}
                                    paddingAngle={segments.length > 1 ? 3 : 0}
                                    startAngle={90}
                                    endAngle={-270}
                                    isAnimationActive
                                    animationDuration={500}
                                >
                                    {segments.map((s) => (
                                        <Cell key={s.name} fill={s.color} stroke="none" />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="overview-inventory-snapshot__chart-center">
                            <span>{yearlyPercent}%</span>
                            <span className="dashboard-table-muted" style={{ fontSize: 11 }}>
                                Yearly
                            </span>
                        </div>
                    </div>

                    <ul className="overview-inventory-snapshot__legend">
                        <li>
                            <span className="inventory-health-legend-dot" style={{ background: CHART_COLORS.secondary }} />
                            Monthly — {stats!.monthlySubscriptions} ({monthlyPercent}%)
                        </li>
                        <li>
                            <span className="inventory-health-legend-dot" style={{ background: CHART_COLORS.revenue }} />
                            Yearly — {stats!.yearlySubscriptions} ({yearlyPercent}%)
                        </li>
                    </ul>
                </div>
            )}
        </section>
    );
};

export default BillingPeriodDistribution;
