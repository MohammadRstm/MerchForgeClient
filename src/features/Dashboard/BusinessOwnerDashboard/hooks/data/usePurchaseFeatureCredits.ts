import { useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseFeatureCreditsService } from "../../../../../services/api/businessDashboard.api";

const usePurchaseFeatureCredits = (businessId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (packageId: string) => purchaseFeatureCreditsService(businessId, packageId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["business-dashboard", "features", businessId] });
        },
    });
};

export default usePurchaseFeatureCredits;
