import { useQuery } from "@tanstack/react-query";
import { getBusinessFeaturesService } from "../../../../../services/api/businessDashboard.api";

const useBusinessFeatures = (businessId: string) => {
    return useQuery({
        queryKey: ["business-dashboard", "features", businessId],
        queryFn: () => getBusinessFeaturesService(businessId),
        enabled: !!businessId,
    });
};

export default useBusinessFeatures;
