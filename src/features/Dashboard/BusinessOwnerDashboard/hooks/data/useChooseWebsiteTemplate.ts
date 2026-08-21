import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chooseWebsiteTemplateService } from "../../../../../services/api/businessDashboard.api";

const useChooseWebsiteTemplate = (businessId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (websiteTemplateId: string) => chooseWebsiteTemplateService(businessId, websiteTemplateId),

        onSuccess: () => {
            // Re-fetches with `chosen` now set, which is what hides the
            // choose-a-template button/grid — there's no separate flag to flip.
            queryClient.invalidateQueries({ queryKey: ["business-dashboard", "website-template", businessId] });
        },
    });
};

export default useChooseWebsiteTemplate;
