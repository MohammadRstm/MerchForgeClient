import { useMutation } from "@tanstack/react-query";
import { acceptInvitationService } from "../../../../../services/api/auth.api";

const useAcceptInvitation = () => {
    return useMutation({
        mutationFn: acceptInvitationService,
    });
};

export default useAcceptInvitation;
