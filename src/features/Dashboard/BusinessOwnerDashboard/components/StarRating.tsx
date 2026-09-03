import { FiStar } from "react-icons/fi";

interface StarRatingProps {
    /** 1-5. */
    value: number;
}

/**
 * Read-only star display for the owner's review list. There is no interactive
 * counterpart here on purpose — owners moderate reviews, they don't write them.
 */
const StarRating = ({ value }: StarRatingProps) => {
    const filled = Math.min(5, Math.max(0, Math.round(value)));

    return (
        <span className="product-review__stars" role="img" aria-label={`Rated ${value} out of 5`}>
            {Array.from({ length: 5 }, (_, index) => (
                <FiStar
                    key={index}
                    aria-hidden="true"
                    className={
                        index < filled
                            ? "product-review__star product-review__star--filled"
                            : "product-review__star"
                    }
                />
            ))}
        </span>
    );
};

export default StarRating;
