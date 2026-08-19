import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBusinessProductService } from "../../../../../services/api/businessDashboard.api";

const useDeleteProduct = (businessId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (productId: string) => deleteBusinessProductService(businessId, productId),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["business-dashboard"] });
        },
    });
};

export default useDeleteProduct;
