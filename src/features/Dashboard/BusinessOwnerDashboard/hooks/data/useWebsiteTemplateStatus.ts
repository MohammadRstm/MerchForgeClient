import { useQuery } from "@tanstack/react-query";
import { getWebsiteTemplateStatusService } from "../../../../../services/api/businessDashboard.api";

const useWebsiteTemplateStatus = (businessId: string) => {
    return useQuery({
        queryKey: ["business-dashboard", "website-template", businessId],
        queryFn: () => getWebsiteTemplateStatusService(businessId),
        enabled: !!businessId,
    });
};

export default useWebsiteTemplateStatus;
