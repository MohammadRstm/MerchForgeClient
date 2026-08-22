import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { FiMic, FiSquare, FiX } from "react-icons/fi";
import type useImageEditChat from "../hooks/ui/useImageEditChat";
import AiCreditBadge from "./AiCreditBadge";

type ImageEditChatPanelProps = {
    chat: ReturnType<typeof useImageEditChat>;
};

/**
 * The image-edit card, shown in the same slot AiChatPanel occupies — the two are
 * mutually exclusive, never both open. Styled the same way (message log, pinned
 * composer, voice waveform) even though there's no real conversation underneath:
 * each submission is one or more independent edit calls, not a multi-turn exchange
 * with the model.
 */
const ImageEditChatPanel = ({ chat }: ImageEditChatPanelProps) => {
    const {
        close,
        selectedUrls,
        messages,
        messageInput,
        setMessageInput,
        sendMessage,
        isProcessing,
        progress,
        error,
        voice,
        creditsRemaining,
        includedInPlan,
    } = chat;

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    return (
        <div className="modal-container ai-chat-card">
            <button
                type="button"
                className="modal-cancel-button"
                onClick={close}
                aria-label="Close image editing"
                disabled={isProcessing}
            >
                <FiX />
            </button>

            <div className="modal-header">
                <div className="ai-chat-card__header-row">
                    <h2>Edit images</h2>
                    <AiCreditBadge creditsRemaining={creditsRemaining} includedInPlan={includedInPlan} />
                </div>
            </div>

            <div className="ai-chat-card__body">
                <div className="ai-chat">
                    <div className="ai-chat__messages" data-testid="image-edit-messages">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`ai-chat__message ai-chat__message--${message.role}`}
                            >
                                {message.kind === "voice" && (
                                    <span className="ai-chat__kind" title="Sent as a voice message">
                                        <FiMic />
                                    </span>
                                )}
                                <span>{message.text}</span>
                            </div>
                        ))}

                        {isProcessing && (
                            <div className="ai-chat__message ai-chat__message--assistant ai-chat__message--pending">
                                <span className="ai-chat__typing" aria-label="Editing">
                                    <span />
                                    <span />
                                    <span />
                                </span>
                                {progress && progress.total > 1 && (
                                    <span className="image-edit-chat__progress">
                                        {progress.done}/{progress.total}
                                    </span>
                                )}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <p className="image-edit-chat__selection-hint">
                        {selectedUrls.size === 0
                            ? "No images selected yet — click one or more below."
                            : `${selectedUrls.size} image${selectedUrls.size === 1 ? "" : "s"} selected.`}
                    </p>

                    {error && (
                        <p className="business-dashboard-form-error" role="alert">
                            {error}
                        </p>
                    )}

                    {voice.error && (
                        <p className="business-dashboard-form-error" role="alert">
                            {voice.error}
                        </p>
                    )}
                </div>
            </div>

            <div className="ai-chat-card__composer">
                {voice.isSupported && (
                    <button
                        type="button"
                        className={`business-dashboard-button-ghost${
                            voice.isRecording ? " ai-chat__record--active" : ""
                        }`}
                        onClick={voice.isRecording ? voice.stop : voice.start}
                        disabled={isProcessing || selectedUrls.size === 0}
                        title={voice.isRecording ? "Stop recording" : "Record a voice message"}
                        aria-label={voice.isRecording ? "Stop recording" : "Record a voice message"}
                    >
                        {voice.isRecording ? <FiSquare /> : <FiMic />}
                    </button>
                )}

                {voice.isRecording ? (
                    <div className="ai-chat__recording" aria-live="polite">
                        <span className="ai-chat__recording-dot" />

                        <span className="ai-chat__recording-wave">
                            {voice.waveform.map((level, index) => (
                                <span key={index} style={{ "--level": level } as CSSProperties} />
                            ))}
                        </span>
                    </div>
                ) : (
                    <input
                        className="business-dashboard-form-input"
                        placeholder={
                            selectedUrls.size === 0 ? "Select an image below first…" : "Describe what to change…"
                        }
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        disabled={isProcessing || selectedUrls.size === 0}
                        aria-label="Edit instruction"
                    />
                )}

                <button
                    type="button"
                    className="business-dashboard-button-primary"
                    onClick={sendMessage}
                    disabled={isProcessing || voice.isRecording || selectedUrls.size === 0 || !messageInput.trim()}
                    hidden={voice.isRecording}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ImageEditChatPanel;
