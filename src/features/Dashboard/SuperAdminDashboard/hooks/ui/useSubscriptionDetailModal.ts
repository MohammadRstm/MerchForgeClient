import { useState } from "react";
import useDashboardBusinessDetail from "../data/useDashboardBusinessDetail";
import useBusinessSubscriptionHistory from "../data/useBusinessSubscriptionHistory";
import useCancelBusinessSubscription from "../data/useCancelBusinessSubscription";

/** Owns which business's subscription is open in the detail modal, plus its history and the Cancel action. Change Plan is a nested flow — see useChangeSubscriptionModal. */
const useSubscriptionDetailModal = () => {
    const [businessId, setBusinessId] = useState<string | null>(null);
    const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

    const { data: business, isLoading, isError } = useDashboardBusinessDetail(businessId ?? "");
    const { data: history, isLoading: historyLoading } = useBusinessSubscriptionHistory(businessId ?? "", !!businessId);

    const { mutate: cancelSubscription, isPending: isCancelling } = useCancelBusinessSubscription(businessId ?? "");

    const open = (id: string) => setBusinessId(id);
    const close = () => {
        if (isCancelling) return;
        setBusinessId(null);
        setCancelConfirmOpen(false);
    };

    const openCancelConfirm = () => setCancelConfirmOpen(true);
    const closeCancelConfirm = () => {
        if (isCancelling) return;
        setCancelConfirmOpen(false);
    };
    const confirmCancel = () => {
        cancelSubscription(undefined, { onSuccess: () => setCancelConfirmOpen(false) });
    };

    return {
        isOpen: !!businessId,
        businessId,
        business,
        isLoading,
        isError,
        history: history ?? [],
        historyLoading,

        cancelConfirmOpen,
        isCancelling,
        open,
        close,
        openCancelConfirm,
        closeCancelConfirm,
        confirmCancel,
    };
};

export default useSubscriptionDetailModal;
