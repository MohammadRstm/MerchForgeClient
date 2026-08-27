import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatusService } from "../../../../../services/api/businessDashboard.api";
import type { OrderStatus } from "../../types";

const useUpdateOrderStatus = (businessId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
            updateOrderStatusService(businessId, orderId, status),

        // A status change (especially -> Cancelled, which restocks) touches the
        // order list, this order's own detail, Overview's pendingOrderCount, and
        // potentially the inventory summary/table — broad invalidation, same
        // reasoning as useAdjustStock.
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["business-dashboard"] });
        },
    });
};

export default useUpdateOrderStatus;
