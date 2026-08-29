import { useState } from "react";
import { FiCheck } from "react-icons/fi";
import Modal from "../../../../components/Modal/Modal";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import ImageLightbox from "../../../../components/Lightbox/ImageLightbox";
import { resolveImageUrl } from "../utils/resolveImageUrl";
import { MAX_ANGLES, PRODUCT_IMAGE_ANGLES } from "../constants/productImageAngles";
import type useMultiAngleImages from "../hooks/ui/useMultiAngleImages";

type MultiAngleImagesModalProps = {
    multiAngle: ReturnType<typeof useMultiAngleImages>;
};

/**
 * Two phases in one modal: pick angles, then watch each one's own tile resolve
 * independently. There's no third "review and save" step — every result that lands
 * is already in the product's gallery (see useMultiAngleImages), so this is purely
 * a progress view the owner can dismiss once satisfied, or remove tiles from
 * directly via the normal gallery once closed.
 */
const MultiAngleImagesModal = ({ multiAngle }: MultiAngleImagesModalProps) => {
    const {
        isOpen,
        close,
        hasMainImage,
        selectedKeys,
        toggleAngle,
        results,
        isGenerating,
        generate,
        includedInPlan,
        outOfCredits,
    } = multiAngle;

    const [lightboxUrl, setLightboxUrl] = useState<string | undefined>(undefined);

    const isPicking = !results;
    const settledCount = results?.filter((result) => result.status !== "pending").length ?? 0;
    const doneCount = results?.filter((result) => result.status === "done").length ?? 0;

    const costLabel = includedInPlan
        ? "Included in your plan."
        : selectedKeys.length === 0
            ? `1 credit per angle — pick up to ${MAX_ANGLES}.`
            : `This will use ${selectedKeys.length} credit${selectedKeys.length === 1 ? "" : "s"} (1 per angle).`;

    return (
        <>
            <Modal isOpen={isOpen} onClose={close}>
                <Modal.Header>
                    <h2>Generate in multiple angles</h2>
                </Modal.Header>

                <Modal.Body>
                    {isPicking ? (
                        <>
                            <p className="business-dashboard-form-hint">
                                Pick up to {MAX_ANGLES} camera angles — the AI generates a new photo for each one,
                                reusing your product's existing images where possible and its main image otherwise.
                            </p>

                            {!hasMainImage ? (
                                <p className="business-dashboard-form-error" role="alert">
                                    Add a main image first — there's nothing to generate angles from yet.
                                </p>
                            ) : (
                                <>
                                    <div className="angle-picker-grid">
                                        {PRODUCT_IMAGE_ANGLES.map((angle) => {
                                            const isSelected = selectedKeys.includes(angle.key);
                                            const isDisabled = !isSelected && selectedKeys.length >= MAX_ANGLES;

                                            return (
                                                <button
                                                    key={angle.key}
                                                    type="button"
                                                    className={`angle-chip${isSelected ? " angle-chip--selected" : ""}`}
                                                    onClick={() => toggleAngle(angle.key)}
                                                    disabled={isDisabled}
                                                    aria-pressed={isSelected}
                                                >
                                                    {isSelected && <FiCheck aria-hidden="true" />}
                                                    {angle.label}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <p
                                        className={outOfCredits ? "business-dashboard-form-error" : "business-dashboard-form-hint"}
                                        role={outOfCredits ? "alert" : undefined}
                                    >
                                        {outOfCredits
                                            ? "You're out of AI image-editing credits. Buy more from Features to continue."
                                            : costLabel}
                                    </p>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="product-images-grid">
                            {results.map((result) => (
                                <div key={result.key} className="product-image-tile angle-result-tile">
                                    {result.status === "pending" && (
                                        <div className="angle-result-tile__pending">
                                            <Spinner size={28} />
                                        </div>
                                    )}

                                    {result.status === "done" && result.url && (
                                        <img
                                            src={resolveImageUrl(result.url)}
                                            alt={result.label}
                                            className="product-image-tile__preview"
                                            onClick={() => setLightboxUrl(resolveImageUrl(result.url!))}
                                        />
                                    )}

                                    {result.status === "error" && (
                                        <div className="angle-result-tile__error">{result.error}</div>
                                    )}

                                    <span className="business-dashboard-badge angle-result-tile__label">{result.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    {isPicking ? (
                        <>
                            <button type="button" className="business-dashboard-button-secondary" onClick={close}>
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="business-dashboard-button-primary"
                                onClick={generate}
                                disabled={!hasMainImage || selectedKeys.length === 0 || outOfCredits}
                            >
                                Generate
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            className="business-dashboard-button-primary"
                            onClick={close}
                            disabled={isGenerating}
                        >
                            {isGenerating
                                ? `Generating… (${settledCount}/${results.length})`
                                : `Done — ${doneCount} of ${results.length} generated`}
                        </button>
                    )}
                </Modal.Footer>
            </Modal>

            <ImageLightbox url={lightboxUrl} onClose={() => setLightboxUrl(undefined)} />
        </>
    );
};

export default MultiAngleImagesModal;
