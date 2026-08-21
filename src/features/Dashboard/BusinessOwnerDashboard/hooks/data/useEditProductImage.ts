import { useMutation } from "@tanstack/react-query";
import {
    editProductImageService,
    type EditProductImagePayload,
} from "../../../../../services/api/imageEditing.api";

/**
 * One edit call = one image in, one edited image out. Not tied to react-query's
 * cache with an invalidation, unlike most mutations here — there is nothing server-
 * side that reading the product form again would refresh; the result is applied
 * straight into the form's own image list by the caller.
 */
const useEditProductImage = (businessId: string) => {
    return useMutation({
        mutationFn: (payload: EditProductImagePayload) => editProductImageService(businessId, payload),
    });
};

export default useEditProductImage;
