import type { CSSProperties } from "react";
import { FiMic, FiSquare, FiX } from "react-icons/fi";
import type useVoiceProductDraft from "../hooks/ui/useVoiceProductDraft";
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
 * card: one button, bottom-left of the footer, beside Cancel/Create. Press it to
 * start a draft and begin recording; the extracted fields mirror live into the
 * real form (see ProductModal's aiDraftProduct effect), same as before — this
 * only changes how a turn is sent, not what happens with the result.
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
    const showCreditTracker = isActive && !isFinished;

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
            {/* Stacked above the button, credit tracker first (topmost) then the
                audio tracker (closest to the button) — never restacked the other
                way, so the credit ring stays in the same spot whether or not a
                recording is in progress. */}
            <div className="voice-product-button__stack">
                {showCreditTracker && (
                    <div className="voice-product-button__pill voice-product-button__controls">
                        <AiCreditBadge
                            creditsRemaining={creditsRemaining}
                            creditsGrantedTotal={creditsGrantedTotal}
                            includedInPlan={includedInPlan}
                            tooltipAlign="start"
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

            </div>

            <button
                type="button"
                className={`business-dashboard-button-secondary voice-product-button__fab${
                    voice.isRecording ? " voice-product-button__fab--recording" : ""
                }`}
                onClick={handlePress}
                disabled={disabled}
                title={
                    !voice.isSupported
                        ? "Voice recording isn't supported in this browser."
                        : voice.isRecording
                          ? "Stop recording"
                          : isThinking
                            ? "Processing your recording…"
                            : "Add product details with your voice"
                }
            >
                {voice.isRecording ? (
                    <>
                        <FiSquare /> Stop
                    </>
                ) : isThinking ? (
                    <>
                        <span className="voice-product-button__spinner" aria-hidden="true" /> Processing…
                    </>
                ) : (
                    <>
                        Add with <FiMic />
                    </>
                )}
            </button>

            {!voice.isRecording && !isThinking && (error || voice.error) && (
                <p className="voice-product-button__error" role="alert">
                    {error ?? voice.error}
                </p>
            )}
        </div>
    );
};

export default VoiceProductButton;
