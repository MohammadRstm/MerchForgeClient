import { useQuery } from "@tanstack/react-query";
import { getSubscriptionHistoryService } from "../../../../../services/api/businessDashboard.api";

const useSubscriptionHistory = (businessId: string) => {
    return useQuery({
        queryKey: ["business-dashboard", "subscription-history", businessId],
        queryFn: () => getSubscriptionHistoryService(businessId),
        enabled: !!businessId,
    });
};

export default useSubscriptionHistory;
