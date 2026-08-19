import { useQuery } from "@tanstack/react-query";
import { getBusinessSubscriptionService } from "../../../../../services/api/businessDashboard.api";

const useBusinessSubscription = (businessId: string) => {
    return useQuery({
        queryKey: ["business-dashboard", "subscription", businessId],
        queryFn: () => getBusinessSubscriptionService(businessId),
        enabled: !!businessId,
    });
};

export default useBusinessSubscription;
