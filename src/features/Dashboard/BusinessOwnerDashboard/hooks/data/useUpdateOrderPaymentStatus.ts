import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderPaymentStatusService } from "../../../../../services/api/businessDashboard.api";
import type { PaymentStatus } from "../../types";

const useUpdateOrderPaymentStatus = (businessId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ orderId, paymentStatus }: { orderId: string; paymentStatus: PaymentStatus }) =>
            updateOrderPaymentStatusService(businessId, orderId, paymentStatus),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["business-dashboard", "orders"] });
            queryClient.invalidateQueries({ queryKey: ["business-dashboard", "order"] });
        },
    });
};

export default useUpdateOrderPaymentStatus;
