import { useQuery } from "@tanstack/react-query";
import { getStockMovementsService } from "../../../../../services/api/businessDashboard.api";

const useStockMovements = (businessId: string, take = 20, productId?: string) => {
    return useQuery({
        queryKey: ["business-dashboard", "stock-movements", businessId, take, productId],
        queryFn: () => getStockMovementsService(businessId, take, productId),
        enabled: !!businessId,
    });
};

export default useStockMovements;
