import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adjustProductStockService } from "../../../../../services/api/businessDashboard.api";

type AdjustStockVariables = {
    productId: string;
    amount: number;
    reason?: string;
};

const useAdjustStock = (businessId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, amount, reason }: AdjustStockVariables) =>
            adjustProductStockService(businessId, productId, amount, reason),

        // One adjustment touches the product list, the inventory summary, the
        // recent-activity list, and Overview's outOfStockProductCount all at once —
        // a broad invalidation is simpler and correct rather than patching four
        // caches by hand, same as useDeleteProduct.
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["business-dashboard"] });
        },
    });
};

export default useAdjustStock;
