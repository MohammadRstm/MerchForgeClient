import { useQuery } from "@tanstack/react-query";
import { getDashboardBusinessDetailService } from "../../../../../services/api/dashboard.api";

const useDashboardBusinessDetail = (businessId: string) => {
    return useQuery({
        queryKey: ["dashboard", "business-detail", businessId],
        queryFn: () => getDashboardBusinessDetailService(businessId),
        enabled: !!businessId,
    });
};

export default useDashboardBusinessDetail;
