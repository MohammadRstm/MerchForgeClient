import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrderAnalyticsService } from "../../../../../services/api/businessDashboard.api";

const useOrderAnalytics = (businessId: string, from: string, to: string) => {
    return useQuery({
        queryKey: ["business-dashboard", "order-analytics", businessId, from, to],
        queryFn: () => getOrderAnalyticsService(businessId, from, to),
        enabled: !!businessId,
        // Keeps the previous range's chart on screen while the new one loads, instead
        // of a flash to a loading state every time the range/custom dates change.
        placeholderData: keepPreviousData,
    });
};

export default useOrderAnalytics;
