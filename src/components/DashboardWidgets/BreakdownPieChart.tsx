import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import "./DashboardWidgets.css";

const COLORS = ["#ff9b00", "#3b82f6", "#10b981", "#a855f7", "#ef4444"];

type BreakdownPieChartProps = {
    title: string;
    data: { label: string; count: number }[];
};

const BreakdownPieChart = ({ title, data }: BreakdownPieChartProps) => {
    const hasData = data.some((entry) => entry.count > 0);

    return (
        <div className="widget-chart-card">
            <h3 className="widget-chart-title">{title}</h3>

            {hasData ? (
                <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="count"
                            nameKey="label"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                        >
                            {data.map((entry, index) => (
                                <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <p className="widget-chart-empty">No data yet.</p>
            )}
        </div>
    );
};

export default BreakdownPieChart;
