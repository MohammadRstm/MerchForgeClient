import { useMutation, useQueryClient } from "@tanstack/react-query";
import { regenerateWebsiteCustomizationPreviewTokenService } from "../../../../../services/api/businessDashboard.api";

const useRegenerateWebsiteCustomizationPreviewToken = (businessId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => regenerateWebsiteCustomizationPreviewTokenService(businessId),

        onSuccess: ({ previewToken }) => {
            queryClient.setQueryData(
                ["business-dashboard", "website-customization-draft", businessId],
                (draft: { previewToken: string } | undefined) =>
                    draft ? { ...draft, previewToken } : draft
            );
        },
    });
};

export default useRegenerateWebsiteCustomizationPreviewToken;
