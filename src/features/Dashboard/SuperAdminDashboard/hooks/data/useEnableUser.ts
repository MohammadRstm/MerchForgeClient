import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enableUserService } from "../../../../../services/api/dashboard.api";
import { notify } from "../../../../../services/toast";
import { ApiError } from "../../../../../Error/ApiError";

const useEnableUser = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => enableUserService(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboard", "users"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard", "user-detail", userId] });
            queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
            notify.success("Account re-enabled.");
        },
        onError: (error) => {
            notify.error(error instanceof ApiError ? error.message : "Failed to enable account.");
        },
    });
};

export default useEnableUser;
