import { useQuery } from "@tanstack/react-query";
import { getInventorySummaryService } from "../../../../../services/api/businessDashboard.api";

const useInventorySummary = (businessId: string) => {
    return useQuery({
        queryKey: ["business-dashboard", "inventory-summary", businessId],
        queryFn: () => getInventorySummaryService(businessId),
        enabled: !!businessId,
    });
};

export default useInventorySummary;
