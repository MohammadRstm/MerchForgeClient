import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProductAttributeDefinitionService } from "../../../../../services/api/dashboard.api";

const useCreateProductAttributeDefinition = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProductAttributeDefinitionService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboard", "product-attributes"] });
        },
    });
};

export default useCreateProductAttributeDefinition;
