import { useState } from "react";
import useBusinessFeatures from "../data/useBusinessFeatures";
import usePurchaseFeatureCredits from "../data/usePurchaseFeatureCredits";
import { ApiError } from "../../../../../Error/ApiError";

/**
 * Drives both the Features card (the grid of "Add credits" / "Subscribe" buttons)
 * and the package picker modal one of them opens. Status always comes from the
 * server rather than local state, the same reasoning as useWebsiteTemplateModal: a
 * purchase made from another tab shows up here on the next fetch.
 */
const useFeatureCreditsModal = (businessId: string) => {
    const [activeFeatureKey, setActiveFeatureKey] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { data: features, isLoading, isError } = useBusinessFeatures(businessId);
    const { mutate, isPending, variables: pendingPackageId, reset } = usePurchaseFeatureCredits(businessId);

    const activeFeature = features?.find((f) => f.featureKey === activeFeatureKey) ?? null;

    const open = (featureKey: string) => {
        setActiveFeatureKey(featureKey);
        setError(null);
        reset();
    };

    const close = () => {
        if (isPending) {
            return;
        }

        setActiveFeatureKey(null);
    };

    const purchase = (packageId: string) => {
        setError(null);

        mutate(packageId, {
            onSuccess: () => setActiveFeatureKey(null),
            onError: (err) => {
                setError(err instanceof ApiError ? err.message : "Couldn't complete the purchase. Please try again.");
            },
        });
    };

    return {
        features,
        isLoading,
        isError,

        isOpen: activeFeatureKey != null,
        activeFeature,
        error,
        // Cleared as soon as the mutation settles, not just when a new one starts -
        // react-query keeps `variables` around after success/error.
        purchasingPackageId: isPending ? pendingPackageId : undefined,

        open,
        close,
        purchase,
    };
};

export default useFeatureCreditsModal;
