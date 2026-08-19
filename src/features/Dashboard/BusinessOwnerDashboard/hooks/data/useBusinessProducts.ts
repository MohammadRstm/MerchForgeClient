import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getBusinessProductsService } from "../../../../../services/api/businessDashboard.api";
import type { ProductsQueryParams } from "../../types";

const useBusinessProducts = (businessId: string, query: ProductsQueryParams) => {
    return useQuery({
        queryKey: ["business-dashboard", "products", businessId, query],
        queryFn: () => getBusinessProductsService(businessId, query),
        enabled: !!businessId,
        placeholderData: keepPreviousData,
    });
};

export default useBusinessProducts;
