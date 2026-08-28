import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    saveWebsiteCustomizationDraftService,
    type SaveWebsiteCustomizationDraftPayload,
} from "../../../../../services/api/businessDashboard.api";

const useSaveWebsiteCustomizationDraft = (businessId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: SaveWebsiteCustomizationDraftPayload) =>
            saveWebsiteCustomizationDraftService(businessId, payload),

        onSuccess: (draft) => {
            queryClient.setQueryData(["business-dashboard", "website-customization-draft", businessId], draft);
        },
    });
};

export default useSaveWebsiteCustomizationDraft;
