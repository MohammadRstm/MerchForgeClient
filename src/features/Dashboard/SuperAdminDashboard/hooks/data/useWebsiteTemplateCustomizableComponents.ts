import { useQuery } from "@tanstack/react-query";
import { getWebsiteTemplateCustomizableComponentsService } from "../../../../../services/api/dashboard.api";

/** Every row for the template, active and inactive alike — the detail modal shows both, badged by status. */
const useWebsiteTemplateCustomizableComponents = (websiteTemplateId: string | null) => {
    return useQuery({
        queryKey: ["dashboard", "website-template-customizable-components", websiteTemplateId],
        queryFn: () => getWebsiteTemplateCustomizableComponentsService(websiteTemplateId!),
        enabled: !!websiteTemplateId,
    });
};

export default useWebsiteTemplateCustomizableComponents;
