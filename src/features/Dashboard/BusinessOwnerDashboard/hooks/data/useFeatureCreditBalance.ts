import useBusinessFeatures from "./useBusinessFeatures";

/**
 * One feature's live balance, read out of the same overview the Features card
 * shows — not a separate endpoint. "Live" here means the chats invalidate this
 * query after every call that could spend a credit, so this hook picking up the
 * refetch is what keeps the number in the chat header current without polling.
 */
const useFeatureCreditBalance = (businessId: string, featureKey: string) => {
    const { data: features } = useBusinessFeatures(businessId);
    const feature = features?.find((f) => f.featureKey === featureKey);

    return {
        creditsRemaining: feature?.creditsRemaining,
        creditsGrantedTotal: feature?.creditsGrantedTotal,
        includedInPlan: feature?.includedInPlan ?? false,
    };
};

export default useFeatureCreditBalance;
