import { useState } from "react";
import useAuth from "../../../../context/Auth/useAuth";
import useBusinessOrders from "./data/useBusinessOrders";
import useBusinessOrder from "./data/useBusinessOrder";
import useUpdateOrderStatus from "./data/useUpdateOrderStatus";
import useUpdateOrderPaymentStatus from "./data/useUpdateOrderPaymentStatus";
import useOrdersTableState from "./ui/useOrdersTableState";
import { ApiError } from "../../../../Error/ApiError";
import type { OrderStatus, PaymentStatus } from "../types";

const useOwnerOrdersPage = () => {
    const { session } = useAuth();
    const businessId = session?.business?.id ?? "";

    const ordersTable = useOrdersTableState();

    const {
        data: ordersPage,
        isLoading: ordersLoading,
        isFetching: ordersFetching,
        isError: ordersError,
    } = useBusinessOrders(businessId, ordersTable.query);

    const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>(undefined);

    const {
        data: selectedOrder,
        isLoading: selectedOrderLoading,
        isError: selectedOrderError,
    } = useBusinessOrder(businessId, selectedOrderId);

    const {
        mutate: updateStatus,
        isPending: isUpdatingStatus,
        error: updateStatusErrorRaw,
        reset: resetUpdateStatusError,
    } = useUpdateOrderStatus(businessId);

    const { mutate: updatePaymentStatus, isPending: isUpdatingPaymentStatus } =
        useUpdateOrderPaymentStatus(businessId);

    const viewOrder = (orderId: string) => {
        resetUpdateStatusError();
        setSelectedOrderId(orderId);
    };

    const closeOrder = () => setSelectedOrderId(undefined);

    const updateOrderStatus = (status: OrderStatus) => {
        if (!selectedOrderId) return;

        updateStatus({ orderId: selectedOrderId, status });
    };

    const updateOrderPaymentStatus = (paymentStatus: PaymentStatus) => {
        if (!selectedOrderId) return;

        updatePaymentStatus({ orderId: selectedOrderId, paymentStatus });
    };

    return {
        ordersPage,
        ordersLoading,
        ordersFetching,
        ordersError,
        ordersTable,

        selectedOrderId,
        selectedOrder,
        selectedOrderLoading,
        selectedOrderError,
        viewOrder,
        closeOrder,

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
    };
};

export default useOwnerOrdersPage;
