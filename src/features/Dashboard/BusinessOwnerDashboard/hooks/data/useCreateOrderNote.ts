import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrderNoteService } from "../../../../../services/api/businessDashboard.api";

const useCreateOrderNote = (businessId: string, orderId: string | undefined) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (content: string) => createOrderNoteService(businessId, orderId!, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["business-dashboard", "order-notes", businessId, orderId] });
        },
    });
};

export default useCreateOrderNote;
