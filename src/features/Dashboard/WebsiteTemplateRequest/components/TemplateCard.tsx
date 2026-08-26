import { useState } from "react";
import type { WebsiteTemplateOption } from "../../BusinessOwnerDashboard/types";

type TemplateCardProps = {
    template: WebsiteTemplateOption;
    onSelect: (template: WebsiteTemplateOption) => void;
};

/** Plays the preview on hover; falls back to a plain label if the video hasn't been uploaded yet (a template can exist before its recording does). */
const VideoPreview = ({ src, label }: { src: string; label: string }) => {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return <span className="template-card__video-fallback">Preview coming soon</span>;
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

const TemplateCard = ({ template, onSelect }: TemplateCardProps) => {
    const openPreview = (event: React.MouseEvent) => {
        event.stopPropagation();

        if (template.previewWebsiteUrl) {
            window.open(template.previewWebsiteUrl, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <article className="template-card">
            <div className="template-card__video">
                <VideoPreview src={template.videoPreviewUrl} label={template.label} />
            </div>

            <div className="template-card__footer">
                <span className="template-card__label">{template.label}</span>

                <div className="template-card__actions">
                    <button
                        type="button"
                        className="template-card__preview-btn"
                        onClick={openPreview}
                        disabled={!template.previewWebsiteUrl}
                        title={template.previewWebsiteUrl ? "Open a live preview in a new tab" : "Preview coming soon"}
                    >
                        Preview
                    </button>
                    <button type="button" className="template-card__select-btn" onClick={() => onSelect(template)}>
                        Select
                    </button>
                </div>
            </div>
        </article>
    );
};

export default TemplateCard;
