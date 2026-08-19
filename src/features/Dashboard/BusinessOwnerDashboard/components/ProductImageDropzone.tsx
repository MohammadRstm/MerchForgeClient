import { useRef, useState, type DragEvent } from "react";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { env } from "../../../../config/env";

type ProductImageDropzoneProps = {
    imageUrl: string | null;
    isUploading: boolean;
    uploadError?: string;
    onFileSelected: (file: File) => void;
    onClear: () => void;
};

/**
 * Stored image URLs are relative to the API, not the frontend, so they need the API
 * origin prefixed to render. Left relative on the wire so the same value stays
 * correct across environments.
 */
export const resolveImageUrl = (imageUrl: string): string =>
    imageUrl.startsWith("http") ? imageUrl : `${env.apiUrl.replace(/\/$/, "")}${imageUrl}`;

const ProductImageDropzone = ({
    imageUrl,
    isUploading,
    uploadError,
    onFileSelected,
    onClear,
}: ProductImageDropzoneProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) onFileSelected(file);
    };

    return (
        <div className="product-image-field">
            <div
                className={`product-dropzone${isDragging ? " product-dropzone--active" : ""}${
                    imageUrl ? " product-dropzone--filled" : ""
                }`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        inputRef.current?.click();
                    }
                }}
                aria-label={imageUrl ? "Replace product image" : "Add product image"}
            >
                {isUploading ? (
                    <div className="product-dropzone__state">
                        <Spinner size={24} />
                        <span>Uploading…</span>
                    </div>
                ) : imageUrl ? (
                    <img
                        src={resolveImageUrl(imageUrl)}
                        alt="Product preview"
                        className="product-dropzone__preview"
                    />
                ) : (
                    <div className="product-dropzone__state">
                        <span className="product-dropzone__icon">↑</span>
                        <span>Drop an image here, or click to choose one</span>
                        <span className="product-dropzone__hint">JPEG, PNG, GIF or WEBP · up to 5 MB</span>
                    </div>
                )}
            </div>

            {imageUrl && !isUploading && (
                <button type="button" className="product-image-remove" onClick={onClear}>
                    Remove image
                </button>
            )}

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
