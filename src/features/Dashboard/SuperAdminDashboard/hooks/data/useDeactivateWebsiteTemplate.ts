import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deactivateWebsiteTemplateService } from "../../../../../services/api/dashboard.api";
import { notify } from "../../../../../services/toast";
import { ApiError } from "../../../../../Error/ApiError";

const useDeactivateWebsiteTemplate = (templateId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => deactivateWebsiteTemplateService(templateId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["dashboard", "website-templates"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard", "website-template", templateId] });

            notify.success(`Template "${data.label}" deleted.`);
        },
        onError: (error) => {
            notify.error(
                error instanceof ApiError
                    ? error.message
                    : "Failed to delete the template."
            );
        },
    });
};

export default useDeactivateWebsiteTemplate;
