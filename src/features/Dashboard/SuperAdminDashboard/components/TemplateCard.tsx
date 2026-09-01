import { useState } from "react";
import { resolveImageUrl } from "../../BusinessOwnerDashboard/utils/resolveImageUrl";
import type { WebsiteTemplateResponse } from "../types";

type TemplateCardProps = {
    template: WebsiteTemplateResponse;
    onOpen: () => void;
};

const TemplateCard = ({ template, onOpen }: TemplateCardProps) => {
    const [imageFailed, setImageFailed] = useState(false);

    return (
        <div className="template-card" onClick={onOpen} role="button" tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpen();
                }
            }}
        >
            <div className="template-card-preview">
                {imageFailed ? (
                    <div className="template-card-preview-placeholder">
                        <span>{template.label}</span>
                    </div>
                ) : (
                    <img
                        src={resolveImageUrl(template.previewImageUrl)}
                        alt={`${template.label} preview`}
                        loading="lazy"
                        onError={() => setImageFailed(true)}
                    />
                )}
            </div>

            <div className="template-card-body">
                <div className="template-card-title-row">
                    <h3>{template.label}</h3>
                    <span className={`dashboard-badge ${template.isActive ? "dashboard-badge--success" : "dashboard-badge--neutral"}`}>
                        {template.isActive ? "Active" : "Inactive"}
                    </span>
                </div>
                <span className="dashboard-table-muted">{template.domainName}</span>

                {template.activeCustomizableComponentCount > 0 && (
                    <span className="dashboard-table-muted">
                        {template.activeCustomizableComponentCount} customizable section
                        {template.activeCustomizableComponentCount === 1 ? "" : "s"}
                    </span>
                )}

                <div className="template-card-stats">
                    <span>{template.businessesUsingIt} business{template.businessesUsingIt === 1 ? "" : "es"}</span>
                    <span>{template.requestCount} request{template.requestCount === 1 ? "" : "s"}</span>
                </div>

                <div className="template-card-actions">
                    {template.previewWebsiteUrl ? (
                        <a
                            href={template.previewWebsiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="dashboard-action-btn"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Preview
                        </a>
                    ) : (
                        <span className="dashboard-action-btn" style={{ opacity: 0.5, cursor: "default" }}>
                            No preview
                        </span>
                    )}
                    <button type="button" className="dashboard-action-btn" onClick={(e) => { e.stopPropagation(); onOpen(); }}>
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TemplateCard;
