import StatCards from "../../../../components/DashboardWidgets/StatCards";
import type { InventorySummary, ProductStockStatus } from "../types";

type InventorySummaryCardsProps = {
    summary?: InventorySummary;
    /** Which stock-status tab the table is currently filtered to — drives the "active" highlight on the matching card. */
    activeStatus?: ProductStockStatus;
    onFilterByStatus: (status: ProductStockStatus | undefined) => void;
};

/** Every card (besides the plain Total Products count) doubles as a filter — clicking one jumps the table below to that stock-status tab. */
const InventorySummaryCards = ({ summary, activeStatus, onFilterByStatus }: InventorySummaryCardsProps) => {
    return (
        <StatCards
            cards={[
                {
                    label: "Total Products",
                    value: (summary?.trackedProductCount ?? 0) + (summary?.untrackedProductCount ?? 0),
                    onClick: () => onFilterByStatus(undefined),
                    isActive: activeStatus === undefined,
                },
                {
                    label: "Tracked Products",
                    value: summary?.trackedProductCount ?? 0,
                    onClick: () => onFilterByStatus("Tracked"),
                    isActive: activeStatus === "Tracked",
                },
                {
                    label: "Untracked Products",
                    value: summary?.untrackedProductCount ?? 0,
                    onClick: () => onFilterByStatus("Untracked"),
                    isActive: activeStatus === "Untracked",
                },
                { label: "Total Units in Stock", value: summary?.totalUnitsInStock ?? 0 },
                {
                    label: "Low Stock",
                    value: summary?.lowStockCount ?? 0,
                    onClick: () => onFilterByStatus("LowStock"),
                    isActive: activeStatus === "LowStock",
                },
                {
                    label: "Out of Stock",
                    value: summary?.outOfStockCount ?? 0,
                    onClick: () => onFilterByStatus("OutOfStock"),
                    isActive: activeStatus === "OutOfStock",
                },
            ]}
        />
    );
};

export default InventorySummaryCards;
