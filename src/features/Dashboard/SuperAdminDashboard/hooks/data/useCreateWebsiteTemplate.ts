import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWebsiteTemplateService } from "../../../../../services/api/dashboard.api";
import { notify } from "../../../../../services/toast";
import { ApiError } from "../../../../../Error/ApiError";

const useCreateWebsiteTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createWebsiteTemplateService,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["dashboard", "website-templates"] });

            notify.success(`Template "${data.label}" added.`);
        },
        onError: (error) => {
            notify.error(
                error instanceof ApiError
                    ? error.message
                    : "Failed to add the template."
            );
        },
    });
};

export default useCreateWebsiteTemplate;
