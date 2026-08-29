import { useQuery } from "@tanstack/react-query";
import { getSubscriptionPlansService } from "../../../../../services/api/subscriptionPlans.api";

const useSubscriptionPlans = () => {
    return useQuery({
        queryKey: ["dashboard", "subscription-plans"],
        queryFn: getSubscriptionPlansService,
    });
};

export default useSubscriptionPlans;
