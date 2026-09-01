import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reactivateWebsiteTemplateService } from "../../../../../services/api/dashboard.api";
import { notify } from "../../../../../services/toast";
import { ApiError } from "../../../../../Error/ApiError";

const useReactivateWebsiteTemplate = (templateId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => reactivateWebsiteTemplateService(templateId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["dashboard", "website-templates"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard", "website-template", templateId] });

            notify.success(`Template "${data.label}" reactivated.`);
        },
        onError: (error) => {
            notify.error(
                error instanceof ApiError
                    ? error.message
                    : "Failed to reactivate the template."
            );
        },
    });
};

export default useReactivateWebsiteTemplate;
