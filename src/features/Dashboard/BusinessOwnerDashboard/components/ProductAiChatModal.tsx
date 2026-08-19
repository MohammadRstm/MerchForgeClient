import { useEffect, useRef } from "react";
import Modal from "../../../../components/Modal/Modal";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type useProductAiChat from "../hooks/ui/useProductAiChat";
import { resolveImageUrl } from "./ProductImageDropzone";

type ProductAiChatModalProps = {
    chat: ReturnType<typeof useProductAiChat>;
};

const currencyFormatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
});

/**
 * Presentation for the AI conversation. Holds no workflow logic: what to offer is
 * read off the draft's status and canConfirm, both decided by the backend.
 */
const ProductAiChatModal = ({ chat }: ProductAiChatModalProps) => {
    const {
        isOpen,
        cancel,
        draft,
        isStarting,
        isBusy,
        isConfirming,
        error,
        messageInput,
        setMessageInput,
        sendMessage,
        attachImage,
        resolveImage,
        confirm,
        voice,
    } = chat;

    const imageInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Keeps the newest turn in view as the conversation grows.
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [draft?.messages.length]);

    const awaitingImageApproval = draft?.status === "WaitingForImageApproval";
    const isFinished = draft?.status === "Completed" || draft?.status === "Cancelled";

    return (
        <Modal isOpen={isOpen} onClose={cancel}>
            <Modal.Header>
                <h2>Fill with AI</h2>
            </Modal.Header>

            <Modal.Body>
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
                                            🎤
                                        </span>
                                    )}
                                    <span>{message.text}</span>
                                </div>
                            ))}

                            {isBusy && !isConfirming && (
                                <div className="ai-chat__message ai-chat__message--assistant ai-chat__message--pending">
                                    <Spinner size={16} />
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

                        {draft.draft && (
                            <div className="ai-chat__preview" data-testid="ai-preview">
                                <p className="business-dashboard-form-section">Product so far</p>

                                <dl className="ai-chat__preview-grid">
                                    <dt>Title</dt>
                                    <dd>{draft.draft.title ?? "—"}</dd>

                                    <dt>Description</dt>
                                    <dd>{draft.draft.description ?? "—"}</dd>

                                    <dt>Price</dt>
                                    <dd>
                                        {draft.draft.price != null
                                            ? currencyFormatter.format(draft.draft.price)
                                            : "—"}
                                    </dd>

                                    <dt>Category</dt>
                                    <dd>{draft.draft.categoryName ?? "—"}</dd>

                                    {draft.draft.metadata &&
                                        Object.entries(draft.draft.metadata).map(([key, value]) => (
                                            <div key={key} style={{ display: "contents" }}>
                                                <dt>{key}</dt>
                                                <dd>
                                                    {Array.isArray(value)
                                                        ? value.join(", ")
                                                        : String(value)}
                                                </dd>
                                            </div>
                                        ))}
                                </dl>

                                {draft.missingFields.length > 0 && (
                                    <p className="business-dashboard-form-hint">
                                        Still needed: {draft.missingFields.join(", ")}
                                    </p>
                                )}
                            </div>
                        )}

                        {error && (
                            <p className="business-dashboard-form-error" role="alert">
                                {error}
                            </p>
                        )}

                        {!isFinished && !awaitingImageApproval && (
                            <div className="ai-chat__composer">
                                <button
                                    type="button"
                                    className="business-dashboard-button-ghost"
                                    onClick={() => imageInputRef.current?.click()}
                                    disabled={isBusy}
                                    title="Attach a product photo"
                                >
                                    📎
                                </button>

                                {voice.isSupported && (
                                    <button
                                        type="button"
                                        className={`business-dashboard-button-ghost${
                                            voice.isRecording ? " ai-chat__record--active" : ""
                                        }`}
                                        onClick={voice.isRecording ? voice.stop : voice.start}
                                        disabled={isBusy}
                                        title={voice.isRecording ? "Stop recording" : "Record a voice message"}
                                    >
                                        {voice.isRecording ? "■" : "🎤"}
                                    </button>
                                )}

                                <input
                                    className="business-dashboard-form-input"
                                    placeholder={
                                        voice.isRecording ? "Recording…" : "Describe your product…"
                                    }
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                    disabled={isBusy || voice.isRecording}
                                    aria-label="Message"
                                />

                                <button
                                    type="button"
                                    className="business-dashboard-button-primary"
                                    onClick={sendMessage}
                                    disabled={isBusy || !messageInput.trim()}
                                >
                                    Send
                                </button>

                                <input
                                    ref={imageInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    hidden
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) attachImage(file);
                                        e.target.value = "";
                                    }}
                                />
                            </div>
                        )}

                        {voice.error && (
                            <p className="business-dashboard-form-error" role="alert">
                                {voice.error}
                            </p>
                        )}
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer>
                <button type="button" className="business-dashboard-button-secondary" onClick={cancel}>
                    Cancel
                </button>

                {/* Gated on the backend's canConfirm, never on the assistant saying it
                    looks done — creating the product is always an explicit action. */}
                <button
                    type="button"
                    className="business-dashboard-button-primary"
                    onClick={confirm}
                    disabled={!draft?.canConfirm || isBusy}
                >
                    {isConfirming ? "Creating…" : "Create product"}
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProductAiChatModal;
