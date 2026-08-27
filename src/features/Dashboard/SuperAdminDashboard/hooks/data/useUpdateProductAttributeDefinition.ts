import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductAttributeDefinitionService } from "../../../../../services/api/dashboard.api";
import type { UpdateProductAttributeDefinitionPayload } from "../../types";

const useUpdateProductAttributeDefinition = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateProductAttributeDefinitionPayload }) =>
            updateProductAttributeDefinitionService(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboard", "product-attributes"] });
        },
    });
};

export default useUpdateProductAttributeDefinition;
