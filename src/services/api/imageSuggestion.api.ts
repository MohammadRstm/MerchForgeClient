import type { ProductDraftProduct } from "../../features/Dashboard/BusinessOwnerDashboard/types";
import { productDraftProductSchema } from "../../features/Dashboard/BusinessOwnerDashboard/validation";
import { authenticatedApi } from "./api";
import { apiRoutes } from "./apiRoutes";

export type SuggestProductDetailsPayload = {
    /** A url a prior upload already returned — never a fresh file, the server re-reads it from its own storage. */
    imageUrl: string;
};

/**
 * Looks at one product photo and returns a best-effort draft of this business's
 * product fields, in the exact same shape the voice "fill with AI" flow already
 * produces — every field the AI couldn't determine from the photo comes back null.
 */
export const suggestProductDetailsService = async (
    businessId: string,
    payload: SuggestProductDetailsPayload
): Promise<ProductDraftProduct> => {
    const { data } = await authenticatedApi.post(apiRoutes.IMAGE_SUGGESTIONS(businessId), payload);

    return productDraftProductSchema.parse(data);
};
