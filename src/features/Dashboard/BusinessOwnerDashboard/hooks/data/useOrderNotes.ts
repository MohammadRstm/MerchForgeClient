import { useQuery } from "@tanstack/react-query";
import { getOrderNotesService } from "../../../../../services/api/businessDashboard.api";

const useOrderNotes = (businessId: string, orderId: string | undefined) => {
    return useQuery({
        queryKey: ["business-dashboard", "order-notes", businessId, orderId],
        queryFn: () => getOrderNotesService(businessId, orderId!),
        enabled: !!businessId && !!orderId,
    });
};

export default useOrderNotes;
