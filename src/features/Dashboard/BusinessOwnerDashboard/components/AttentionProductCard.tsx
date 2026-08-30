import { resolveImageUrl } from "../utils/resolveImageUrl";
import type { AttentionItem } from "../utils/productAttention";

type AttentionProductCardProps = {
    item: AttentionItem;
    onSelectProduct: (productId: string) => void;
};

const AttentionProductCard = ({ item: { product, reason }, onSelectProduct }: AttentionProductCardProps) => {
    return (
        <button type="button" className="attention-card" onClick={() => onSelectProduct(product.productId)}>
            <div className="attention-card__image">
                {product.imageUrl ? (
                    <img src={resolveImageUrl(product.imageUrl)} alt="" />
                ) : (
                    <span className="attention-card__image-placeholder" aria-hidden="true">
                        {product.title.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>

            <div className="attention-card__body">
                <span className="attention-card__title">{product.title}</span>
                <span className="attention-card__category">{product.categoryName}</span>
                <span className="attention-card__reason">{reason}</span>
            </div>
        </button>
    );
};

export default AttentionProductCard;
