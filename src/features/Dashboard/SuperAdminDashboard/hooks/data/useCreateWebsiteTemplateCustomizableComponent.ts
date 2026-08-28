import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWebsiteTemplateCustomizableComponentService } from "../../../../../services/api/dashboard.api";
import type { CreateWebsiteTemplateCustomizableComponentPayload } from "../../types";

const useCreateWebsiteTemplateCustomizableComponent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            websiteTemplateId,
            payload,
        }: {
            websiteTemplateId: string;
            payload: CreateWebsiteTemplateCustomizableComponentPayload;
        }) => createWebsiteTemplateCustomizableComponentService(websiteTemplateId, payload),

        onSuccess: (_data, { websiteTemplateId }) => {
            queryClient.invalidateQueries({
                queryKey: ["dashboard", "website-template-customizable-components", websiteTemplateId],
            });
        },
    });
};

export default useCreateWebsiteTemplateCustomizableComponent;
