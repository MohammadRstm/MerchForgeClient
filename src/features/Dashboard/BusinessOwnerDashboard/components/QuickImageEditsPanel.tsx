import { FiX } from "react-icons/fi";
import type useQuickImageEdits from "../hooks/ui/useQuickImageEdits";
import { QUICK_IMAGE_EDIT_ACTIONS } from "../constants/quickImageEdits";
import { resolveImageUrl } from "../utils/resolveImageUrl";
import AiCreditBadge from "./AiCreditBadge";

type QuickImageEditsPanelProps = {
    quickEdits: ReturnType<typeof useQuickImageEdits>;
};

/**
 * Shown in the same slot ImageEditChatPanel occupies. Picking happens directly on
 * the real gallery tiles (see ProductImagesField's isSelectingForEdit), so this
 * panel itself only ever shows a hint + live cost line while picking, then a
 * per-image progress list once confirmed — there's no separate results grid,
 * since each result already updates its own gallery tile live via replaceImage.
 */
const QuickImageEditsPanel = ({ quickEdits }: QuickImageEditsPanelProps) => {
    const {
        isOpen,
        isSelecting,
        actionKey,
        close,
        selectedUrls,
        results,
        isGenerating,
        confirm,
        creditsRemaining,
        creditsGrantedTotal,
        includedInPlan,
        outOfCredits,
    } = quickEdits;

    if (!isOpen || !actionKey) return null;

    const action = QUICK_IMAGE_EDIT_ACTIONS[actionKey];
    const settledCount = results?.filter((result) => result.status !== "pending").length ?? 0;
    const doneCount = results?.filter((result) => result.status === "done").length ?? 0;

    return (
        <div className="modal-container ai-chat-card">
            <button
                type="button"
                className="modal-cancel-button"
                onClick={close}
                aria-label={`Close ${action.label.toLowerCase()}`}
                disabled={isGenerating}
            >
                <FiX />
            </button>

            <div className="modal-header">
                <div className="ai-chat-card__header-row">
                    <h2>{action.label}</h2>
                    <AiCreditBadge
                        creditsRemaining={creditsRemaining}
                        creditsGrantedTotal={creditsGrantedTotal}
                        includedInPlan={includedInPlan}
                    />
                </div>
            </div>

            <div className="ai-chat-card__body">
                {isSelecting ? (
                    <p
                        className={outOfCredits ? "business-dashboard-form-error" : "image-edit-chat__selection-hint"}
                        role={outOfCredits ? "alert" : undefined}
                    >
                        {outOfCredits
                            ? "You're out of AI image-editing credits. Buy more from Features to continue."
                            : selectedUrls.size === 0
                              ? "Select the image(s) to update below."
                              : `${selectedUrls.size} image${selectedUrls.size === 1 ? "" : "s"} selected — ${selectedUrls.size} credit${selectedUrls.size === 1 ? "" : "s"} (1 per image).`}
                    </p>
                ) : (
                    <ul className="quick-image-edits__progress">
                        {results?.map((result) => (
                            <li
                                key={result.url}
                                className={`quick-image-edits__progress-item quick-image-edits__progress-item--${result.status}`}
                            >
                                <img src={resolveImageUrl(result.url)} alt="" />
                                <span>
                                    {result.status === "pending" && "Updating…"}
                                    {result.status === "done" && "Done"}
                                    {result.status === "error" && (result.error ?? "Couldn't update this image.")}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="ai-chat-card__composer">
                {isSelecting ? (
                    <button
                        type="button"
                        className="business-dashboard-button-primary"
                        onClick={confirm}
                        disabled={selectedUrls.size === 0 || outOfCredits}
                    >
                        Confirm
                    </button>
                ) : (
                    <button
                        type="button"
                        className="business-dashboard-button-primary"
                        onClick={close}
                        disabled={isGenerating}
                    >
                        {isGenerating
                            ? `Updating… (${settledCount}/${results?.length ?? 0})`
                            : `Done — ${doneCount} of ${results?.length ?? 0} updated`}
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuickImageEditsPanel;
