import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    editProductImageService,
    type EditProductImagePayload,
} from "../../../../../services/api/imageEditing.api";

/**
 * One edit call = one image in, one edited image out. The result itself isn't
 * cached — it's applied straight into the form's own image list by the caller —
 * but each successful call spends an ai.image_editing credit server-side, so the
 * features query is invalidated to keep the balance shown elsewhere (the chat
 * header, the Features card) current.
 */
const useEditProductImage = (businessId: string, productId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Omit<EditProductImagePayload, "productId">) =>
            editProductImageService(businessId, { ...payload, productId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["business-dashboard", "features", businessId] });
        },
    });
};

export default useEditProductImage;
