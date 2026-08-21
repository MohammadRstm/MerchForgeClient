import { useState } from "react";
import Modal from "../../../../components/Modal/Modal";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type useWebsiteTemplateModal from "../hooks/ui/useWebsiteTemplateModal";

type ChooseWebsiteTemplateModalProps = {
    modal: ReturnType<typeof useWebsiteTemplateModal>;
};

/** Plays the preview on hover; falls back to a plain label if the video hasn't been uploaded yet (a template can exist before its recording does). */
const VideoPreview = ({ src, label }: { src: string; label: string }) => {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return <span className="website-template-card__video-fallback">Preview coming soon</span>;
    }

    return (
        <video
            src={src}
            muted
            loop
            playsInline
            onError={() => setFailed(true)}
            onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
            onMouseLeave={(e) => e.currentTarget.pause()}
            aria-label={`${label} preview`}
        />
    );
};

/**
 * A grid of template cards, each a video preview + name. Deliberately no link to the
 * live template anywhere here — a business owner picks by what it looks like, not by
 * clicking through to someone else's demo site.
 */
const ChooseWebsiteTemplateModal = ({ modal }: ChooseWebsiteTemplateModalProps) => {
    const { status, isOpen, selectedId, error, isPending, close, select, confirm } = modal;

    return (
        <Modal isOpen={isOpen} onClose={close}>
            <Modal.Header>
                <h2>Choose a website template</h2>
            </Modal.Header>

            <Modal.Body>
                <p className="business-dashboard-form-hint">
                    {status ? <>Templates available for {status.domainName} businesses.</> : "Loading templates..."}
                </p>

                {status && status.available.length === 0 && (
                    <p className="business-dashboard-table-message">
                        No templates are available for your domain yet. Check back soon.
                    </p>
                )}

                <div className="website-template-grid">
                    {status?.available.map((template) => (
                        <button
                            type="button"
                            key={template.id}
                            className={`website-template-card ${selectedId === template.id ? "website-template-card--selected" : ""}`}
                            onClick={() => select(template.id)}
                        >
                            <span className="website-template-card__video-placeholder">
                                <VideoPreview src={template.videoPreviewUrl} label={template.label} />
                            </span>
                            <span className="website-template-card__label">{template.label}</span>
                        </button>
                    ))}
                </div>

                {error && (
                    <p className="business-dashboard-form-error" role="alert">
                        {error}
                    </p>
                )}
            </Modal.Body>

            <Modal.Footer>
                <button type="button" className="business-dashboard-button-secondary" onClick={close} disabled={isPending}>
                    Cancel
                </button>
                <button
                    type="button"
                    className="business-dashboard-button-primary"
                    onClick={confirm}
                    disabled={isPending || !selectedId}
                >
                    {isPending ? (
                        <>
                            <Spinner size={16} /> Saving...
                        </>
                    ) : (
                        "Use this template"
                    )}
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default ChooseWebsiteTemplateModal;
