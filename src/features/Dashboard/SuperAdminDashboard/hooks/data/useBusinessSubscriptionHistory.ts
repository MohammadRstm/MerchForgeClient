import { useQuery } from "@tanstack/react-query";
import { getBusinessSubscriptionHistoryService } from "../../../../../services/api/dashboard.api";

const useBusinessSubscriptionHistory = (businessId: string, enabled = true) => {
    return useQuery({
        queryKey: ["dashboard", "business-subscription-history", businessId],
        queryFn: () => getBusinessSubscriptionHistoryService(businessId),
        enabled: !!businessId && enabled,
    });
};

export default useBusinessSubscriptionHistory;
