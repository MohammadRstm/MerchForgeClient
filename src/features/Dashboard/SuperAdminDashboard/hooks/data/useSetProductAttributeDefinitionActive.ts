import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    deactivateProductAttributeDefinitionService,
    reactivateProductAttributeDefinitionService,
} from "../../../../../services/api/dashboard.api";

const useSetProductAttributeDefinitionActive = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
            isActive
                ? reactivateProductAttributeDefinitionService(id)
                : deactivateProductAttributeDefinitionService(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboard", "product-attributes"] });
        },
    });
};

export default useSetProductAttributeDefinitionActive;
