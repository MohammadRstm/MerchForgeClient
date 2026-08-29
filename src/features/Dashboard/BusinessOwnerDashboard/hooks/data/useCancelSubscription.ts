import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelSubscriptionService } from "../../../../../services/api/businessDashboard.api";
import { notify } from "../../../../../services/toast";
import { ApiError } from "../../../../../Error/ApiError";

const useCancelSubscription = (businessId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => cancelSubscriptionService(businessId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["business-dashboard", "subscription", businessId] });

            notify.success(
                `Your plan won't renew — you'll keep access until ${new Date(data!.currentPeriodEnd).toLocaleDateString()}.`
            );
        },
        onError: (error) => {
            notify.error(
                error instanceof ApiError
                    ? error.message
                    : "Failed to cancel your plan."
            );
        },
    });
};

export default useCancelSubscription;
