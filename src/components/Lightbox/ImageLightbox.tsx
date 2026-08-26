import { useRef } from "react";
import "./ImageLightbox.css";
import useClickOutside from "../../hooks/useClickOutsideElementToClose";

type ImageLightboxProps = {
    /** Absent (or undefined) renders nothing — callers keep a single "currently enlarged url" piece of state rather than a separate open flag. */
    url?: string;
    alt?: string;
    onClose: () => void;
};

/**
 * A full-viewport image preview, reusable anywhere a gallery thumbnail should
 * expand on click. Deliberately its own component rather than the shared <Modal>:
 * a lightbox has no card, header, or footer — just the image, centered, with
 * nothing else competing for attention.
 */
const ImageLightbox = ({ url, alt, onClose }: ImageLightboxProps) => {
    const imageRef = useRef<HTMLImageElement>(null);

    useClickOutside(imageRef, onClose);

    if (!url) return null;

    return (
        <div className="image-lightbox-backdrop">
            <button
                type="button"
                className="image-lightbox-close"
                onClick={onClose}
                aria-label="Close enlarged image"
            >
                ×
            </button>

            <img ref={imageRef} src={url} alt={alt ?? "Enlarged product image"} className="image-lightbox-image" />
        </div>
    );
};

export default ImageLightbox;
