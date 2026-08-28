import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    deactivateSubscriptionPlanService,
    reactivateSubscriptionPlanService,
} from "../../../../../services/api/subscriptionPlans.api";
import { notify } from "../../../../../services/toast";
import { ApiError } from "../../../../../Error/ApiError";

const useSetSubscriptionPlanActive = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
            isActive ? reactivateSubscriptionPlanService(id) : deactivateSubscriptionPlanService(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["dashboard", "subscription-plans"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard", "subscription-plan", data.id] });

            notify.success(`Plan "${data.name}" ${data.isActive ? "reactivated" : "deactivated"}.`);
        },
        onError: (error) => {
            notify.error(
                error instanceof ApiError
                    ? error.message
                    : "Failed to update the plan's status."
            );
        },
    });
};

export default useSetSubscriptionPlanActive;
