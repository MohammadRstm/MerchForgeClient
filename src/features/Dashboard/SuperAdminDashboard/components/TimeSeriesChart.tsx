import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type TimeSeriesChartProps = {
    title: string;
    data: { period: string; count: number }[];
    color?: string;
};

const TimeSeriesChart = ({ title, data, color = "#ff9b00" }: TimeSeriesChartProps) => {
    return (
        <div className="dashboard-chart-card">
            <h3 className="dashboard-chart-title">{title}</h3>

            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="period" fontSize={12} />
                    <YAxis allowDecimals={false} fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" fill={color} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TimeSeriesChart;
