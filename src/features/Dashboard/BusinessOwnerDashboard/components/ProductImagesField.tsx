import type { ProductFormImage } from "../types";
import { resolveImageUrl } from "../utils/resolveImageUrl";
import ProductImageDropzone from "./ProductImageDropzone";

type ProductImagesFieldProps = {
    images: ProductFormImage[];
    maxImages: number;
    isUploading: boolean;
    uploadError?: string;
    validationError?: string;
    onAddImage: (file: File) => void;
    onRemoveImage: (url: string) => void;
    onSetMainImage: (url: string) => void;
    /** Absent while the AI chat is open — there's only one second card, and it's either "Fill with AI" or this. */
    onEditImages?: () => void;
    /** Opens the "generate in multiple angles" modal — a separate one-shot action from the open-ended edit chat above. */
    onGenerateAngles?: () => void;
    /** True once "Edit images" has been clicked: tiles become pickable instead of offering their normal actions. */
    isSelectingForEdit?: boolean;
    selectedForEdit?: Set<string>;
    onToggleSelectForEdit?: (url: string) => void;
    /** The one selected image an edit request is in flight for right now — others stay merely selected, still queued. */
    processingImageUrl?: string;
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
    onEditImages,
    onGenerateAngles,
    isSelectingForEdit,
    selectedForEdit,
    onToggleSelectForEdit,
    processingImageUrl,
}: ProductImagesFieldProps) => {
    return (
        <div className="business-dashboard-form-field">
            <label className="business-dashboard-form-label">
                Images
                <span className="business-dashboard-form-hint"> — up to {maxImages}, one marked as main</span>
            </label>

            <div className="product-images-grid">
                {images.map((image) => {
                    const isSelected = selectedForEdit?.has(image.url) ?? false;
                    const isProcessing = image.url === processingImageUrl;

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

                            <img src={resolveImageUrl(image.url)} alt="Product" className="product-image-tile__preview" />

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

            {!isSelectingForEdit && images.length > 0 && (
                <div className="product-images-field__actions">
                    {onEditImages && (
                        <button
                            type="button"
                            className="business-dashboard-button-secondary product-images-field__edit-button"
                            onClick={onEditImages}
                        >
                            ✨ Edit images
                        </button>
                    )}

                    {onGenerateAngles && (
                        <button
                            type="button"
                            className="business-dashboard-button-secondary product-images-field__angles-button"
                            onClick={onGenerateAngles}
                        >
                            🔄 Generate in multiple angles
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductImagesField;
