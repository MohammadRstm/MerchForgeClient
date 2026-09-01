import { useQuery } from "@tanstack/react-query";
import { getSubscriptionPlanGroupsService } from "../../../../../services/api/subscriptionPlans.api";

const useSubscriptionPlanGroups = () => {
    return useQuery({
        queryKey: ["dashboard", "subscription-plan-groups"],
        queryFn: getSubscriptionPlanGroupsService,
    });
};

export default useSubscriptionPlanGroups;
