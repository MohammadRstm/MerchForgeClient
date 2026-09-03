import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Pagination from "../../../../components/Pagination/Pagination";
import StarRating from "./StarRating";
import type useProductDetailModal from "../hooks/ui/useProductDetailModal";

type ProductReviewsSectionProps = {
    modal: ReturnType<typeof useProductDetailModal>;
};

/**
 * Customer reviews for the product being viewed, with the owner's only moderation
 * control: hide or restore.
 *
 * Shows hidden reviews too, marked as such — hiding is not deleting, and a hidden
 * review the owner couldn't see would be one they could never restore.
 */
const ProductReviewsSection = ({ modal }: ProductReviewsSectionProps) => {
    const {
        reviews,
        reviewsLoading,
        reviewsError,
        reviewsPage,
        setReviewsPage,
        setReviewHidden,
        isUpdatingReview,
    } = modal;

    return (
        <div className="product-detail__reviews">
            <h3>Customer Reviews</h3>

            {reviewsLoading ? (
                <div className="business-dashboard-table-loading">
                    <Spinner size={24} />
                </div>
            ) : reviewsError ? (
                <p className="business-dashboard-table-message business-dashboard-table-message--error">
                    Unable to load reviews.
                </p>
            ) : !reviews || reviews.items.length === 0 ? (
                <p className="business-dashboard-form-hint">
                    No reviews yet. Only customers who have ordered this product can leave one.
                </p>
            ) : (
                <>
                    <ul className="product-review-list">
                        {reviews.items.map((review) => (
                            <li className="product-review" key={review.id}>
                                <div className="product-review__head">
                                    <StarRating value={review.rating} />

                                    {review.isHidden && (
                                        <span className="business-dashboard-badge business-dashboard-badge--status-cancelled">
                                            Hidden
                                        </span>
                                    )}

                                    <button
                                        type="button"
                                        className="business-dashboard-button-ghost product-review__action"
                                        disabled={isUpdatingReview}
                                        onClick={() =>
                                            setReviewHidden({
                                                reviewId: review.id,
                                                isHidden: !review.isHidden,
                                            })
                                        }
                                    >
                                        {review.isHidden ? "Restore" : "Hide"}
                                    </button>
                                </div>

                                {review.comment && (
                                    <p className="product-review__content">{review.comment}</p>
                                )}

                                <p className="product-review__meta">
                                    {review.customerName} · {review.customerEmail} ·{" "}
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                            </li>
                        ))}
                    </ul>

                    {/* Pagination renders null on its own when there's only one page. */}
                    <Pagination
                        page={reviewsPage}
                        totalPages={reviews.totalPages}
                        onPageChange={setReviewsPage}
                    />
                </>
            )}
        </div>
    );
};

export default ProductReviewsSection;
