import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getBusinessProductPerformanceService } from "../../../../../services/api/dashboard.api";

const useBusinessProductPerformance = (businessId: string, from: string, to: string) => {
    return useQuery({
        queryKey: ["dashboard", "business-product-performance", businessId, from, to],
        queryFn: () => getBusinessProductPerformanceService(businessId, from, to),
        enabled: !!businessId && !!from && !!to,
        placeholderData: keepPreviousData,
    });
};

export default useBusinessProductPerformance;
