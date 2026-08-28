import { useMutation, useQueryClient } from "@tanstack/react-query";
import { publishWebsiteCustomizationService } from "../../../../../services/api/businessDashboard.api";

const usePublishWebsiteCustomization = (businessId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => publishWebsiteCustomizationService(businessId),

        // The draft's LastPublishedAt moves, and any dropped key stays in the draft
        // untouched (see droppedTemplateFieldKeys) - refetch it rather than guess.
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["business-dashboard", "website-customization-draft", businessId],
            });
        },
    });
};

export default usePublishWebsiteCustomization;
