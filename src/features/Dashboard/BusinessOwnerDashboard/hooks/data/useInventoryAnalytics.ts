import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getInventoryAnalyticsService } from "../../../../../services/api/businessDashboard.api";

const useInventoryAnalytics = (businessId: string, from: string, to: string) => {
    return useQuery({
        queryKey: ["business-dashboard", "inventory-analytics", businessId, from, to],
        queryFn: () => getInventoryAnalyticsService(businessId, from, to),
        enabled: !!businessId && !!from && !!to,
        placeholderData: keepPreviousData,
    });
};

export default useInventoryAnalytics;
