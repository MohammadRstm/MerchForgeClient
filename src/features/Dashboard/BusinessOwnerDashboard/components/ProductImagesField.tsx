import { useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import type { ProductFormImage } from "../types";
import { resolveImageUrl } from "../utils/resolveImageUrl";
import ProductImageDropzone from "./ProductImageDropzone";
import ImageLightbox from "../../../../components/Lightbox/ImageLightbox";

type ProductImagesFieldProps = {
    images: ProductFormImage[];
    maxImages: number;
    isUploading: boolean;
    uploadError?: string;
    validationError?: string;
    onAddImage: (file: File) => void;
    onRemoveImage: (url: string) => void;
    onSetMainImage: (url: string) => void;
    /** Opens the image-tools menu (custom edit, angles, colors, background/enhance, suggest details). Absent while some other AI flow already owns the gallery's selection. */
    onOpenImageTools?: () => void;
    /** True while some flow (the edit chat, or a quick edit) has put the gallery into pick-images mode: tiles become pickable instead of offering their normal actions. */
    isSelectingForEdit?: boolean;
    selectedForEdit?: Set<string>;
    onToggleSelectForEdit?: (url: string) => void;
    /** Images a request is in flight for right now — others stay merely selected, still queued. More than one at once when edits run concurrently. */
    processingImageUrls?: Set<string>;
};

/**
 * A product's whole gallery — 1 to `maxImages` images, exactly one marked main. Every
 * thumbnail carries its own "make main" and remove controls rather than a single
 * replaceable image field, matching the backend's product_images table (a real
 * one-to-many gallery, not one nullable ImageUrl column).
 */
const ProductImagesField = ({
    images,
    maxImages,
    isUploading,
    uploadError,
    validationError,
    onAddImage,
    onRemoveImage,
    onSetMainImage,
    onOpenImageTools,
    isSelectingForEdit,
    selectedForEdit,
    onToggleSelectForEdit,
    processingImageUrls,
}: ProductImagesFieldProps) => {
    const [lightboxUrl, setLightboxUrl] = useState<string | undefined>(undefined);

    return (
        <div className="business-dashboard-form-field">
            <label className="business-dashboard-form-label">
                Images
                <span className="business-dashboard-form-hint"> — up to {maxImages}, one marked as main</span>
            </label>

            <div className="product-images-grid">
                {images.map((image) => {
                    const isSelected = selectedForEdit?.has(image.url) ?? false;
                    const isProcessing = processingImageUrls?.has(image.url) ?? false;

                    return (
                        <div
                            key={image.url}
                            className={[
                                "product-image-tile",
                                image.isMain ? "product-image-tile--main" : "",
                                isSelectingForEdit ? "product-image-tile--selectable" : "",
                                isSelected ? "product-image-tile--selected" : "",
                            ].filter(Boolean).join(" ")}
                            onClick={isSelectingForEdit ? () => onToggleSelectForEdit?.(image.url) : undefined}
                            role={isSelectingForEdit ? "button" : undefined}
                            tabIndex={isSelectingForEdit ? 0 : undefined}
                        >
                            {isProcessing && (
                                // Same border-trace technique as the form card's own AI-thinking
                                // glow — a short lit segment tracing this tile's exact outline.
                                <svg className="product-image-tile__glow-trace" aria-hidden="true">
                                    <rect x="0" y="0" width="100%" height="100%" rx="10" pathLength={100} />
                                </svg>
                            )}

                            <img
                                src={resolveImageUrl(image.url)}
                                alt="Product"
                                className="product-image-tile__preview"
                                onClick={isSelectingForEdit ? undefined : () => setLightboxUrl(resolveImageUrl(image.url))}
                            />

                            {image.isMain && <span className="business-dashboard-badge product-image-tile__badge">Main</span>}

                            {isSelectingForEdit ? (
                                <span
                                    className={`product-image-tile__select-mark${isSelected ? " product-image-tile__select-mark--checked" : ""}`}
                                    aria-hidden="true"
                                >
                                    {isSelected && "✓"}
                                </span>
                            ) : (
                                <div className="product-image-tile__actions">
                                    {!image.isMain && (
                                        <button
                                            type="button"
                                            className="product-image-tile__action"
                                            onClick={() => onSetMainImage(image.url)}
                                        >
                                            Make main
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="product-image-tile__action product-image-tile__action--danger"
                                        onClick={() => onRemoveImage(image.url)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}

                {!isSelectingForEdit && images.length < maxImages && (
                    <ProductImageDropzone isUploading={isUploading} uploadError={uploadError} onFileSelected={onAddImage} />
                )}
            </div>

            {validationError && (
                <span className="business-dashboard-form-error" role="alert">
                    {validationError}
                </span>
            )}

            {onOpenImageTools && !isSelectingForEdit && images.length > 0 && (
                <button
                    type="button"
                    className="business-dashboard-button-secondary product-images-field__edit-button"
                    onClick={onOpenImageTools}
                >
                    <FiEdit3 aria-hidden="true" /> Edit images
                </button>
            )}

            <ImageLightbox url={lightboxUrl} onClose={() => setLightboxUrl(undefined)} />
        </div>
    );
};

export default ProductImagesField;
