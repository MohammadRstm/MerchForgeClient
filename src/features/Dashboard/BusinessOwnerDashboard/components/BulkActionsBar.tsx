import { commonNextStatuses } from "../utils/orderStatusBadge";
import type { BusinessOrderResponse, OrderStatus } from "../types";

const STATUS_ACTION_LABEL: Record<OrderStatus, string> = {
    Pending: "",
    Confirmed: "Confirm selected",
    Shipped: "Mark selected as Shipped",
    Delivered: "Mark selected as Delivered",
    Cancelled: "Cancel selected",
};

type BulkActionsBarProps = {
    selectedOrders: BusinessOrderResponse[];
    isRunning: boolean;
    onRunAction: (status: OrderStatus) => void;
    onCancel: () => void;
    onExportSelected: () => void;
    onPrintSelected: () => void;
};

/**
 * Only offers a status action when EVERY selected order can currently make that
 * transition (see commonNextStatuses) — a mixed selection just offers fewer buttons
 * rather than one that would silently fail for part of the selection.
 */
const BulkActionsBar = ({
    selectedOrders,
    isRunning,
    onRunAction,
    onCancel,
    onExportSelected,
    onPrintSelected,
}: BulkActionsBarProps) => {
    if (selectedOrders.length === 0) return null;

    const nextStatuses = commonNextStatuses(selectedOrders).filter((s) => s !== "Cancelled");
    const canCancel = commonNextStatuses(selectedOrders).includes("Cancelled");

    return (
        <div className="bulk-actions-bar">
            <span className="bulk-actions-count">{selectedOrders.length} selected</span>

            <div className="bulk-actions-buttons">
                {nextStatuses.map((status) => (
                    <button
                        key={status}
                        type="button"
                        className="business-dashboard-button-secondary"
                        disabled={isRunning}
                        onClick={() => onRunAction(status)}
                    >
                        {STATUS_ACTION_LABEL[status]}
                    </button>
                ))}

                {canCancel && (
                    <button
                        type="button"
                        className="business-dashboard-button-danger"
                        disabled={isRunning}
                        onClick={onCancel}
                    >
                        Cancel selected
                    </button>
                )}

                <button type="button" className="business-dashboard-button-ghost" onClick={onExportSelected}>
                    Export selected
                </button>

                <button type="button" className="business-dashboard-button-ghost" onClick={onPrintSelected}>
                    Print selected
                </button>
            </div>
        </div>
    );
};

export default BulkActionsBar;
