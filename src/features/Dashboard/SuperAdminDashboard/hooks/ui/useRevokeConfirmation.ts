import { useState } from "react";
import useRevokeUserSessions from "../data/useRevokeUserSessions";
import type { DashboardUserResponse } from "../../types";

const useRevokeConfirmation = () => {
    const [pendingUser, setPendingUser] = useState<DashboardUserResponse | null>(null);

    const {
        mutate: revokeSessions,
        isPending: revokePending,
    } = useRevokeUserSessions();

    const requestRevoke = (user: DashboardUserResponse) => setPendingUser(user);

    const cancelRevoke = () => setPendingUser(null);

    const confirmRevoke = () => {
        if (!pendingUser) return;

        revokeSessions(pendingUser.id, {
            onSettled: () => setPendingUser(null),
        });
    };

    return {
        pendingUser,
        revokePending,

        requestRevoke,
        cancelRevoke,
        confirmRevoke,
    };
};

export default useRevokeConfirmation;
