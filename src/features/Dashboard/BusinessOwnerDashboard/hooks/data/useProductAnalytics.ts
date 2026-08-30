import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProductAnalyticsService } from "../../../../../services/api/businessDashboard.api";

/** productId scopes to one product's trend (the product-detail modal); omitted, it's the whole catalog (the Products page chart). */
const useProductAnalytics = (businessId: string, from: string, to: string, productId?: string) => {
    return useQuery({
        queryKey: ["business-dashboard", "product-analytics", businessId, from, to, productId],
        queryFn: () => getProductAnalyticsService(businessId, from, to, productId),
        enabled: !!businessId && !!from && !!to,
        placeholderData: keepPreviousData,
    });
};

export default useProductAnalytics;
