import { useQuery } from "@tanstack/react-query";
import { getBusinessDashboardStatsService } from "../../../../../services/api/businessDashboard.api";

const useBusinessDashboardStats = (businessId: string) => {
    return useQuery({
        queryKey: ["business-dashboard", "stats", businessId],
        queryFn: () => getBusinessDashboardStatsService(businessId),
        enabled: !!businessId,
    });
};

export default useBusinessDashboardStats;
