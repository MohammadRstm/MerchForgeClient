import { useQuery } from "@tanstack/react-query";
import { getProductFormService } from "../../../../../services/api/businessDashboard.api";

/**
 * Categories and optional fields the product form needs. Fetched only once the
 * modal is opened, since it is not needed to render the dashboard itself.
 */
const useProductForm = (businessId: string, enabled: boolean) => {
    return useQuery({
        queryKey: ["business-dashboard", "product-form", businessId],
        queryFn: () => getProductFormService(businessId),
        enabled: Boolean(businessId) && enabled,
        // Changes only when the business's categories or opted-in fields change,
        // neither of which happens while a product modal is open.
        staleTime: 5 * 60 * 1000,
    });
};

export default useProductForm;
