import useAuth from "../../../../context/Auth/useAuth";
import useBusinessMembers from "./data/useBusinessMembers";
import useBusinessSubscription from "./data/useBusinessSubscription";
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

    return {
        members,
        membersLoading,
        membersError,
        memberModal,

        subscription,
        subscriptionLoading,
        subscriptionError,

        featureCreditsModal,
    };
};

export default useOwnerSettingsPage;
