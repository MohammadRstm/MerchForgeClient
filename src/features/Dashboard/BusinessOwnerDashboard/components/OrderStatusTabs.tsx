import type { OrderStatus } from "../types";

const STATUS_TABS: { value: OrderStatus | undefined; label: string }[] = [
    { value: undefined, label: "All" },
    { value: "Pending", label: "Pending" },
    { value: "Confirmed", label: "Confirmed" },
    { value: "Shipped", label: "Shipped" },
    { value: "Delivered", label: "Delivered" },
    { value: "Cancelled", label: "Cancelled" },
];

type OrderStatusTabsProps = {
    activeStatus: OrderStatus | undefined;
    onChange: (status: OrderStatus | undefined) => void;
};

/** Same underlying filter state as the KPI cards — this is just a second, always-visible way to set it. */
const OrderStatusTabs = ({ activeStatus, onChange }: OrderStatusTabsProps) => {
    return (
        <div className="order-status-tabs" role="tablist" aria-label="Filter orders by status">
            {STATUS_TABS.map((tab) => (
                <button
                    key={tab.label}
                    type="button"
                    role="tab"
                    aria-selected={activeStatus === tab.value}
                    className={`order-status-tab${activeStatus === tab.value ? " order-status-tab--active" : ""}`}
                    onClick={() => onChange(tab.value)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default OrderStatusTabs;
