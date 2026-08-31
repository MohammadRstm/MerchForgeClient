import { useQuery } from "@tanstack/react-query";
import { getPlanSubscriptionStatsService } from "../../../../../services/api/subscriptionPlans.api";

const usePlanSubscriptionStats = () => {
    return useQuery({
        queryKey: ["dashboard", "plan-subscription-stats"],
        queryFn: getPlanSubscriptionStatsService,
    });
};

export default usePlanSubscriptionStats;
