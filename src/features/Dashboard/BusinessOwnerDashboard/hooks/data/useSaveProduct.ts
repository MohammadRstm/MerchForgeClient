import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createBusinessProductService,
    updateBusinessProductService,
    type SaveProductPayload,
} from "../../../../../services/api/businessDashboard.api";

type SaveProductArgs = {
    /** Present when editing, absent when creating. */
    productId?: string;
    payload: SaveProductPayload;
};

const useSaveProduct = (businessId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, payload }: SaveProductArgs) =>
            productId
                ? updateBusinessProductService(businessId, productId, payload)
                : createBusinessProductService(businessId, payload),

        onSuccess: () => {
            // Invalidates the whole dashboard: the product list obviously, but also
            // the stats, whose product count, price averages and category breakdown
            // are all now stale.
            queryClient.invalidateQueries({ queryKey: ["business-dashboard"] });
        },
    });
};

export default useSaveProduct;
