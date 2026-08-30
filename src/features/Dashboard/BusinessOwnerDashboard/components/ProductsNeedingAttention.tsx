import { useState } from "react";
import AttentionProductCard from "./AttentionProductCard";
import AttentionProductsModal from "./AttentionProductsModal";
import { buildAttentionItems } from "../utils/productAttention";
import type { ProductPerformanceEntry } from "../types";

const PREVIEW_COUNT = 3;

type ProductsNeedingAttentionProps = {
    products: ProductPerformanceEntry[];
    onSelectProduct: (productId: string) => void;
};

const ProductsNeedingAttention = ({ products, onSelectProduct }: ProductsNeedingAttentionProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const items = buildAttentionItems(products);
    const preview = items.slice(0, PREVIEW_COUNT);
    const hasMore = items.length > PREVIEW_COUNT;

    return (
        <section className="business-dashboard-table-card needs-attention">
            <div className="business-dashboard-table-header">
                <h3>Products That Need Attention</h3>
            </div>

            {items.length === 0 ? (
                <p className="business-dashboard-table-message">Nothing needs attention — every product is holding steady or better.</p>
            ) : (
                <>
                    <div className="attention-cards-grid">
                        {preview.map((item) => (
                            <AttentionProductCard key={item.product.productId} item={item} onSelectProduct={onSelectProduct} />
                        ))}
                    </div>

                    {hasMore && (
                        <button
                            type="button"
                            className="business-dashboard-button-ghost attention-show-more"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Show all ({items.length}) →
                        </button>
                    )}
                </>
            )}

            <AttentionProductsModal
                isOpen={isModalOpen}
                items={items}
                onClose={() => setIsModalOpen(false)}
                onSelectProduct={onSelectProduct}
            />
        </section>
    );
};

export default ProductsNeedingAttention;
