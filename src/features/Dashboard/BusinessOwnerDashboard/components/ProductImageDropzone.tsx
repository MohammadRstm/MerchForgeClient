import { useRef, useState, type DragEvent } from "react";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
type ProductImageDropzoneProps = {
    /** Disabled (rather than hidden) once the gallery is full, so the reason is visible in place. */
    disabled?: boolean;
    isUploading: boolean;
    uploadError?: string;
    onFileSelected: (file: File) => void;
};

/**
 * A single "drop or click to add an image" tile. The product form renders one of
 * these per open gallery slot (see ProductImagesField) rather than a fixed one-image
 * field — a product can carry up to 5 images now, each managed as its own gallery
 * entry, not a single replaceable slot.
 */
const ProductImageDropzone = ({
    disabled,
    isUploading,
    uploadError,
    onFileSelected,
}: ProductImageDropzoneProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (disabled) return;

        const file = e.dataTransfer.files?.[0];
        if (file) onFileSelected(file);
    };

    return (
        <div className="product-image-field">
            <div
                className={`product-dropzone${isDragging ? " product-dropzone--active" : ""}${
                    disabled ? " product-dropzone--disabled" : ""
                }`}
                onDragOver={(e) => {
                    e.preventDefault();
                    if (!disabled) setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => !disabled && inputRef.current?.click()}
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-disabled={disabled}
                onKeyDown={(e) => {
                    if (!disabled && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        inputRef.current?.click();
                    }
                }}
                aria-label="Add product image"
            >
                {isUploading ? (
                    <div className="product-dropzone__state">
                        <Spinner size={24} />
                        <span>Uploading…</span>
                    </div>
                ) : (
                    <div className="product-dropzone__state">
                        <span className="product-dropzone__icon">↑</span>
                        <span>{disabled ? "Gallery full" : "Drop an image here, or click to choose one"}</span>
                        {!disabled && <span className="product-dropzone__hint">JPEG, PNG, GIF or WEBP · up to 5 MB</span>}
                    </div>
                )}
            </div>

            {uploadError && (
                <span className="business-dashboard-form-error" role="alert">
                    {uploadError}
                </span>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                hidden
                disabled={disabled}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onFileSelected(file);
                    // Reset so re-picking the same file still fires a change event.
                    e.target.value = "";
                }}
            />
        </div>
    );
};

export default ProductImageDropzone;
