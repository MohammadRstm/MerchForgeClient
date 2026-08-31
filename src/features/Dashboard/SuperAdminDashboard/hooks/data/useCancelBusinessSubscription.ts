import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelBusinessSubscriptionService } from "../../../../../services/api/dashboard.api";
import { notify } from "../../../../../services/toast";
import { ApiError } from "../../../../../Error/ApiError";

const useCancelBusinessSubscription = (businessId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => cancelBusinessSubscriptionService(businessId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboard", "business-detail", businessId] });
            queryClient.invalidateQueries({ queryKey: ["dashboard", "business-subscription-history", businessId] });
            queryClient.invalidateQueries({ queryKey: ["dashboard", "subscriptions"] });

            notify.success("Subscription set to end at the end of the current period.");
        },
        onError: (error) => {
            notify.error(
                error instanceof ApiError ? error.message : "Failed to cancel this business's subscription."
            );
        },
    });
};

export default useCancelBusinessSubscription;
