import { useQuery } from "@tanstack/react-query";
import { getBusinessOrderService } from "../../../../../services/api/businessDashboard.api";

const useBusinessOrder = (businessId: string, orderId: string | undefined) => {
    return useQuery({
        queryKey: ["business-dashboard", "order", businessId, orderId],
        queryFn: () => getBusinessOrderService(businessId, orderId!),
        enabled: !!businessId && !!orderId,
    });
};

export default useBusinessOrder;
