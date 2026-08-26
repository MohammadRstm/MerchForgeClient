import { useQuery } from "@tanstack/react-query";
import { getDashboardWebsiteTemplateRequestService } from "../../../../../services/api/dashboard.api";

const useWebsiteTemplateRequestDetail = (requestId: string | null) => {
    return useQuery({
        queryKey: ["dashboard", "website-template-request", requestId],
        queryFn: () => getDashboardWebsiteTemplateRequestService(requestId!),
        enabled: !!requestId,
    });
};

export default useWebsiteTemplateRequestDetail;
