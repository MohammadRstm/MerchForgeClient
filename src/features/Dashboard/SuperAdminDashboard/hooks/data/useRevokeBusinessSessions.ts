import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revokeBusinessSessionsService } from "../../../../../services/api/dashboard.api";
import { notify } from "../../../../../services/toast";
import { ApiError } from "../../../../../Error/ApiError";

const useRevokeBusinessSessions = (businessId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => revokeBusinessSessionsService(businessId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["dashboard", "users"] });

            notify.success(
                data.revokedSessionsCount > 0
                    ? `Revoked ${data.revokedSessionsCount} active session(s).`
                    : "This business had no active sessions to revoke."
            );
        },
        onError: (error) => {
            notify.error(
                error instanceof ApiError
                    ? error.message
                    : "Failed to revoke this business's sessions."
            );
        },
    });
};

export default useRevokeBusinessSessions;
