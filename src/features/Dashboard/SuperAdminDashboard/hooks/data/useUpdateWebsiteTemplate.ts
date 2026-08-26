import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWebsiteTemplateService } from "../../../../../services/api/dashboard.api";
import { notify } from "../../../../../services/toast";
import { ApiError } from "../../../../../Error/ApiError";
import type { UpdateWebsiteTemplatePayload } from "../../types";

const useUpdateWebsiteTemplate = (templateId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateWebsiteTemplatePayload) => updateWebsiteTemplateService(templateId, payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["dashboard", "website-templates"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard", "website-template", templateId] });

            notify.success(`Template "${data.label}" updated.`);
        },
        onError: (error) => {
            notify.error(
                error instanceof ApiError
                    ? error.message
                    : "Failed to update the template."
            );
        },
    });
};

export default useUpdateWebsiteTemplate;
