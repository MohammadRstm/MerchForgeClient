import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getBusinessOrderAnalyticsService } from "../../../../../services/api/dashboard.api";

const useBusinessOrderAnalytics = (businessId: string, from: string, to: string) => {
    return useQuery({
        queryKey: ["dashboard", "business-order-analytics", businessId, from, to],
        queryFn: () => getBusinessOrderAnalyticsService(businessId, from, to),
        enabled: !!businessId && !!from && !!to,
        placeholderData: keepPreviousData,
    });
};

export default useBusinessOrderAnalytics;
