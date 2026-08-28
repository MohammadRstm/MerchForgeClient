import { useQuery } from "@tanstack/react-query";
import { getWebsiteCustomizationCatalogueService } from "../../../../../services/api/businessDashboard.api";

/** Empty when the business hasn't been assigned a template yet — never an error. */
const useWebsiteCustomizationCatalogue = (businessId: string) => {
    return useQuery({
        queryKey: ["business-dashboard", "website-customization-catalogue", businessId],
        queryFn: () => getWebsiteCustomizationCatalogueService(businessId),
        enabled: !!businessId,
    });
};

export default useWebsiteCustomizationCatalogue;
