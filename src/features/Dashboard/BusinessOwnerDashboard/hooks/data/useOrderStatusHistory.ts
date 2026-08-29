import { useQuery } from "@tanstack/react-query";
import { getOrderStatusHistoryService } from "../../../../../services/api/businessDashboard.api";

const useOrderStatusHistory = (businessId: string, orderId: string | undefined) => {
    return useQuery({
        queryKey: ["business-dashboard", "order-status-history", businessId, orderId],
        queryFn: () => getOrderStatusHistoryService(businessId, orderId!),
        enabled: !!businessId && !!orderId,
    });
};

export default useOrderStatusHistory;
