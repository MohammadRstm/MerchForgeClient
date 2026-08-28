import useBusinessSubscription from "./useBusinessSubscription";

/**
 * Whether this business's current plan includes an unlimited (non-metered)
 * feature — e.g. ai.product_generation or website_customization.advanced,
 * neither of which supports standalone credit purchase, so
 * useFeatureCreditBalance/useBusinessFeatures (scoped to purchasable features
 * only) would never surface them. Reads off useBusinessSubscription instead,
 * which is already fetched on dashboard mount.
 *
 * The subscription.status check matters and isn't redundant:
 * useBusinessSubscription intentionally returns the business's *latest*
 * subscription regardless of status (so a lapsed plan's name can still be
 * shown), so its `features` list stays populated even once Cancelled/
 * PastDue/Expired — reading it as "what I currently have" without this check
 * would treat a churned business as still entitled.
 */
const useHasPlanFeature = (businessId: string, featureKey: string) => {
    const { data: subscription, isLoading } = useBusinessSubscription(businessId);

    const hasFeature =
        subscription?.status === "Active" &&
        (subscription.features.some((f) => f.featureKey === featureKey) ?? false);

    return { hasFeature, isLoading };
};

export default useHasPlanFeature;
