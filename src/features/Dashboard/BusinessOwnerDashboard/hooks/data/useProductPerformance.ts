import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProductPerformanceService } from "../../../../../services/api/businessDashboard.api";

/** One bounded (catalog-sized) fetch that powers top products, revenue distribution, best sellers, needs-attention, zero-sales, and category performance — all derived from this same list client-side. */
const useProductPerformance = (businessId: string, from: string, to: string) => {
    return useQuery({
        queryKey: ["business-dashboard", "product-performance", businessId, from, to],
        queryFn: () => getProductPerformanceService(businessId, from, to),
        enabled: !!businessId && !!from && !!to,
        placeholderData: keepPreviousData,
    });
};

export default useProductPerformance;
