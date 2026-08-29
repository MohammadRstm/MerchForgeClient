import "./ImageLightbox.css";

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
 *
 * Closes on backdrop click via a direct handler here, not the generic
 * useClickOutside hook — that hook listens on `document`, and a lightbox opened
 * from inside another Modal is a DOM sibling of it (not a descendant), so a click
 * meant to close just the lightbox was also reaching the Modal's own
 * document-level listener and closing it too. Stopping propagation at the
 * backdrop keeps this click from ever bubbling that far.
 */
const ImageLightbox = ({ url, alt, onClose }: ImageLightboxProps) => {
    if (!url) return null;

    const handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="image-lightbox-backdrop" onMouseDown={handleBackdropMouseDown}>
            <button
                type="button"
                className="image-lightbox-close"
                onClick={onClose}
                aria-label="Close enlarged image"
            >
                ×
            </button>

            <img src={url} alt={alt ?? "Enlarged product image"} className="image-lightbox-image" />
        </div>
    );
};

export default ImageLightbox;
