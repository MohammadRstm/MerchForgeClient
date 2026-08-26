import { useState } from "react";
import Modal from "../../../../components/Modal/Modal";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import ImageLightbox from "../../../../components/Lightbox/ImageLightbox";
import { resolveImageUrl } from "../utils/resolveImageUrl";
import { MAX_COLORS } from "../constants/productColorImages";
import type useColorImages from "../hooks/ui/useColorImages";

type ColorImagesModalProps = {
    colorImages: ReturnType<typeof useColorImages>;
};

/**
 * Same two-phase flow as MultiAngleImagesModal (pick, then watch each tile resolve
 * independently), applied to the product's own colors instead of a fixed angle
 * list. The picking phase itself has two shapes: 4 or fewer colors need no picking
 * at all — every one is pre-selected and this is purely a confirmation — while more
 * than 4 requires the owner to actually choose up to MAX_COLORS.
 */
const ColorImagesModal = ({ colorImages }: ColorImagesModalProps) => {
    const {
        isOpen,
        close,
        hasMainImage,
        hasColors,
        colors,
        needsPicking,
        selectedColors,
        toggleColor,
        results,
        isGenerating,
        generate,
        creditsRemaining,
        includedInPlan,
    } = colorImages;

    const [lightboxUrl, setLightboxUrl] = useState<string | undefined>(undefined);

    const isPicking = !results;
    const settledCount = results?.filter((result) => result.status !== "pending").length ?? 0;
    const doneCount = results?.filter((result) => result.status === "done").length ?? 0;

    const outOfCredits = !includedInPlan && creditsRemaining !== undefined && creditsRemaining <= 0;

    const costLabel = includedInPlan
        ? "Included in your plan."
        : selectedColors.length === 0
            ? `1 credit per color — pick up to ${MAX_COLORS}.`
            : `This will use ${selectedColors.length} credit${selectedColors.length === 1 ? "" : "s"} (1 per color).`;

    return (
        <>
            <Modal isOpen={isOpen} onClose={close}>
                <Modal.Header>
                    <h2>Add images with colors</h2>
                </Modal.Header>

                <Modal.Body>
                    {isPicking ? (
                        <>
                            {!hasMainImage ? (
                                <p className="business-dashboard-form-error" role="alert">
                                    Add a main image first — there's nothing to generate colors from yet.
                                </p>
                            ) : !hasColors ? (
                                <p className="business-dashboard-form-error" role="alert">
                                    Add at least one product color first.
                                </p>
                            ) : (
                                <>
                                    <p className="business-dashboard-form-hint">
                                        {needsPicking
                                            ? `This product has ${colors.length} colors — pick up to ${MAX_COLORS} to generate a photo for.`
                                            : "The AI generates a new photo in each of these colors, reusing your product's existing images where possible and its main image otherwise."}
                                    </p>

                                    <div className="angle-picker-grid">
                                        {colors.map((hex) => {
                                            const isSelected = selectedColors.includes(hex);
                                            const isDisabled =
                                                needsPicking && !isSelected && selectedColors.length >= MAX_COLORS;

                                            return (
                                                <button
                                                    key={hex}
                                                    type="button"
                                                    className={`color-chip${isSelected ? " color-chip--selected" : ""}${needsPicking ? "" : " color-chip--static"}`}
                                                    onClick={needsPicking ? () => toggleColor(hex) : undefined}
                                                    disabled={isDisabled}
                                                    aria-pressed={isSelected}
                                                >
                                                    <span
                                                        className="color-chip__swatch"
                                                        style={{ backgroundColor: hex }}
                                                        aria-hidden="true"
                                                    />
                                                    {hex}
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
                                <div key={result.hex} className="product-image-tile angle-result-tile">
                                    {result.status === "pending" && (
                                        <div className="angle-result-tile__pending">
                                            <Spinner size={28} />
                                        </div>
                                    )}

                                    {result.status === "done" && result.url && (
                                        <img
                                            src={resolveImageUrl(result.url)}
                                            alt={`Product in ${result.hex}`}
                                            className="product-image-tile__preview"
                                            onClick={() => setLightboxUrl(resolveImageUrl(result.url!))}
                                        />
                                    )}

                                    {result.status === "error" && (
                                        <div className="angle-result-tile__error">{result.error}</div>
                                    )}

                                    <span
                                        className="business-dashboard-badge angle-result-tile__label angle-result-tile__label--color"
                                        style={{ backgroundColor: result.hex }}
                                    >
                                        {result.hex}
                                    </span>
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
                                disabled={!hasMainImage || !hasColors || selectedColors.length === 0 || outOfCredits}
                            >
                                {needsPicking ? "Generate" : "Confirm"}
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

export default ColorImagesModal;
