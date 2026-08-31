import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeBusinessSubscriptionService } from "../../../../../services/api/dashboard.api";
import { notify } from "../../../../../services/toast";
import { ApiError } from "../../../../../Error/ApiError";

const useChangeBusinessSubscription = (businessId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (subscriptionPlanId: string) => changeBusinessSubscriptionService(businessId, subscriptionPlanId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["dashboard", "business-detail", businessId] });
            queryClient.invalidateQueries({ queryKey: ["dashboard", "business-subscription-history", businessId] });
            queryClient.invalidateQueries({ queryKey: ["dashboard", "subscriptions"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard", "subscription-plan-groups"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard", "plan-subscription-stats"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard", "subscription-plan-distribution"] });

            notify.success(data ? `Subscription changed to ${data.planName}.` : "Subscription changed.");
        },
        onError: (error) => {
            notify.error(
                error instanceof ApiError ? error.message : "Failed to change this business's subscription."
            );
        },
    });
};

export default useChangeBusinessSubscription;
