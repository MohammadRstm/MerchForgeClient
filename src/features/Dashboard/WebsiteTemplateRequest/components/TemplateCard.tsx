import { useState } from "react";
import type { WebsiteTemplateOption } from "../../BusinessOwnerDashboard/types";
import { resolveImageUrl } from "../../BusinessOwnerDashboard/utils/resolveImageUrl";

type TemplateCardProps = {
    template: WebsiteTemplateOption;
    onSelect: (template: WebsiteTemplateOption) => void;
};

/** Falls back to a plain label if the preview image hasn't been uploaded yet (a template can exist before its screenshot does). */
const ImagePreview = ({ src, label }: { src: string; label: string }) => {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return <span className="template-card__image-fallback">Preview coming soon</span>;
    }

    return <img src={resolveImageUrl(src)} onError={() => setFailed(true)} alt={`${label} preview`} />;
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
            <div className="template-card__image">
                <ImagePreview src={template.previewImageUrl} label={template.label} />
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
