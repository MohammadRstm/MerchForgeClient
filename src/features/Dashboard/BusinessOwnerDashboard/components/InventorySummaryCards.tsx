import StatCards from "../../../../components/DashboardWidgets/StatCards";
import type { InventorySummary } from "../types";

type InventorySummaryCardsProps = {
    summary?: InventorySummary;
    onEditThreshold: () => void;
};

const InventorySummaryCards = ({ summary, onEditThreshold }: InventorySummaryCardsProps) => {
    return (
        <>
            <div className="business-dashboard-header-actions" style={{ justifyContent: "flex-end" }}>
                <span className="business-dashboard-badge">
                    Low stock threshold: {summary?.lowStockThreshold ?? "—"} units
                </span>
                <button type="button" className="business-dashboard-button-secondary" onClick={onEditThreshold}>
                    Edit threshold
                </button>
            </div>

            <StatCards
                cards={[
                    { label: "Tracked Products", value: summary?.trackedProductCount ?? 0 },
                    { label: "Untracked Products", value: summary?.untrackedProductCount ?? 0 },
                    { label: "Total Units in Stock", value: summary?.totalUnitsInStock ?? 0 },
                    { label: "Low Stock", value: summary?.lowStockCount ?? 0 },
                    { label: "Out of Stock", value: summary?.outOfStockCount ?? 0 },
                ]}
            />
        </>
    );
};

export default InventorySummaryCards;
