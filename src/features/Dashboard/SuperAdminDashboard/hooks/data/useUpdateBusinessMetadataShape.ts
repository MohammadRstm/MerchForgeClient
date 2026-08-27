import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBusinessMetadataShapeService } from "../../../../../services/api/dashboard.api";
import type { UpdateMetadataShapeFieldPayload } from "../../types";

const useUpdateBusinessMetadataShape = (businessId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (fields: UpdateMetadataShapeFieldPayload[]) =>
            updateBusinessMetadataShapeService(businessId, fields),
        onSuccess: (fields) => {
            queryClient.setQueryData(["dashboard", "business-metadata-shape", businessId], fields);
        },
    });
};

export default useUpdateBusinessMetadataShape;
