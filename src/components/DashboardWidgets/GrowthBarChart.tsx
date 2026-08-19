import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import "./DashboardWidgets.css";

type GrowthBarChartProps = {
    title: string;
    data: { period: string; count: number }[];
    color?: string;
};

const GrowthBarChart = ({ title, data, color = "#ff9b00" }: GrowthBarChartProps) => {
    return (
        <div className="widget-chart-card">
            <h3 className="widget-chart-title">{title}</h3>

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

export default GrowthBarChart;
