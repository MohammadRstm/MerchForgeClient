import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revokeCustomerSessionsService } from "../../../../../services/api/dashboard.api";
import { notify } from "../../../../../services/toast";
import { ApiError } from "../../../../../Error/ApiError";

const useRevokeCustomerSessions = (customerId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => revokeCustomerSessionsService(customerId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["dashboard", "customer-detail", customerId] });
            notify.success(
                data.revokedSessionsCount > 0
                    ? `Revoked ${data.revokedSessionsCount} active session(s).`
                    : "This customer had no active sessions to revoke."
            );
        },
        onError: (error) => {
            notify.error(error instanceof ApiError ? error.message : "Failed to revoke customer sessions.");
        },
    });
};

export default useRevokeCustomerSessions;
