import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrderNoteService } from "../../../../../services/api/businessDashboard.api";
import { notify } from "../../../../../services/toast";
import { ApiError } from "../../../../../Error/ApiError";

const useCreateOrderNote = (businessId: string, orderId: string | undefined) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (content: string) => createOrderNoteService(businessId, orderId!, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["business-dashboard", "order-notes", businessId, orderId] });
        },
        onError: (error) => {
            notify.error(
                error instanceof ApiError
                    ? error.message
                    : "Failed to add note."
            );
        },
    });
};

export default useCreateOrderNote;
