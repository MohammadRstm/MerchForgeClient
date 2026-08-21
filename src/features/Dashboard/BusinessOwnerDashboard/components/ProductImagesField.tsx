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
}: ProductImagesFieldProps) => {
    return (
        <div className="business-dashboard-form-field">
            <label className="business-dashboard-form-label">
                Images
                <span className="business-dashboard-form-hint"> — up to {maxImages}, one marked as main</span>
            </label>

            <div className="product-images-grid">
                {images.map((image) => (
                    <div key={image.url} className={`product-image-tile${image.isMain ? " product-image-tile--main" : ""}`}>
                        <img src={resolveImageUrl(image.url)} alt="Product" className="product-image-tile__preview" />

                        {image.isMain && <span className="business-dashboard-badge product-image-tile__badge">Main</span>}

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
                    </div>
                ))}

                {images.length < maxImages && (
                    <ProductImageDropzone isUploading={isUploading} uploadError={uploadError} onFileSelected={onAddImage} />
                )}
            </div>

            {validationError && (
                <span className="business-dashboard-form-error" role="alert">
                    {validationError}
                </span>
            )}
        </div>
    );
};

export default ProductImagesField;
