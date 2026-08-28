import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSubscriptionPlanService } from "../../../../../services/api/subscriptionPlans.api";
import { notify } from "../../../../../services/toast";
import { ApiError } from "../../../../../Error/ApiError";
import type { SubscriptionPlanPayload } from "../../types";

const useUpdateSubscriptionPlan = (planId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: SubscriptionPlanPayload & { isActive: boolean }) =>
            updateSubscriptionPlanService(planId, payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["dashboard", "subscription-plans"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard", "subscription-plan", planId] });

            notify.success(`Plan "${data.name}" updated.`);
        },
        onError: (error) => {
            notify.error(
                error instanceof ApiError
                    ? error.message
                    : "Failed to update the plan."
            );
        },
    });
};

export default useUpdateSubscriptionPlan;
