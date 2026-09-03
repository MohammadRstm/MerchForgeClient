import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProductReviewsService } from "../../../../../services/api/businessDashboard.api";
import { REVIEWS_PAGE_SIZE } from "../../constants";

/**
 * One page of a product's reviews for the owner's detail modal, including hidden
 * ones. Only runs while the modal is open, since productId is undefined otherwise.
 */
const useProductReviews = (businessId: string, productId: string | undefined, page: number) => {
    return useQuery({
        queryKey: ["business-dashboard", "product-reviews", businessId, productId, page],
        queryFn: () =>
            getProductReviewsService(businessId, productId!, { page, pageSize: REVIEWS_PAGE_SIZE }),
        enabled: !!businessId && !!productId,
        // Paging inside a modal shouldn't blank the list while the next page loads.
        placeholderData: keepPreviousData,
    });
};

export default useProductReviews;
