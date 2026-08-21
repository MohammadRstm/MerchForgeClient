import { Fragment } from "react";
import Modal from "../../../../components/Modal/Modal";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type useProductDetailModal from "../hooks/ui/useProductDetailModal";
import { resolveImageUrl } from "../utils/resolveImageUrl";

type ProductDetailModalProps = {
    modal: ReturnType<typeof useProductDetailModal>;
    onEdit: (productId: string) => void;
};

const currencyFormatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
});

const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
});

/** Renders a metadata value the same way regardless of its declared type — a plain, read-only display, unlike the form's per-type inputs. */
const formatMetadataValue = (value: unknown): string => {
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (value == null) return "—";
    return String(value);
};

const ProductDetailModal = ({ modal, onEdit }: ProductDetailModalProps) => {
    const { isOpen, isLoading, product, metadataFields, close } = modal;

    return (
        <Modal isOpen={isOpen} onClose={close}>
            <Modal.Header>
                <h2>{product?.title ?? "Product"}</h2>
            </Modal.Header>

            <Modal.Body>
                {isLoading || !product ? (
                    <div className="business-dashboard-table-loading">
                        <Spinner size={28} />
                    </div>
                ) : (
                    <div className="product-detail">
                        {product.images.length > 0 ? (
                            <div className="product-detail__gallery">
                                {product.images
                                    .slice()
                                    .sort((a, b) => a.displayOrder - b.displayOrder)
                                    .map((image) => (
                                        <div
                                            key={image.id}
                                            className={`product-detail__gallery-item${image.isMain ? " product-detail__gallery-item--main" : ""}`}
                                        >
                                            <img src={resolveImageUrl(image.url)} alt={image.altText ?? product.title} />
                                            {image.isMain && <span className="business-dashboard-badge">Main</span>}
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <p className="business-dashboard-table-message">No images.</p>
                        )}

                        <div className="product-detail__row">
                            <span className="product-detail__price">{currencyFormatter.format(product.price)}</span>
                            {product.compareAtPrice && (
                                <span className="product-price-compare-at">
                                    {currencyFormatter.format(product.compareAtPrice)}
                                </span>
                            )}
                            <span className="business-dashboard-badge">{product.categoryName}</span>
                            {product.stockQuantity === null ? (
                                <span className="business-dashboard-badge">Not tracked</span>
                            ) : product.stockQuantity === 0 ? (
                                <span className="business-dashboard-badge business-dashboard-badge--status-cancelled">
                                    Out of stock
                                </span>
                            ) : (
                                <span className="business-dashboard-badge business-dashboard-badge--status-active">
                                    {product.stockQuantity} in stock
                                </span>
                            )}
                        </div>

                        {product.tags.length > 0 && (
                            <div className="product-detail__row">
                                {product.tags.map((tag) => (
                                    <span key={tag} className="business-dashboard-badge">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <p className="product-detail__description">{product.description}</p>

                        <dl className="product-detail__facts">
                            {product.sku && (
                                <>
                                    <dt>SKU</dt>
                                    <dd>{product.sku}</dd>
                                </>
                            )}

                            {product.saleEndsAt && (
                                <>
                                    <dt>Sale ends</dt>
                                    <dd>{dateFormatter.format(new Date(product.saleEndsAt))}</dd>
                                </>
                            )}

                            {metadataFields.map((field) => (
                                <Fragment key={field.key}>
                                    <dt>{field.label}</dt>
                                    <dd>{formatMetadataValue(product.metadata?.[field.key])}</dd>
                                </Fragment>
                            ))}

                            <dt>Added</dt>
                            <dd>{dateFormatter.format(new Date(product.createdAt))}</dd>

                            <dt>Last updated</dt>
                            <dd>{dateFormatter.format(new Date(product.updatedAt))}</dd>
                        </dl>
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer>
                <button type="button" className="business-dashboard-button-secondary" onClick={close}>
                    Close
                </button>
                {product && (
                    <button
                        type="button"
                        className="business-dashboard-button-primary"
                        onClick={() => onEdit(product.id)}
                    >
                        Edit product
                    </button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default ProductDetailModal;
