import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revokeUserSessionsService } from "../../../../../services/api/dashboard.api";
import { notify } from "../../../../../services/toast";
import { ApiError } from "../../../../../Error/ApiError";

const useRevokeUserSessions = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: revokeUserSessionsService,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["dashboard", "users"] });

            notify.success(
                data.revokedSessionsCount > 0
                    ? `Revoked ${data.revokedSessionsCount} active session(s).`
                    : "User had no active sessions to revoke."
            );
        },
        onError: (error) => {
            notify.error(
                error instanceof ApiError
                    ? error.message
                    : "Failed to revoke user sessions."
            );
        },
    });
};

export default useRevokeUserSessions;
