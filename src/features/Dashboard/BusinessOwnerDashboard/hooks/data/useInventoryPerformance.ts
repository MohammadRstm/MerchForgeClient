import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getInventoryPerformanceService } from "../../../../../services/api/businessDashboard.api";

/** One bounded (catalog-sized) fetch that powers fast-movers, dead/slow stock, risk categorization, and category inventory analytics — all derived from this same list client-side. */
const useInventoryPerformance = (businessId: string, from: string, to: string) => {
    return useQuery({
        queryKey: ["business-dashboard", "inventory-performance", businessId, from, to],
        queryFn: () => getInventoryPerformanceService(businessId, from, to),
        enabled: !!businessId && !!from && !!to,
        placeholderData: keepPreviousData,
    });
};

export default useInventoryPerformance;
