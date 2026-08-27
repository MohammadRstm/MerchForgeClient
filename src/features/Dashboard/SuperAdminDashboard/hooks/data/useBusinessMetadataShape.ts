import { useQuery } from "@tanstack/react-query";
import { getBusinessMetadataShapeService } from "../../../../../services/api/dashboard.api";

const useBusinessMetadataShape = (businessId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ["dashboard", "business-metadata-shape", businessId],
        queryFn: () => getBusinessMetadataShapeService(businessId),
        enabled: !!businessId && enabled,
    });
};

export default useBusinessMetadataShape;
