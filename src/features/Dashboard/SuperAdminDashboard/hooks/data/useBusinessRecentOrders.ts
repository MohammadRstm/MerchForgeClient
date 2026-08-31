import { useQuery } from "@tanstack/react-query";
import { getBusinessRecentOrdersService } from "../../../../../services/api/dashboard.api";

const useBusinessRecentOrders = (businessId: string, pageSize = 10) => {
    return useQuery({
        queryKey: ["dashboard", "business-recent-orders", businessId, pageSize],
        queryFn: () => getBusinessRecentOrdersService(businessId, pageSize),
        enabled: !!businessId,
    });
};

export default useBusinessRecentOrders;
