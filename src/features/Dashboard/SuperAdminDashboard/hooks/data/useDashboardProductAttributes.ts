import { useQuery } from "@tanstack/react-query";
import { getDashboardProductAttributesService } from "../../../../../services/api/dashboard.api";

const useDashboardProductAttributes = (businessDomainId?: string) => {
    return useQuery({
        queryKey: ["dashboard", "product-attributes", businessDomainId ?? "all"],
        queryFn: () => getDashboardProductAttributesService(businessDomainId),
    });
};

export default useDashboardProductAttributes;
