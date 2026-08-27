import { useQuery } from "@tanstack/react-query";
import { getStockMovementsService } from "../../../../../services/api/businessDashboard.api";

const useStockMovements = (businessId: string, take = 20) => {
    return useQuery({
        queryKey: ["business-dashboard", "stock-movements", businessId, take],
        queryFn: () => getStockMovementsService(businessId, take),
        enabled: !!businessId,
    });
};

export default useStockMovements;
