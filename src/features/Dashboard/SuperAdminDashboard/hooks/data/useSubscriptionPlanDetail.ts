import { useQuery } from "@tanstack/react-query";
import { getSubscriptionPlanDetailService } from "../../../../../services/api/subscriptionPlans.api";

const useSubscriptionPlanDetail = (planId: string | null) => {
    return useQuery({
        queryKey: ["dashboard", "subscription-plan", planId],
        queryFn: () => getSubscriptionPlanDetailService(planId!),
        enabled: !!planId,
    });
};

export default useSubscriptionPlanDetail;
