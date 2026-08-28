import { useQuery } from "@tanstack/react-query";
import { getWebsiteCustomizationDraftService } from "../../../../../services/api/businessDashboard.api";

/** Creates the draft on first access (a full snapshot of live Business data) if the owner has never opened this page before. */
const useWebsiteCustomizationDraft = (businessId: string) => {
    return useQuery({
        queryKey: ["business-dashboard", "website-customization-draft", businessId],
        queryFn: () => getWebsiteCustomizationDraftService(businessId),
        enabled: !!businessId,
    });
};

export default useWebsiteCustomizationDraft;
