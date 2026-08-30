import StatCards from "../../../../components/DashboardWidgets/StatCards";
import type { OrderStats, OrderStatus } from "../types";

type OrderStatCardsProps = {
    stats?: OrderStats;
    activeStatus: OrderStatus | undefined;
    onFilterByStatus: (status: OrderStatus | undefined) => void;
};

const OrderStatCards = ({ stats, activeStatus, onFilterByStatus }: OrderStatCardsProps) => {
    return (
        <StatCards
            cards={[
                {
                    label: "Total Orders",
                    value: stats?.totalCount ?? 0,
                    isActive: activeStatus === undefined,
                    onClick: () => onFilterByStatus(undefined),
                },
                {
                    label: "Pending",
                    value: stats?.pendingCount ?? 0,
                    isActive: activeStatus === "Pending",
                    onClick: () => onFilterByStatus("Pending"),
                },
                {
                    label: "Confirmed",
                    value: stats?.confirmedCount ?? 0,
                    isActive: activeStatus === "Confirmed",
                    onClick: () => onFilterByStatus("Confirmed"),
                },
                {
                    label: "Shipped",
                    value: stats?.shippedCount ?? 0,
                    isActive: activeStatus === "Shipped",
                    onClick: () => onFilterByStatus("Shipped"),
                },
                {
                    label: "Delivered",
                    value: stats?.deliveredCount ?? 0,
                    isActive: activeStatus === "Delivered",
                    onClick: () => onFilterByStatus("Delivered"),
                },
                {
                    label: "Cancelled",
                    value: stats?.cancelledCount ?? 0,
                    isActive: activeStatus === "Cancelled",
                    onClick: () => onFilterByStatus("Cancelled"),
                },
            ]}
        />
    );
};

export default OrderStatCards;
