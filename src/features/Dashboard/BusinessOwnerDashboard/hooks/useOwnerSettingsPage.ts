import { useState } from "react";
import useAuth from "../../../../context/Auth/useAuth";
import useBusinessMembers from "./data/useBusinessMembers";
import useBusinessSubscription from "./data/useBusinessSubscription";
import useCancelSubscription from "./data/useCancelSubscription";
import useMemberModal from "./ui/useMemberModal";
import useFeatureCreditsModal from "./ui/useFeatureCreditsModal";

const useOwnerSettingsPage = () => {
    const { session } = useAuth();
    const businessId = session?.business?.id ?? "";

    const {
        data: members,
        isLoading: membersLoading,
        isError: membersError,
    } = useBusinessMembers(businessId);

    const {
        data: subscription,
        isLoading: subscriptionLoading,
        isError: subscriptionError,
    } = useBusinessSubscription(businessId);

    const memberModal = useMemberModal(businessId);
    const featureCreditsModal = useFeatureCreditsModal(businessId);

    const [confirmingCancel, setConfirmingCancel] = useState(false);
    const { mutate: cancelMutate, isPending: isCancelling } = useCancelSubscription(businessId);

    const requestCancel = () => setConfirmingCancel(true);
    const cancelCancel = () => setConfirmingCancel(false);
    const confirmCancel = () => cancelMutate(undefined, { onSuccess: () => setConfirmingCancel(false) });

    return {
        members,
        membersLoading,
        membersError,
        memberModal,

        subscription,
        subscriptionLoading,
        subscriptionError,

        featureCreditsModal,

        confirmingCancel,
        requestCancel,
        cancelCancel,
        confirmCancel,
        isCancelling,
    };
};

export default useOwnerSettingsPage;
