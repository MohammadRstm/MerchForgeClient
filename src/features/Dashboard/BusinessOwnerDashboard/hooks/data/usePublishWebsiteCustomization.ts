import { useMutation, useQueryClient } from "@tanstack/react-query";
import { publishWebsiteCustomizationService } from "../../../../../services/api/businessDashboard.api";
import { notify } from "../../../../../services/toast";
import { DURATIONS } from "../../../../../services/toast/constants";

const usePublishWebsiteCustomization = (businessId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => publishWebsiteCustomizationService(businessId),

        // The draft's LastPublishedAt moves, and any dropped key stays in the draft
        // untouched (see droppedTemplateFieldKeys) - refetch it rather than guess.
        onSuccess: (result) => {
            queryClient.invalidateQueries({
                queryKey: ["business-dashboard", "website-customization-draft", businessId],
            });

            if (result.droppedTemplateFieldKeys.length > 0) {
                // Worth reading, not just a fire-and-forget confirmation - a longer
                // duration than the plain success case.
                notify.warning(
                    `Published. These fields are no longer supported by your template and weren't published: ${result.droppedTemplateFieldKeys.join(", ")}.`,
                    DURATIONS.long
                );
            } else {
                notify.success("Published.", 3000);
            }
        },
    });
};

export default usePublishWebsiteCustomization;
