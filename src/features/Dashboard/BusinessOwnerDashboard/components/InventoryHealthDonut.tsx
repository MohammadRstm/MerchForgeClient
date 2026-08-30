import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { InventorySummary } from "../types";

// Matches the existing business-dashboard-badge status palette (active/pastdue/cancelled)
// so the donut reads as the same visual language as every status badge on this page.
const SEGMENT_COLORS = {
    inStock: "#12875a",
    lowStock: "#b25e00",
    outOfStock: "#d92d20",
    untracked: "#94a3b8",
} as const;

type InventoryHealthDonutProps = {
    summary?: InventorySummary;
};

type TooltipPayloadEntry = { name: string; value: number; payload: { color: string } };

const HealthTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayloadEntry[] }) => {
    if (!active || !payload || payload.length === 0) return null;
    const entry = payload[0];

    return (
        <div className="analytics-tooltip">
            <div className="analytics-tooltip-row analytics-tooltip-row--active">
                <span className="analytics-tooltip-dot" style={{ background: entry.payload.color }} />
                <span className="analytics-tooltip-label">{entry.name}</span>
                <span className="analytics-tooltip-value">{entry.value}</span>
            </div>
        </div>
    );
};

/** A custom donut (not the plain BreakdownPieChart) — the center label doubles as the tracked-product total, and segment colors match the existing status-badge palette so this reads as one visual system with the rest of the dashboard. */
const InventoryHealthDonut = ({ summary }: InventoryHealthDonutProps) => {
    if (!summary) {
        return (
            <section className="business-dashboard-table-card inventory-health-card">
                <div className="business-dashboard-table-header">
                    <h3>Inventory Health</h3>
                </div>
                <div className="business-dashboard-table-loading">
                    <span className="business-dashboard-table-message">Loading…</span>
                </div>
            </section>
        );
    }

    const inStockCount = Math.max(
        summary.trackedProductCount - summary.lowStockCount - summary.outOfStockCount,
        0
    );

    const segments = [
        { name: "In Stock", value: inStockCount, color: SEGMENT_COLORS.inStock },
        { name: "Low Stock", value: summary.lowStockCount, color: SEGMENT_COLORS.lowStock },
        { name: "Out of Stock", value: summary.outOfStockCount, color: SEGMENT_COLORS.outOfStock },
        { name: "Untracked", value: summary.untrackedProductCount, color: SEGMENT_COLORS.untracked },
    ];

    const total = segments.reduce((sum, s) => sum + s.value, 0);
    const visibleSegments = segments.filter((s) => s.value > 0);

    return (
        <section className="business-dashboard-table-card inventory-health-card">
            <div className="business-dashboard-table-header">
                <h3>Inventory Health</h3>
            </div>

            {total === 0 ? (
                <p className="business-dashboard-table-message">No products yet.</p>
            ) : (
                <div className="inventory-health-body">
                    <div className="inventory-health-chart">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={visibleSegments}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={62}
                                    outerRadius={86}
                                    paddingAngle={visibleSegments.length > 1 ? 3 : 0}
                                    startAngle={90}
                                    endAngle={-270}
                                    isAnimationActive
                                    animationDuration={500}
                                >
                                    {visibleSegments.map((entry) => (
                                        <Cell key={entry.name} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip content={<HealthTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="inventory-health-center">
                            <span className="inventory-health-center-value">{total}</span>
                            <span className="inventory-health-center-label">products</span>
                        </div>
                    </div>

                    <ul className="inventory-health-legend">
                        {segments.map((segment) => (
                            <li key={segment.name}>
                                <span className="inventory-health-legend-dot" style={{ background: segment.color }} />
                                <span className="inventory-health-legend-label">{segment.name}</span>
                                <span className="inventory-health-legend-value">{segment.value}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
};

export default InventoryHealthDonut;
