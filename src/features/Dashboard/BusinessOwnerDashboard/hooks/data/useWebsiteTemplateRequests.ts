import { useQuery } from "@tanstack/react-query";
import { getWebsiteTemplateRequestsService } from "../../../../../services/api/businessDashboard.api";

// First real UI consumer of this endpoint — it existed already (created alongside
// the request-submission flow) but no page ever rendered the history it returns.
const useWebsiteTemplateRequests = (businessId: string) => {
    return useQuery({
        queryKey: ["business-dashboard", "website-template-requests", businessId],
        queryFn: () => getWebsiteTemplateRequestsService(businessId),
        enabled: !!businessId,
    });
};

export default useWebsiteTemplateRequests;
