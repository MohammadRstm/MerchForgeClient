import { useState } from "react";
import useDashboardUserDetail from "../data/useDashboardUserDetail";
import useRevokeUserSessions from "../data/useRevokeUserSessions";
import useDisableUser from "../data/useDisableUser";
import useEnableUser from "../data/useEnableUser";

/**
 * Owns which user is open in the detail drawer, plus its two destructive
 * sub-confirmations (disable, force logout). Self-disable is blocked
 * server-side too (CannotDisableOwnAccountException) - isSelf here is only
 * for hiding the button, not the actual safety boundary.
 */
const useUserDetailModal = (currentUserId: string) => {
    const [userId, setUserId] = useState<string | null>(null);
    const [disableConfirmOpen, setDisableConfirmOpen] = useState(false);
    const [revokeConfirmOpen, setRevokeConfirmOpen] = useState(false);

    const { data: user, isLoading, isError } = useDashboardUserDetail(userId ?? "");
    const { mutate: revokeSessions, isPending: isRevoking } = useRevokeUserSessions();
    const { mutate: disableUser, isPending: isDisabling } = useDisableUser(userId ?? "");
    const { mutate: enableUser, isPending: isEnabling } = useEnableUser(userId ?? "");

    const isBusy = isRevoking || isDisabling || isEnabling;

    const open = (id: string) => setUserId(id);

    const close = () => {
        if (isBusy) return;
        setUserId(null);
        setDisableConfirmOpen(false);
        setRevokeConfirmOpen(false);
    };

    const openDisableConfirm = () => setDisableConfirmOpen(true);
    const closeDisableConfirm = () => {
        if (isDisabling) return;
        setDisableConfirmOpen(false);
    };
    const confirmDisable = () => {
        disableUser(undefined, { onSuccess: () => setDisableConfirmOpen(false) });
    };

    const handleEnable = () => enableUser();

    const openRevokeConfirm = () => setRevokeConfirmOpen(true);
    const closeRevokeConfirm = () => {
        if (isRevoking) return;
        setRevokeConfirmOpen(false);
    };
    const confirmRevoke = () => {
        if (!userId) return;
        revokeSessions(userId, { onSettled: () => setRevokeConfirmOpen(false) });
    };

    return {
        isOpen: !!userId,
        userId,
        user,
        isLoading,
        isError,
        isSelf: !!userId && userId === currentUserId,

        disableConfirmOpen,
        revokeConfirmOpen,
        isDisabling,
        isEnabling,
        isRevoking,

        open,
        close,
        openDisableConfirm,
        closeDisableConfirm,
        confirmDisable,
        handleEnable,
        openRevokeConfirm,
        closeRevokeConfirm,
        confirmRevoke,
    };
};

export default useUserDetailModal;
