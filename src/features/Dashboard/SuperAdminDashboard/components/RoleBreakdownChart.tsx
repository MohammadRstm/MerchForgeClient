import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#ff9b00", "#3b82f6", "#10b981", "#a855f7", "#ef4444"];

type RoleBreakdownChartProps = {
    title: string;
    data: { role: string; count: number }[];
};

const RoleBreakdownChart = ({ title, data }: RoleBreakdownChartProps) => {
    const hasData = data.some((entry) => entry.count > 0);

    return (
        <div className="dashboard-chart-card">
            <h3 className="dashboard-chart-title">{title}</h3>

            {hasData ? (
                <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="count"
                            nameKey="role"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                        >
                            {data.map((entry, index) => (
                                <Cell key={entry.role} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <p className="dashboard-chart-empty">No data yet.</p>
            )}
        </div>
    );
};

export default RoleBreakdownChart;
