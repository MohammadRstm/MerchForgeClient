import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscribeToPlanService } from "../../../../../services/api/businessDashboard.api";
import { notify } from "../../../../../services/toast";
import { ApiError } from "../../../../../Error/ApiError";

const useSubscribeToPlan = (businessId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (subscriptionPlanId: string) => subscribeToPlanService(businessId, subscriptionPlanId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["business-dashboard", "subscription", businessId] });
            queryClient.invalidateQueries({ queryKey: ["business-dashboard", "features", businessId] });

            notify.success(`You're now on the ${data?.planName} plan.`);
        },
        onError: (error) => {
            notify.error(
                error instanceof ApiError
                    ? error.message
                    : "Failed to subscribe to that plan."
            );
        },
    });
};

export default useSubscribeToPlan;
