import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWebsiteTemplateRequestService } from "../../../../../services/api/businessDashboard.api";

const useCreateWebsiteTemplateRequest = (businessId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ websiteTemplateId, customizationNotes }: { websiteTemplateId: string; customizationNotes: string }) =>
            createWebsiteTemplateRequestService(businessId, websiteTemplateId, customizationNotes),

        onSuccess: () => {
            // Re-fetches with `hasOpenRequest` now true, which is what hides the
            // template grid and switches the dashboard button's label.
            queryClient.invalidateQueries({ queryKey: ["business-dashboard", "website-template-options", businessId] });
        },
    });
};

export default useCreateWebsiteTemplateRequest;
