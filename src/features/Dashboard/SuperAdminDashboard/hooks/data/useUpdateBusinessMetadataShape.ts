import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBusinessMetadataShapeService } from "../../../../../services/api/dashboard.api";
import { notify } from "../../../../../services/toast";
import { ApiError } from "../../../../../Error/ApiError";
import type { UpdateMetadataShapeFieldPayload } from "../../types";

const useUpdateBusinessMetadataShape = (businessId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (fields: UpdateMetadataShapeFieldPayload[]) =>
            updateBusinessMetadataShapeService(businessId, fields),
        onSuccess: (fields) => {
            queryClient.setQueryData(["dashboard", "business-metadata-shape", businessId], fields);
            notify.success("Product field shape saved.");
        },
        onError: (error) => {
            notify.error(
                error instanceof ApiError
                    ? error.message
                    : "Failed to save the product field shape."
            );
        },
    });
};

export default useUpdateBusinessMetadataShape;
