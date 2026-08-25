import type { ProductDraft } from "../../features/Dashboard/BusinessOwnerDashboard/types";
import {
    businessProductDetailSchema,
    productDraftSchema,
} from "../../features/Dashboard/BusinessOwnerDashboard/validation";
import { authenticatedApi } from "./api";
import { apiRoutes } from "./apiRoutes";

// Every endpoint returns the whole draft, so the client always renders from one
// validated shape rather than stitching together partial updates.

export const startProductDraftService = async (businessId: string): Promise<ProductDraft> => {
    const { data } = await authenticatedApi.post(apiRoutes.PRODUCT_DRAFTS(businessId));

    return productDraftSchema.parse(data);
};

export const getProductDraftService = async (
    businessId: string,
    draftId: string
): Promise<ProductDraft> => {
    const { data } = await authenticatedApi.get(apiRoutes.PRODUCT_DRAFT(businessId, draftId));

    return productDraftSchema.parse(data);
};

export const sendProductDraftVoiceService = async (
    businessId: string,
    draftId: string,
    audio: Blob
): Promise<ProductDraft> => {
    const formData = new FormData();
    // Named so the server sees a filename with an extension it can map to a format.
    formData.append("file", audio, "message.webm");

    // Content-Type is left unset so the browser generates it with the multipart
    // boundary; setting it by hand omits the boundary and the request won't parse.
    const { data } = await authenticatedApi.post(
        apiRoutes.PRODUCT_DRAFT_VOICE(businessId, draftId),
        formData
    );

    return productDraftSchema.parse(data);
};

export const attachProductDraftImageService = async (
    businessId: string,
    draftId: string,
    file: File
): Promise<ProductDraft> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await authenticatedApi.post(
        apiRoutes.PRODUCT_DRAFT_IMAGE(businessId, draftId),
        formData
    );

    return productDraftSchema.parse(data);
};

export const resolveProductDraftImageService = async (
    businessId: string,
    draftId: string,
    approved: boolean
): Promise<ProductDraft> => {
    const { data } = await authenticatedApi.post(
        apiRoutes.PRODUCT_DRAFT_IMAGE_APPROVAL(businessId, draftId),
        { approved }
    );

    return productDraftSchema.parse(data);
};

/** Returns the created product, not the draft — this is the one call that creates. */
export const confirmProductDraftService = async (businessId: string, draftId: string) => {
    const { data } = await authenticatedApi.post(
        apiRoutes.PRODUCT_DRAFT_CONFIRM(businessId, draftId)
    );

    return businessProductDetailSchema.parse(data);
};

export const cancelProductDraftService = async (
    businessId: string,
    draftId: string
): Promise<ProductDraft> => {
    const { data } = await authenticatedApi.post(
        apiRoutes.PRODUCT_DRAFT_CANCEL(businessId, draftId)
    );

    return productDraftSchema.parse(data);
};
