import { useQuery } from "@tanstack/react-query";
import { getOrderStatsService } from "../../../../../services/api/businessDashboard.api";

const useOrderStats = (businessId: string) => {
    return useQuery({
        queryKey: ["business-dashboard", "order-stats", businessId],
        queryFn: () => getOrderStatsService(businessId),
        enabled: !!businessId,
    });
};

export default useOrderStats;
