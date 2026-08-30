import { useRef, useState } from "react";
import useClickOutside from "../../../../hooks/useClickOutsideElementToClose";
import { ALLOWED_ORDER_STATUS_TRANSITIONS } from "../utils/orderStatusBadge";
import type { BusinessOrderResponse, OrderStatus } from "../types";

const NEXT_STATUS_LABEL: Record<OrderStatus, string> = {
    Pending: "",
    Confirmed: "Confirm order",
    Shipped: "Mark as Shipped",
    Delivered: "Mark as Delivered",
    Cancelled: "Cancel order",
};

type OrderRowActionsMenuProps = {
    order: BusinessOrderResponse;
    onView: () => void;
    onChangeStatus: (status: OrderStatus) => void;
    onCancel: () => void;
};

/** Only offers status changes the backend's own AllowedOrderStatusTransitions actually allows from this order's current status. */
const OrderRowActionsMenu = ({ order, onView, onChangeStatus, onCancel }: OrderRowActionsMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useClickOutside(menuRef, () => setIsOpen(false));

    const nextStatuses = ALLOWED_ORDER_STATUS_TRANSITIONS[order.status].filter((s) => s !== "Cancelled");
    const canCancel = ALLOWED_ORDER_STATUS_TRANSITIONS[order.status].includes("Cancelled");

    return (
        <div className="order-row-actions" ref={menuRef}>
            <button
                type="button"
                className="business-dashboard-button-ghost"
                aria-label="Order actions"
                aria-haspopup="menu"
                aria-expanded={isOpen}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen((prev) => !prev);
                }}
            >
                ⋮
            </button>

            {isOpen && (
                <div className="order-row-actions-menu" role="menu">
                    <button
                        type="button"
                        role="menuitem"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                            onView();
                        }}
                    >
                        View order
                    </button>

                    {nextStatuses.map((status) => (
                        <button
                            key={status}
                            type="button"
                            role="menuitem"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(false);
                                onChangeStatus(status);
                            }}
                        >
                            {NEXT_STATUS_LABEL[status]}
                        </button>
                    ))}

                    {canCancel && (
                        <button
                            type="button"
                            role="menuitem"
                            className="order-row-actions-menu-danger"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(false);
                                onCancel();
                            }}
                        >
                            Cancel order
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrderRowActionsMenu;
