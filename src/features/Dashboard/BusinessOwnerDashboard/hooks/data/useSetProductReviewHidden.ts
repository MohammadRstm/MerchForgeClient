import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setProductReviewHiddenService } from "../../../../../services/api/businessDashboard.api";
import { notify } from "../../../../../services/toast";
import { ApiError } from "../../../../../Error/ApiError";

type SetReviewHiddenVariables = { reviewId: string; isHidden: boolean };

/**
 * Hides or unhides one review. Hiding takes it off the storefront and out of the
 * product's average rating; it is never a delete, and the review stays in this list
 * so it can be put back.
 *
 * One hook for both directions rather than a pair, since the endpoint takes the
 * desired state — same shape as useSetProductAttributeDefinitionActive.
 */
const useSetProductReviewHidden = (businessId: string, productId: string | undefined) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ reviewId, isHidden }: SetReviewHiddenVariables) =>
            setProductReviewHiddenService(businessId, productId!, reviewId, isHidden),
        onSuccess: (_data, { isHidden }) => {
            // The review list changes, and so does the product's average rating and
            // review count wherever they're shown — a broad invalidation is simpler
            // and correct rather than patching each cache by hand.
            queryClient.invalidateQueries({ queryKey: ["business-dashboard"] });
            notify.success(isHidden ? "Review hidden from your storefront." : "Review restored.");
        },
        onError: (error) => {
            notify.error(
                error instanceof ApiError ? error.message : "Couldn't update this review."
            );
        },
    });
};

export default useSetProductReviewHidden;
