import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { FiMic, FiSquare, FiX } from "react-icons/fi";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type useProductAiChat from "../hooks/ui/useProductAiChat";
import { resolveImageUrl } from "../utils/resolveImageUrl";

type AiChatPanelProps = {
    chat: ReturnType<typeof useProductAiChat>;
};

const formatElapsed = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

/**
 * The AI conversation, rendered as its own card beside the product form rather
 * than replacing it. Holds no workflow logic: what to offer is read off the
 * draft's status and canConfirm, both decided by the backend. Creating the
 * product is not this panel's job — that button lives on the form card, since
 * confirming is really "the form is done," whether AI or the owner filled it.
 */
const AiChatPanel = ({ chat }: AiChatPanelProps) => {
    const {
        cancel,
        draft,
        isStarting,
        isBusy,
        isConfirming,
        error,
        pendingMessage,
        messageInput,
        setMessageInput,
        sendMessage,
        resolveImage,
        voice,
    } = chat;

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Keeps the newest turn in view as the conversation grows — including the
    // instant the owner's own message appears, before the assistant has replied.
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [draft?.messages.length, pendingMessage]);

    const awaitingImageApproval = draft?.status === "WaitingForImageApproval";
    const isFinished = draft?.status === "Completed" || draft?.status === "Cancelled";

    return (
        <div className="modal-container ai-chat-card">
            <button
                type="button"
                className="modal-cancel-button"
                onClick={cancel}
                aria-label="Close AI assistant"
            >
                <FiX />
            </button>

            <div className="modal-header">
                <h2>Fill with AI</h2>
            </div>

            <div className="ai-chat-card__body">
                {isStarting ? (
                    <div className="business-dashboard-table-loading">
                        <Spinner size={28} />
                    </div>
                ) : !draft ? (
                    <p className="business-dashboard-form-error" role="alert">
                        {error ?? "The assistant isn't available right now."}
                    </p>
                ) : (
                    <div className="ai-chat">
                        <div className="ai-chat__messages" data-testid="ai-messages">
                            {draft.messages.map((message, index) => (
                                <div
                                    key={`${message.at}-${index}`}
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

                            {pendingMessage && (
                                <div className="ai-chat__message ai-chat__message--user">
                                    {pendingMessage.kind === "voice" && (
                                        <span className="ai-chat__kind" title="Sent as a voice message">
                                            <FiMic />
                                        </span>
                                    )}
                                    <span>{pendingMessage.text}</span>
                                </div>
                            )}

                            {isBusy && !isConfirming && (
                                <div className="ai-chat__message ai-chat__message--assistant ai-chat__message--pending">
                                    <span className="ai-chat__typing" aria-label="Assistant is typing">
                                        <span />
                                        <span />
                                        <span />
                                    </span>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {draft.originalImageUrl && !awaitingImageApproval && (
                            <div className="ai-chat__image" data-testid="ai-image">
                                <img src={resolveImageUrl(draft.originalImageUrl)} alt="Product" />
                            </div>
                        )}

                        {/* The edited image is a proposal — shown beside the original so
                            the owner can compare before deciding. */}
                        {awaitingImageApproval && draft.processedImageUrl && (
                            <div className="ai-chat__image-approval" data-testid="ai-image-approval">
                                <p className="business-dashboard-form-label">
                                    {draft.imageModificationPrompt ?? "Updated image"}
                                </p>

                                <div className="ai-chat__image-compare">
                                    {draft.originalImageUrl && (
                                        <figure>
                                            <img src={resolveImageUrl(draft.originalImageUrl)} alt="Original" />
                                            <figcaption>Original</figcaption>
                                        </figure>
                                    )}
                                    <figure>
                                        <img src={resolveImageUrl(draft.processedImageUrl)} alt="Updated" />
                                        <figcaption>Updated</figcaption>
                                    </figure>
                                </div>

                                <div className="ai-chat__image-actions">
                                    <button
                                        type="button"
                                        className="business-dashboard-button-primary"
                                        onClick={() => resolveImage(true)}
                                        disabled={isBusy}
                                    >
                                        Use updated image
                                    </button>
                                    <button
                                        type="button"
                                        className="business-dashboard-button-secondary"
                                        onClick={() => resolveImage(false)}
                                        disabled={isBusy}
                                    >
                                        Keep original
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* The AI's understanding is visible where it actually matters — the
                            form fields fill in live as the conversation progresses — so this
                            card only needs to say what's still missing, not restate every
                            field already derived. */}
                        {draft.missingFields.length > 0 && (
                            <p className="business-dashboard-form-hint" data-testid="ai-missing-fields">
                                Still needed: {draft.missingFields.join(", ")}
                            </p>
                        )}

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
                )}
            </div>

            {draft && !isFinished && !awaitingImageApproval && (
                <div className="ai-chat-card__composer">
                    {voice.isSupported && (
                        <button
                            type="button"
                            className={`business-dashboard-button-ghost${
                                voice.isRecording ? " ai-chat__record--active" : ""
                            }`}
                            onClick={voice.isRecording ? voice.stop : voice.start}
                            disabled={isBusy}
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
                                    <span
                                        key={index}
                                        style={{ "--level": level } as CSSProperties}
                                    />
                                ))}
                            </span>

                            <span className="ai-chat__recording-time">{formatElapsed(voice.elapsedMs)}</span>
                        </div>
                    ) : (
                        <input
                            className="business-dashboard-form-input"
                            placeholder="Describe your product…"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                            disabled={isBusy}
                            aria-label="Message"
                        />
                    )}

                    <button
                        type="button"
                        className="business-dashboard-button-primary"
                        onClick={sendMessage}
                        disabled={isBusy || voice.isRecording || !messageInput.trim()}
                        hidden={voice.isRecording}
                    >
                        Send
                    </button>
                </div>
            )}
        </div>
    );
};

export default AiChatPanel;
