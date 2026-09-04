import type { ImageEditJob } from "../../features/Dashboard/BusinessOwnerDashboard/types";
import { imageEditJobSchema } from "../../features/Dashboard/BusinessOwnerDashboard/validation";
import { authenticatedApi } from "./api";
import { apiRoutes } from "./apiRoutes";

export type EditProductImagePayload = {
    /** A url a prior upload already returned — never a fresh file, the server re-reads it from its own storage. */
    imageUrl: string;
    /** The product the edited result belongs to, so it is stored alongside its inputs. */
    productId: string;
    /** Exactly one of prompt/audio is expected. */
    prompt?: string;
    audio?: Blob;
};

export const editProductImageService = async (
    businessId: string,
    payload: EditProductImagePayload
): Promise<ImageEditJob> => {
    const formData = new FormData();
    formData.append("imageUrls", payload.imageUrl);
    formData.append("productId", payload.productId);

    if (payload.prompt) {
        formData.append("prompt", payload.prompt);
    }

    if (payload.audio) {
        // Named so the server sees a filename with an extension it can map to a format.
        formData.append("audioPrompt", payload.audio, "instruction.webm");
    }

    const { data } = await authenticatedApi.post(apiRoutes.IMAGE_EDITS(businessId), formData);

    return imageEditJobSchema.parse(data);
};
