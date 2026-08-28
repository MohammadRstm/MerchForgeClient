import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getBusinessOrdersService } from "../../../../../services/api/businessDashboard.api";
import type { OrdersQueryParams } from "../../types";

const useBusinessOrders = (businessId: string, query: OrdersQueryParams) => {
    return useQuery({
        queryKey: ["business-dashboard", "orders", businessId, query],
        queryFn: () => getBusinessOrdersService(businessId, query),
        enabled: !!businessId,
        placeholderData: keepPreviousData,
    });
};

export default useBusinessOrders;
