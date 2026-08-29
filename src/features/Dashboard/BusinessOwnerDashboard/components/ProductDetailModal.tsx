import { Fragment, useState } from "react";
import { FiZoomIn } from "react-icons/fi";
import Modal from "../../../../components/Modal/Modal";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import ImageLightbox from "../../../../components/Lightbox/ImageLightbox";
import AnalyticsChart from "./AnalyticsChart";
import ChangeIndicator from "./ChangeIndicator";
import type useProductDetailModal from "../hooks/ui/useProductDetailModal";
import { resolveImageUrl } from "../utils/resolveImageUrl";
import { numberFormatter, revenueMetric, unitsSoldMetric } from "../utils/chartMetrics";
import type { ProductAnalyticsMetric } from "../types";

const REVENUE_METRIC = revenueMetric();
const UNITS_METRIC = unitsSoldMetric();

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

/** Renders a metadata value the same way regardless of its declared type — a plain, read-only display, unlike the form's per-type inputs. ColorList gets its own swatch rendering (see ProductDetailModal) rather than going through this. */
const formatMetadataValue = (value: unknown): string => {
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (value == null) return "—";
    return String(value);
};

const ProductDetailModal = ({ modal, onEdit }: ProductDetailModalProps) => {
    const { isOpen, isLoading, product, metadataFields, performance, performanceLoading, performanceError, close } = modal;
    const [lightboxUrl, setLightboxUrl] = useState<string | undefined>(undefined);
    const [trendMetric, setTrendMetric] = useState<Extract<ProductAnalyticsMetric, "revenue" | "unitsSold">>("revenue");
    const [activeImageId, setActiveImageId] = useState<string | undefined>(undefined);

    const sortedImages = product?.images.slice().sort((a, b) => a.displayOrder - b.displayOrder) ?? [];
    const activeImage = sortedImages.find((i) => i.id === activeImageId) ?? sortedImages.find((i) => i.isMain) ?? sortedImages[0];

    return (
        <>
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
                            {activeImage ? (
                                <div className="product-detail__gallery">
                                    <button
                                        type="button"
                                        className="product-detail__hero"
                                        onClick={() => setLightboxUrl(resolveImageUrl(activeImage.url))}
                                        aria-label="View full-size image"
                                    >
                                        <img src={resolveImageUrl(activeImage.url)} alt={activeImage.altText ?? product.title} />
                                        {activeImage.isMain && <span className="business-dashboard-badge">Main</span>}
                                        <span className="product-detail__hero-zoom" aria-hidden="true">
                                            <FiZoomIn />
                                        </span>
                                    </button>

                                    {sortedImages.length > 1 && (
                                        <div className="product-detail__thumbnails">
                                            {sortedImages.map((image) => (
                                                <button
                                                    key={image.id}
                                                    type="button"
                                                    className={`product-detail__thumbnail${image.id === activeImage.id ? " product-detail__thumbnail--active" : ""}`}
                                                    onClick={() => setActiveImageId(image.id)}
                                                    aria-label={image.isMain ? "Main image" : "Product image"}
                                                >
                                                    <img src={resolveImageUrl(image.url)} alt="" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
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

                            {product.description && (
                                <div className="product-detail__section">
                                    <h3>Description</h3>
                                    <p className="product-detail__description">{product.description}</p>
                                </div>
                            )}

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

                                {metadataFields.map((field) => {
                                    const rawValue = product.metadata?.[field.key];

                                    return (
                                        <Fragment key={field.key}>
                                            <dt>{field.label}</dt>
                                            {field.valueType === "ColorList" && Array.isArray(rawValue) && rawValue.length > 0 ? (
                                                <dd className="product-detail__colors">
                                                    {(rawValue as string[]).map((hex) => (
                                                        <span
                                                            key={hex}
                                                            className="color-swatch color-swatch--readonly"
                                                            style={{ backgroundColor: hex }}
                                                            title={hex}
                                                        />
                                                    ))}
                                                </dd>
                                            ) : (
                                                <dd>{formatMetadataValue(rawValue)}</dd>
                                            )}
                                        </Fragment>
                                    );
                                })}

                                <dt>Added</dt>
                                <dd>{dateFormatter.format(new Date(product.createdAt))}</dd>

                                <dt>Last updated</dt>
                                <dd>{dateFormatter.format(new Date(product.updatedAt))}</dd>
                            </dl>

                            <div className="product-detail__performance">
                                <h3>Product Performance</h3>

                                {performanceLoading ? (
                                    <div className="business-dashboard-table-loading">
                                        <Spinner size={24} />
                                    </div>
                                ) : performanceError ? (
                                    <p className="business-dashboard-table-message business-dashboard-table-message--error">
                                        Unable to load performance data.
                                    </p>
                                ) : performance ? (
                                    <>
                                        <dl className="product-detail__facts">
                                            <dt>Total units sold (all time)</dt>
                                            <dd>{numberFormatter.format(performance.allTime?.unitsSold ?? 0)}</dd>

                                            <dt>Total revenue (all time)</dt>
                                            <dd>{REVENUE_METRIC.formatValue(performance.allTime?.revenue ?? 0)}</dd>

                                            <dt>Orders containing this product</dt>
                                            <dd>{numberFormatter.format(performance.allTime?.orderCount ?? 0)}</dd>

                                            {performance.allTime?.averageUnitsPerOrder != null && (
                                                <>
                                                    <dt>Average units per order</dt>
                                                    <dd>{performance.allTime.averageUnitsPerOrder}</dd>
                                                </>
                                            )}

                                            <dt>Revenue in selected period</dt>
                                            <dd>
                                                {REVENUE_METRIC.formatValue(performance.currentPeriod.revenue)}{" "}
                                                <ChangeIndicator percent={performance.revenueChangePercent} suffix="" />
                                            </dd>

                                            <dt>Units sold in selected period</dt>
                                            <dd>
                                                {numberFormatter.format(performance.currentPeriod.unitsSold)}{" "}
                                                <ChangeIndicator percent={performance.unitsSoldChangePercent} suffix="" />
                                            </dd>
                                        </dl>

                                        {performance.points.length > 0 && (
                                            <>
                                                <div className="analytics-range-selector product-detail__trend-toggle">
                                                    <button
                                                        type="button"
                                                        className={`analytics-range-btn${trendMetric === "revenue" ? " analytics-range-btn--active" : ""}`}
                                                        onClick={() => setTrendMetric("revenue")}
                                                    >
                                                        Revenue over time
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`analytics-range-btn${trendMetric === "unitsSold" ? " analytics-range-btn--active" : ""}`}
                                                        onClick={() => setTrendMetric("unitsSold")}
                                                    >
                                                        Units sold over time
                                                    </button>
                                                </div>

                                                <AnalyticsChart
                                                    points={performance.points}
                                                    activeMetric={trendMetric === "revenue" ? REVENUE_METRIC : UNITS_METRIC}
                                                    tooltipMetrics={[REVENUE_METRIC, UNITS_METRIC]}
                                                    granularity={performance.granularity}
                                                    height={180}
                                                />
                                            </>
                                        )}
                                    </>
                                ) : null}
                            </div>
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

            <ImageLightbox url={lightboxUrl} onClose={() => setLightboxUrl(undefined)} />
        </>
    );
};

export default ProductDetailModal;
