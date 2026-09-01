import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revokeAllSessionsService } from "../../../../../services/api/dashboard.api";
import { notify } from "../../../../../services/toast";
import { ApiError } from "../../../../../Error/ApiError";

const useRevokeAllSessions = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: revokeAllSessionsService,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["dashboard", "users"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard", "security-overview"] });
            notify.success(`Revoked ${data.revokedSessionsCount} session(s) platform-wide. Your own session was left signed in.`);
        },
        onError: (error) => {
            notify.error(error instanceof ApiError ? error.message : "Failed to revoke sessions.");
        },
    });
};

export default useRevokeAllSessions;
