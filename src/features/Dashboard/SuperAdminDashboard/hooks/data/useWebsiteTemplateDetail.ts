import { useQuery } from "@tanstack/react-query";
import { getWebsiteTemplateDetailService } from "../../../../../services/api/dashboard.api";

const useWebsiteTemplateDetail = (templateId: string | null) => {
    return useQuery({
        queryKey: ["dashboard", "website-template", templateId],
        queryFn: () => getWebsiteTemplateDetailService(templateId!),
        enabled: !!templateId,
    });
};

export default useWebsiteTemplateDetail;
