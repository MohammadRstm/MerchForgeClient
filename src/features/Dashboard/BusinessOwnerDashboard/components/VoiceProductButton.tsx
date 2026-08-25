import type { CSSProperties } from "react";
import { FiMic, FiSquare, FiX } from "react-icons/fi";
import type useVoiceProductDraft from "../hooks/ui/useVoiceProductDraft";
import formatMissingField from "../utils/formatMissingField";
import AiCreditBadge from "./AiCreditBadge";

type VoiceProductButtonProps = {
    voiceDraft: ReturnType<typeof useVoiceProductDraft>;
};

const formatElapsed = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

/**
 * The whole AI product-creation entry point, replacing the old side-by-side chat
 * card: one floating button, bottom-right of the form. Press it to start a draft
 * and begin recording; the extracted fields mirror live into the real form (see
 * ProductModal's aiDraftProduct effect), same as before — this only changes how a
 * turn is sent, not what happens with the result.
 *
 * Voice is the only input, so there is no text composer here at all — pressing the
 * button while a draft is already active starts another recorded turn instead of
 * opening anything.
 */
const VoiceProductButton = ({ voiceDraft }: VoiceProductButtonProps) => {
    const {
        isActive,
        start,
        cancel,
        draft,
        isBusy,
        isConfirming,
        error,
        creditsRemaining,
        creditsGrantedTotal,
        includedInPlan,
        voice,
    } = voiceDraft;

    const isFinished = draft?.status === "Completed" || draft?.status === "Cancelled";
    const isThinking = isActive && isBusy && !isConfirming && !voice.isRecording;

    const handlePress = () => {
        if (voice.isRecording) {
            voice.stop();
            return;
        }

        if (isActive) {
            voice.start();
            return;
        }

        start();
    };

    const disabled = !voice.isSupported || isFinished || (isBusy && !voice.isRecording);

    return (
        <div className="voice-product-button">
            {voice.isRecording && (
                <div className="voice-product-button__pill ai-chat__recording" aria-live="polite">
                    <span className="ai-chat__recording-dot" />

                    <span className="ai-chat__recording-wave">
                        {voice.waveform.map((level, index) => (
                            <span key={index} style={{ "--level": level } as CSSProperties} />
                        ))}
                    </span>

                    <span className="ai-chat__recording-time">{formatElapsed(voice.elapsedMs)}</span>
                </div>
            )}

            {isThinking && (
                <div className="voice-product-button__pill voice-product-button__status">
                    <span className="ai-chat__typing" aria-label="Assistant is thinking">
                        <span />
                        <span />
                        <span />
                    </span>
                </div>
            )}

            {isActive && !voice.isRecording && !isThinking && draft && draft.missingFields.length > 0 && (
                <p className="voice-product-button__pill business-dashboard-form-hint">
                    Still needed: {draft.missingFields.map(formatMissingField).join(", ")}
                </p>
            )}

            {(error || voice.error) && (
                <p className="voice-product-button__pill business-dashboard-form-error" role="alert">
                    {error ?? voice.error}
                </p>
            )}

            {isActive && !isFinished && (
                <div className="voice-product-button__controls">
                    <AiCreditBadge
                        creditsRemaining={creditsRemaining}
                        creditsGrantedTotal={creditsGrantedTotal}
                        includedInPlan={includedInPlan}
                    />
                    <button
                        type="button"
                        className="voice-product-button__discard"
                        onClick={cancel}
                        disabled={voice.isRecording}
                        aria-label="Discard AI draft"
                        title="Discard AI draft"
                    >
                        <FiX />
                    </button>
                </div>
            )}

            <button
                type="button"
                className={`voice-product-button__fab${voice.isRecording ? " voice-product-button__fab--recording" : ""}`}
                onClick={handlePress}
                disabled={disabled}
                aria-label={voice.isRecording ? "Stop recording" : "Describe your product with your voice"}
                title={
                    !voice.isSupported
                        ? "Voice recording isn't supported in this browser."
                        : voice.isRecording
                          ? "Stop recording"
                          : "Describe your product with your voice"
                }
            >
                {voice.isRecording ? <FiSquare /> : <FiMic />}
            </button>
        </div>
    );
};

export default VoiceProductButton;
