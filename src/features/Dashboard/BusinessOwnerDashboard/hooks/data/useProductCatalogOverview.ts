import { useQuery } from "@tanstack/react-query";
import { getProductCatalogOverviewService } from "../../../../../services/api/businessDashboard.api";

const useProductCatalogOverview = (businessId: string) => {
    return useQuery({
        queryKey: ["business-dashboard", "product-catalog-overview", businessId],
        queryFn: () => getProductCatalogOverviewService(businessId),
        enabled: !!businessId,
    });
};

export default useProductCatalogOverview;
