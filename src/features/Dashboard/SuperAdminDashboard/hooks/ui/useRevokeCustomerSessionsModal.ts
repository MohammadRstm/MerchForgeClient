import { useState } from "react";
import useRevokeCustomerSessions from "../data/useRevokeCustomerSessions";

const useRevokeCustomerSessionsModal = (customerId: string) => {
    const [isOpen, setIsOpen] = useState(false);
    const { mutate: revokeSessions, isPending } = useRevokeCustomerSessions(customerId);

    const open = () => setIsOpen(true);
    const close = () => {
        if (isPending) return;
        setIsOpen(false);
    };

    const confirm = () => {
        revokeSessions(undefined, { onSuccess: () => setIsOpen(false) });
    };

    return { isOpen, isPending, open, close, confirm };
};

export default useRevokeCustomerSessionsModal;
