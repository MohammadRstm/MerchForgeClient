import { useQuery } from "@tanstack/react-query";
import { getBusinessInventorySummaryService } from "../../../../../services/api/dashboard.api";

const useBusinessInventorySummary = (businessId: string) => {
    return useQuery({
        queryKey: ["dashboard", "business-inventory-summary", businessId],
        queryFn: () => getBusinessInventorySummaryService(businessId),
        enabled: !!businessId,
    });
};

export default useBusinessInventorySummary;
