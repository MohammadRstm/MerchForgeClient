import { useQuery } from "@tanstack/react-query";
import { getSubscriptionPlanDistributionService } from "../../../../../services/api/subscriptionPlans.api";

const useSubscriptionPlanDistribution = () => {
    return useQuery({
        queryKey: ["dashboard", "subscription-plan-distribution"],
        queryFn: getSubscriptionPlanDistributionService,
    });
};

export default useSubscriptionPlanDistribution;
