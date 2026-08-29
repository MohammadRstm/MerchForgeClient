import { useQuery } from "@tanstack/react-query";
import { getPublicSubscriptionPlansService } from "../../../services/api/subscriptionPlans.api";

/** Active plans with their features — no auth, shared by the landing page, the public plan-detail page, and the owner billing page. */
const usePublicSubscriptionPlans = () => {
    return useQuery({
        queryKey: ["subscription-plans", "public"],
        queryFn: getPublicSubscriptionPlansService,
    });
};

export default usePublicSubscriptionPlans;
