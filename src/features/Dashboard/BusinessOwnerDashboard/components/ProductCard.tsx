import StockCell from "./StockCell";
import ProductRatingSummary from "./ProductRatingSummary";
import ChangeIndicator from "./ChangeIndicator";
import { currencyFormatter, numberFormatter } from "../utils/chartMetrics";
import type { BusinessProductResponse, ProductPerformanceEntry } from "../types";
import { resolveImageUrl } from "../utils/resolveImageUrl";

interface ProductCardProps {
    product: BusinessProductResponse;
    /** Sales for the page's currently selected analytics period — undefined while that data is still loading. */
    performance?: ProductPerformanceEntry;
    onView: (productId: string) => void;
    onEdit: (productId: string) => void;
    onDelete: (product: BusinessProductResponse) => void;
    isDeleting: boolean;
}

const ProductCard = ({ product, performance, onView, onEdit, onDelete, isDeleting }: ProductCardProps) => {
    return (
        <article
            className="product-card"
            onClick={() => onView(product.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onView(product.id);
                }
            }}
        >
            <div className="product-card__image">
                {product.imageUrl ? (
                    <img src={resolveImageUrl(product.imageUrl)} alt="" />
                ) : (
                    <span className="product-card__image-placeholder" aria-hidden="true">
                        {product.title.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>

            <div className="product-card__body">
                <ProductRatingSummary
                    averageRating={product.averageRating}
                    reviewCount={product.reviewCount}
                />

                <div className="product-card__heading">
                    <h4 className="product-card__title">{product.title}</h4>
                    <span className="business-dashboard-badge">{product.category}</span>
                </div>

                <div className="product-card__price">
                    <span className={product.compareAtPrice ? "product-price-current" : undefined}>
                        {currencyFormatter.format(product.price)}
                    </span>
                    {product.compareAtPrice && (
                        <span className="product-price-compare-at">
                            {" "}
                            {currencyFormatter.format(product.compareAtPrice)}
                        </span>
                    )}
                </div>

                <StockCell stockQuantity={product.stockQuantity} />

                {performance && performance.unitsSold > 0 && (
                    <div className="product-card__performance">
                        <span>{numberFormatter.format(performance.unitsSold)} sold</span>
                        <span>{currencyFormatter.format(performance.revenue)}</span>
                        <ChangeIndicator percent={performance.unitsSoldChangePercent} suffix="" />
                    </div>
                )}
            </div>

            <div className="product-card__actions" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="business-dashboard-button-ghost" onClick={() => onEdit(product.id)}>
                    Edit
                </button>
                <button
                    type="button"
                    className="business-dashboard-button-ghost business-dashboard-button-ghost--danger"
                    onClick={() => onDelete(product)}
                    disabled={isDeleting}
                >
                    {isDeleting ? "Deleting…" : "Delete"}
                </button>
            </div>
        </article>
    );
};

export default ProductCard;
