import { useMutation } from "@tanstack/react-query";
import { acceptMemberInvitationService } from "../../../../../services/api/auth.api";

const useAcceptMemberInvitation = () => {
    return useMutation({
        mutationFn: acceptMemberInvitationService,
    });
};

export default useAcceptMemberInvitation;
