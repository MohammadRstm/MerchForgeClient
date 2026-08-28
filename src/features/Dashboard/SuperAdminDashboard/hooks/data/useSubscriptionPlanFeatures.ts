import { useQuery } from "@tanstack/react-query";
import { getSubscriptionPlanFeaturesService } from "../../../../../services/api/subscriptionPlans.api";

const useSubscriptionPlanFeatures = () => {
    return useQuery({
        queryKey: ["dashboard", "subscription-plan-features"],
        queryFn: getSubscriptionPlanFeaturesService,
    });
};

export default useSubscriptionPlanFeatures;
