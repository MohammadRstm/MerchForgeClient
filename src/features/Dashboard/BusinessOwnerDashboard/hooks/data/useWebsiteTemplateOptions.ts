import { useQuery } from "@tanstack/react-query";
import { getWebsiteTemplateOptionsService } from "../../../../../services/api/businessDashboard.api";

const useWebsiteTemplateOptions = (businessId: string) => {
    return useQuery({
        queryKey: ["business-dashboard", "website-template-options", businessId],
        queryFn: () => getWebsiteTemplateOptionsService(businessId),
        enabled: !!businessId,
    });
};

export default useWebsiteTemplateOptions;
