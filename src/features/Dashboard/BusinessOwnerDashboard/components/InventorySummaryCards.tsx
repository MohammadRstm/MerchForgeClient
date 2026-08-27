import StatCards from "../../../../components/DashboardWidgets/StatCards";
import type { InventorySummary } from "../types";

type InventorySummaryCardsProps = {
    summary?: InventorySummary;
};

const InventorySummaryCards = ({ summary }: InventorySummaryCardsProps) => {
    return (
        <StatCards
            cards={[
                { label: "Tracked Products", value: summary?.trackedProductCount ?? 0 },
                { label: "Untracked Products", value: summary?.untrackedProductCount ?? 0 },
                { label: "Total Units in Stock", value: summary?.totalUnitsInStock ?? 0 },
                { label: "Low Stock", value: summary?.lowStockCount ?? 0 },
                { label: "Out of Stock", value: summary?.outOfStockCount ?? 0 },
            ]}
        />
    );
};

export default InventorySummaryCards;
