import { useState } from "react";
import useAuth from "../../../../context/Auth/useAuth";
import useBusinessOrders from "./data/useBusinessOrders";
import useBusinessOrder from "./data/useBusinessOrder";
import useOrderStats from "./data/useOrderStats";
import useOrderNotes from "./data/useOrderNotes";
import useCreateOrderNote from "./data/useCreateOrderNote";
import useOrderStatusHistory from "./data/useOrderStatusHistory";
import useUpdateOrderStatus from "./data/useUpdateOrderStatus";
import useUpdateOrderPaymentStatus from "./data/useUpdateOrderPaymentStatus";
import useOrdersTableState from "./ui/useOrdersTableState";
import useOrderSelection from "./ui/useOrderSelection";
import useBulkOrderActions from "./ui/useBulkOrderActions";
import useExportOrders from "./ui/useExportOrders";
import { downloadOrdersCsv } from "../utils/exportOrdersToCsv";
import { ApiError } from "../../../../Error/ApiError";
import type { OrderStatus, PaymentStatus } from "../types";

type CancelTarget = { type: "single"; orderId: string } | { type: "bulk"; orderIds: string[] };

const useOwnerOrdersPage = () => {
    const { session } = useAuth();
    const businessId = session?.business?.id ?? "";

    const { data: stats, isLoading: statsLoading } = useOrderStats(businessId);

    const ordersTable = useOrdersTableState();

    const {
        data: ordersPage,
        isLoading: ordersLoading,
        isFetching: ordersFetching,
        isError: ordersError,
    } = useBusinessOrders(businessId, ordersTable.query);

    const selection = useOrderSelection(ordersPage?.items ?? []);

    const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>(undefined);

    const {
        data: selectedOrder,
        isLoading: selectedOrderLoading,
        isError: selectedOrderError,
    } = useBusinessOrder(businessId, selectedOrderId);

    const { data: orderNotes, isLoading: orderNotesLoading } = useOrderNotes(businessId, selectedOrderId);
    const { mutate: addNote, isPending: isAddingNote } = useCreateOrderNote(businessId, selectedOrderId);

    const { data: orderStatusHistory, isLoading: orderStatusHistoryLoading } = useOrderStatusHistory(
        businessId,
        selectedOrderId
    );

    const {
        mutate: updateStatus,
        isPending: isUpdatingStatus,
        error: updateStatusErrorRaw,
        reset: resetUpdateStatusError,
    } = useUpdateOrderStatus(businessId);

    const { mutate: updatePaymentStatus, isPending: isUpdatingPaymentStatus } =
        useUpdateOrderPaymentStatus(businessId);

    const { runBulkStatusUpdate, isRunning: isBulkUpdating } = useBulkOrderActions(businessId);
    const { exportFiltered, isExporting } = useExportOrders(businessId);

    const [cancelTarget, setCancelTarget] = useState<CancelTarget | undefined>(undefined);
    const [bulkActionError, setBulkActionError] = useState<string | undefined>(undefined);

    const viewOrder = (orderId: string) => {
        resetUpdateStatusError();
        setSelectedOrderId(orderId);
    };

    const closeOrder = () => setSelectedOrderId(undefined);

    const changeOrderStatus = (orderId: string, status: OrderStatus) => {
        updateStatus({ orderId, status });
    };

    const updateOrderStatus = (status: OrderStatus) => {
        if (!selectedOrderId) return;
        changeOrderStatus(selectedOrderId, status);
    };

    const updateOrderPaymentStatus = (paymentStatus: PaymentStatus) => {
        if (!selectedOrderId) return;
        updatePaymentStatus({ orderId: selectedOrderId, paymentStatus });
    };

    const addOrderNote = (content: string) => {
        if (!content.trim()) return;
        addNote(content.trim());
    };

    // KPI cards and the status tabs both drive this same query state — clicking
    // "Total Orders" clears the filter rather than being a fifth tab value.
    const filterByStatus = (status: OrderStatus | undefined) => {
        ordersTable.handleStatusChange(status);
    };

    const viewPendingOrders = () => filterByStatus("Pending");

    const requestCancelOrder = (orderId: string) => setCancelTarget({ type: "single", orderId });
    const requestBulkCancel = () => setCancelTarget({ type: "bulk", orderIds: [...selection.selectedIds] });
    const dismissCancelDialog = () => setCancelTarget(undefined);

    const confirmCancel = () => {
        if (!cancelTarget) return;

        if (cancelTarget.type === "single") {
            updateStatus(
                { orderId: cancelTarget.orderId, status: "Cancelled" },
                { onSuccess: () => setCancelTarget(undefined) }
            );
            return;
        }

        setBulkActionError(undefined);
        runBulkStatusUpdate(cancelTarget.orderIds, "Cancelled").then(({ failed }) => {
            setCancelTarget(undefined);
            selection.clear();
            if (failed > 0) {
                setBulkActionError(`${failed} order(s) couldn't be cancelled. They may have already moved on.`);
            }
        });
    };

    const runBulkAction = async (status: OrderStatus) => {
        setBulkActionError(undefined);
        const orderIds = [...selection.selectedIds];
        const { failed } = await runBulkStatusUpdate(orderIds, status);
        selection.clear();
        if (failed > 0) {
            setBulkActionError(`${failed} order(s) couldn't be updated. They may have already moved on.`);
        }
    };

    const exportCurrentFilter = () => exportFiltered(ordersTable.query, "orders");

    const exportSelected = () => {
        if (selection.selectedOrders.length === 0) return;
        downloadOrdersCsv(selection.selectedOrders, `orders-selected-${new Date().toISOString().slice(0, 10)}.csv`);
    };

    return {
        stats,
        statsLoading,

        ordersPage,
        ordersLoading,
        ordersFetching,
        ordersError,
        ordersTable,

        selection,

        selectedOrderId,
        selectedOrder,
        selectedOrderLoading,
        selectedOrderError,
        viewOrder,
        closeOrder,

        orderNotes,
        orderNotesLoading,
        addOrderNote,
        isAddingNote,

        orderStatusHistory,
        orderStatusHistoryLoading,

        isUpdatingStatus,
        isUpdatingPaymentStatus,
        updateStatusError:
            updateStatusErrorRaw instanceof ApiError
                ? updateStatusErrorRaw.message
                : updateStatusErrorRaw
                    ? "Couldn't update this order. Please try again."
                    : undefined,
        updateOrderStatus,
        updateOrderPaymentStatus,
        changeOrderStatus,

        filterByStatus,
        viewPendingOrders,

        cancelTarget,
        requestCancelOrder,
        requestBulkCancel,
        dismissCancelDialog,
        confirmCancel,
        isCancelling: cancelTarget?.type === "single" ? isUpdatingStatus : isBulkUpdating,

        runBulkAction,
        isBulkUpdating,
        bulkActionError,

        exportCurrentFilter,
        exportSelected,
        isExporting,
    };
};

export default useOwnerOrdersPage;
