import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disableUserService } from "../../../../../services/api/dashboard.api";
import { notify } from "../../../../../services/toast";
import { ApiError } from "../../../../../Error/ApiError";

const useDisableUser = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => disableUserService(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboard", "users"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard", "user-detail", userId] });
            queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
            notify.success("Account disabled.");
        },
        onError: (error) => {
            notify.error(error instanceof ApiError ? error.message : "Failed to disable account.");
        },
    });
};

export default useDisableUser;
