import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revokeBusinessSessionsService } from "../../../../../services/api/dashboard.api";

const useRevokeBusinessSessions = (businessId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => revokeBusinessSessionsService(businessId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboard", "users"] });
        },
    });
};

export default useRevokeBusinessSessions;
