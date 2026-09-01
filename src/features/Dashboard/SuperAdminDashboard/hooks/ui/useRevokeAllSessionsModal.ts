import { useState } from "react";
import useRevokeAllSessions from "../data/useRevokeAllSessions";

const useRevokeAllSessionsModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { mutate: revokeAll, isPending } = useRevokeAllSessions();

    const open = () => setIsOpen(true);
    const close = () => {
        if (isPending) return;
        setIsOpen(false);
    };

    const confirm = () => {
        revokeAll(undefined, { onSuccess: () => setIsOpen(false) });
    };

    return { isOpen, isPending, open, close, confirm };
};

export default useRevokeAllSessionsModal;
