import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubscriptionPlanService } from "../../../../../services/api/subscriptionPlans.api";
import { notify } from "../../../../../services/toast";
import { ApiError } from "../../../../../Error/ApiError";

const useCreateSubscriptionPlan = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSubscriptionPlanService,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["dashboard", "subscription-plans"] });

            notify.success(`Plan "${data.name}" added.`);
        },
        onError: (error) => {
            notify.error(
                error instanceof ApiError
                    ? error.message
                    : "Failed to add the plan."
            );
        },
    });
};

export default useCreateSubscriptionPlan;
