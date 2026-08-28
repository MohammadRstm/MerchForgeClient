import { ApiError } from "../../../../Error/ApiError";
import { resolveImageUrl } from "../utils/resolveImageUrl";
import useUploadWebsiteCustomizationImage from "../hooks/data/useUploadWebsiteCustomizationImage";
import type { WebsiteCustomizationImageKind } from "../../../../services/api/businessDashboard.api";

type WebsiteCustomizationImageFieldProps = {
    /** Unique across the page — logo/favicon/each template image field all render this component at once. */
    fieldId: string;
    businessId: string;
    kind: WebsiteCustomizationImageKind;
    label: string;
    value: string;
    onChange: (url: string) => void;
    helpText?: string;
    optional?: boolean;
};

/**
 * One image upload + preview + remove control, reused for the logo, the favicon, and
 * any Image-typed template field — the exact same two-step "upload, then reference
 * the returned URL" pattern already used for product images and template preview
 * images, just pointed at the website-customization upload endpoint.
 */
const WebsiteCustomizationImageField = ({
    fieldId,
    businessId,
    kind,
    label,
    value,
    onChange,
    helpText,
    optional = true,
}: WebsiteCustomizationImageFieldProps) => {
    const { mutate: upload, isPending: uploading, error: uploadErrorRaw } = useUploadWebsiteCustomizationImage(businessId);

    const uploadError =
        uploadErrorRaw instanceof ApiError
            ? uploadErrorRaw.message
            : uploadErrorRaw
              ? "Couldn't upload that image."
              : undefined;

    return (
        <div className="business-dashboard-form-field">
            <label className="business-dashboard-form-label" htmlFor={fieldId}>
                {label}
                {optional && <span className="business-dashboard-form-optional"> (optional)</span>}
            </label>

            <input
                id={fieldId}
                className="business-dashboard-form-input"
                type="file"
                accept={kind === "Favicon" ? "image/png,image/x-icon,image/vnd.microsoft.icon" : "image/jpeg,image/png,image/gif,image/webp"}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        upload({ file, kind }, { onSuccess: ({ imageUrl }) => onChange(imageUrl) });
                    }
                    e.target.value = "";
                }}
                disabled={uploading}
            />

            {uploading && <p className="business-dashboard-form-hint">Uploading...</p>}
            {uploadError && <p className="business-dashboard-form-error">{uploadError}</p>}

            {value && !uploading && (
                <div className="website-customization-image-preview-row">
                    <img src={resolveImageUrl(value)} alt={label} className="website-customization-image-preview" />
                    <button type="button" className="business-dashboard-button-ghost" onClick={() => onChange("")}>
                        Remove
                    </button>
                </div>
            )}

            {helpText && <p className="business-dashboard-form-hint">{helpText}</p>}
        </div>
    );
};

export default WebsiteCustomizationImageField;
