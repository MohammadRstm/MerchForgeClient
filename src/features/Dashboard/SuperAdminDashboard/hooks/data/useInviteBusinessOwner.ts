import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBusinessOwnerInvitationService } from "../../../../../services/api/invitation.api";
import { notify } from "../../../../../services/toast";
import { ApiError } from "../../../../../Error/ApiError";

const useInviteBusinessOwner = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createBusinessOwnerInvitationService,
        onSuccess: (data) => {
            // The invitation counts toward pendingInvitations on the stats card.
            queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });

            notify.success(`Invitation sent to ${data.email}.`);
        },
        onError: (error) => {
            notify.error(
                error instanceof ApiError
                    ? error.message
                    : "Failed to send the invitation."
            );
        },
    });
};

export default useInviteBusinessOwner;
