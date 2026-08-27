import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLowStockThresholdService } from "../../../../../services/api/businessDashboard.api";

const useUpdateLowStockThreshold = (businessId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (lowStockThreshold: number) => updateLowStockThresholdService(businessId, lowStockThreshold),

        // The threshold changes which bucket every tracked product falls into, so
        // both the summary counts and the table's Low Stock/In Stock filters need to
        // recount — same broad invalidation as useAdjustStock.
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["business-dashboard"] });
        },
    });
};

export default useUpdateLowStockThreshold;
