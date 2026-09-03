import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBusinessProductService } from "../../../../../services/api/businessDashboard.api";
import useProductForm from "../data/useProductForm";
import useProductAnalytics from "../data/useProductAnalytics";
import useProductReviews from "../data/useProductReviews";
import useSetProductReviewHidden from "../data/useSetProductReviewHidden";

/**
 * The read-only "view everything about this product" card opened by clicking a
 * table row. Separate from useProductModal (the edit form) — viewing and editing are
 * different intents, and not every click on a row is a click to change something.
 *
 * from/to are the Products page's own analytics range (shared, not modal-local) —
 * the Performance section's "during selected period" figures and trend chart mean
 * the same period the rest of the page is showing.
 */
const useProductDetailModal = (businessId: string, from: string, to: string) => {
    const [productId, setProductId] = useState<string | undefined>(undefined);

    const isOpen = Boolean(productId);

    const { data: product, isLoading } = useQuery({
        queryKey: ["business-dashboard", "product", businessId, productId],
        queryFn: () => getBusinessProductService(businessId, productId!),
        enabled: isOpen,
    });

    // Metadata field labels aren't on the product itself (it only stores values), so
    // the form's field definitions are fetched the same way useProductModal does.
    const { data: productForm } = useProductForm(businessId, isOpen);

    const {
        data: performance,
        isLoading: performanceLoading,
        isError: performanceError,
    } = useProductAnalytics(businessId, isOpen ? from : "", isOpen ? to : "", productId);

    const [reviewsPage, setReviewsPage] = useState(1);

    const {
        data: reviews,
        isLoading: reviewsLoading,
        isError: reviewsError,
    } = useProductReviews(businessId, productId, reviewsPage);

    const { mutate: setReviewHidden, isPending: isUpdatingReview } =
        useSetProductReviewHidden(businessId, productId);

    const open = (id: string) => {
        // Reset paging: page 3 of the last product's reviews means nothing for this one.
        setReviewsPage(1);
        setProductId(id);
    };

    const close = () => setProductId(undefined);

    return {
        isOpen,
        isLoading,
        product,
        metadataFields: productForm?.metadataFields ?? [],
        performance,
        performanceLoading,
        performanceError,

        reviews,
        reviewsLoading,
        reviewsError,
        reviewsPage,
        setReviewsPage,
        setReviewHidden,
        isUpdatingReview,

        open,
        close,
    };
};

export default useProductDetailModal;
