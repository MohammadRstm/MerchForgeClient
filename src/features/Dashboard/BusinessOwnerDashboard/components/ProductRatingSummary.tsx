import StarRating from "./StarRating";

interface ProductRatingSummaryProps {
    /** Null when the product has no visible reviews. */
    averageRating: number | null;
    reviewCount: number;
}

/**
 * A product's rating at a glance, for the products grid and the detail modal.
 *
 * Renders for every product, including unreviewed ones. On a storefront five greyed
 * stars on every card would be noise, but an owner scanning their own catalog is
 * asking "which of these have feedback?" — and a blank where the rating should be
 * answers that far less clearly than saying so.
 *
 * The figures are visible reviews only, so they match what shoppers see. Hiding a
 * review moves these numbers.
 */
const ProductRatingSummary = ({ averageRating, reviewCount }: ProductRatingSummaryProps) => {
    return (
        <div className="product-rating-summary">
            <StarRating value={averageRating ?? 0} />

            {reviewCount === 0 ? (
                <span className="product-rating-summary__empty">No reviews yet</span>
            ) : (
                <span className="product-rating-summary__value">
                    {averageRating?.toFixed(1)}
                    <span className="product-rating-summary__count">
                        {" "}
                        ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                    </span>
                </span>
            )}
        </div>
    );
};

export default ProductRatingSummary;
