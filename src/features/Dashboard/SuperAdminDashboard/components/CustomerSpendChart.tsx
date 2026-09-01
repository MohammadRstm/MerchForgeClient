import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { CHART_COLORS } from "../../BusinessOwnerDashboard/utils/chartMetrics";
import { formatCurrency } from "../utils/formatCurrency";
import type { CustomerSpendPoint } from "../types";

type CustomerSpendChartProps = {
    points?: CustomerSpendPoint[];
    isLoading: boolean;
    isError: boolean;
};

const BAR_COLORS = [CHART_COLORS.revenue, CHART_COLORS.secondary, CHART_COLORS.tertiary];

/** One bar series per currency the customer has actually spent in - almost always just one. */
const CustomerSpendChart = ({ points, isLoading, isError }: CustomerSpendChartProps) => {
    const currencies = Array.from(new Set((points ?? []).map((p) => p.currency)));

    const periods = Array.from(new Set((points ?? []).map((p) => p.period))).sort();
    const pivoted = periods.map((period) => {
        const row: Record<string, string | number> = { period };
        for (const currency of currencies) {
            row[currency] = points?.find((p) => p.period === period && p.currency === currency)?.total ?? 0;
        }
        return row;
    });

    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Customer Spending</h3>
            </div>

            {isLoading ? (
                <div className="dashboard-table-loading">
                    <Spinner size={24} />
                </div>
            ) : isError ? (
                <p className="dashboard-table-message dashboard-table-message--error">
                    Unable to load spending history.
                </p>
            ) : pivoted.length === 0 ? (
                <p className="dashboard-table-message">No recorded spending yet.</p>
            ) : (
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={pivoted} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="#eef0f2" />
                        <XAxis
                            dataKey="period"
                            tickFormatter={(value: string) => new Date(`${value}-01`).toLocaleDateString(undefined, { month: "short", year: "2-digit" })}
                            axisLine={false}
                            tickLine={false}
                            fontSize={12}
                            stroke="#9a9a9a"
                        />
                        <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#9a9a9a" width={40} allowDecimals={false} />
                        <Tooltip
                            formatter={(value, name) => [formatCurrency(Number(value), String(name)), String(name)]}
                            labelFormatter={(value) => new Date(`${value}-01`).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
                        />
                        {currencies.map((currency, index) => (
                            <Bar
                                key={currency}
                                dataKey={currency}
                                name={currency}
                                fill={BAR_COLORS[index % BAR_COLORS.length]}
                                radius={[4, 4, 0, 0]}
                                isAnimationActive
                                animationDuration={500}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            )}
        </section>
    );
};

export default CustomerSpendChart;
