import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    deactivateWebsiteTemplateCustomizableComponentService,
    reactivateWebsiteTemplateCustomizableComponentService,
} from "../../../../../services/api/dashboard.api";

const useSetWebsiteTemplateCustomizableComponentActive = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            websiteTemplateId,
            id,
            isActive,
        }: {
            websiteTemplateId: string;
            id: string;
            isActive: boolean;
        }) =>
            isActive
                ? reactivateWebsiteTemplateCustomizableComponentService(websiteTemplateId, id)
                : deactivateWebsiteTemplateCustomizableComponentService(websiteTemplateId, id),

        onSuccess: (_data, { websiteTemplateId }) => {
            queryClient.invalidateQueries({
                queryKey: ["dashboard", "website-template-customizable-components", websiteTemplateId],
            });
        },
    });
};

export default useSetWebsiteTemplateCustomizableComponentActive;
