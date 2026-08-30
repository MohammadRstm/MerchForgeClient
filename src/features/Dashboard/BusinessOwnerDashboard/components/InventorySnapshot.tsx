import { useNavigate } from "react-router";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { routes } from "../../../../config/routes";
import type { BusinessProductResponse, InventorySummary } from "../types";

// Matches InventoryHealthDonut's palette exactly — the "same inventory-health visual language as the Inventory page" this section is meant to echo.
const SEGMENT_COLORS = {
    inStock: "#12875a",
    lowStock: "#b25e00",
    outOfStock: "#d92d20",
    untracked: "#94a3b8",
} as const;

type InventorySnapshotProps = {
    summary?: InventorySummary;
    isLoading: boolean;
    isError: boolean;
    attentionProducts: BusinessProductResponse[];
};

/** A distilled version of the Inventory page's health donut plus its most urgent products — not the full page, just enough to answer "is my inventory okay right now?" */
const InventorySnapshot = ({ summary, isLoading, isError, attentionProducts }: InventorySnapshotProps) => {
    const navigate = useNavigate();

    const inStockCount = summary
        ? Math.max(summary.trackedProductCount - summary.lowStockCount - summary.outOfStockCount, 0)
        : 0;

    const segments = summary
        ? [
              { name: "In Stock", value: inStockCount, color: SEGMENT_COLORS.inStock },
              { name: "Low Stock", value: summary.lowStockCount, color: SEGMENT_COLORS.lowStock },
              { name: "Out of Stock", value: summary.outOfStockCount, color: SEGMENT_COLORS.outOfStock },
              { name: "Untracked", value: summary.untrackedProductCount, color: SEGMENT_COLORS.untracked },
          ].filter((s) => s.value > 0)
        : [];

    const total = summary ? summary.trackedProductCount + summary.untrackedProductCount : 0;

    return (
        <section className="business-dashboard-table-card overview-inventory-snapshot">
            <div className="business-dashboard-table-header">
                <h3>Inventory Health</h3>
            </div>

            {isLoading ? (
                <div className="business-dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="business-dashboard-table-message business-dashboard-table-message--error">
                    Unable to load inventory right now.
                </p>
            ) : total === 0 ? (
                <p className="business-dashboard-table-message">No products yet.</p>
            ) : (
                <>
                    <div className="overview-inventory-snapshot__body">
                        <div className="overview-inventory-snapshot__chart">
                            <ResponsiveContainer width="100%" height={120}>
                                <PieChart>
                                    <Pie
                                        data={segments}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={38}
                                        outerRadius={56}
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
                                <span>{total}</span>
                            </div>
                        </div>

                        <ul className="overview-inventory-snapshot__legend">
                            <li>
                                <span className="inventory-health-legend-dot" style={{ background: SEGMENT_COLORS.inStock }} />
                                {inStockCount} In Stock
                            </li>
                            <li>
                                <span className="inventory-health-legend-dot" style={{ background: SEGMENT_COLORS.lowStock }} />
                                {summary?.lowStockCount ?? 0} Low Stock
                            </li>
                            <li>
                                <span className="inventory-health-legend-dot" style={{ background: SEGMENT_COLORS.outOfStock }} />
                                {summary?.outOfStockCount ?? 0} Out of Stock
                            </li>
                            <li>
                                <span className="inventory-health-legend-dot" style={{ background: SEGMENT_COLORS.untracked }} />
                                {summary?.untrackedProductCount ?? 0} Untracked
                            </li>
                        </ul>
                    </div>

                    {attentionProducts.length > 0 ? (
                        <ul className="overview-inventory-snapshot__alerts">
                            {attentionProducts.map((product) => (
                                <li key={product.id}>
                                    <span>{product.title}</span>
                                    <span className="overview-inventory-snapshot__alert-stock">
                                        {product.stockQuantity === 0 ? "Out of stock" : `${product.stockQuantity} left`}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="business-dashboard-form-hint">Your inventory is looking healthy.</p>
                    )}

                    <button
                        type="button"
                        className="business-dashboard-button-ghost overview-section-link"
                        onClick={() => navigate(routes.DASHBOARD_INVENTORY)}
                    >
                        Manage Inventory →
                    </button>
                </>
            )}
        </section>
    );
};

export default InventorySnapshot;
