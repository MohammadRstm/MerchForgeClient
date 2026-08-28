import WebsiteCustomizationImageField from "./WebsiteCustomizationImageField";
import type { WebsiteCustomizationTemplateFieldValue, WebsiteTemplateCustomizableComponent } from "../types";

type WebsiteCustomizationTemplateFieldProps = {
    businessId: string;
    field: WebsiteTemplateCustomizableComponent;
    value: WebsiteCustomizationTemplateFieldValue;
    onChange: (value: WebsiteCustomizationTemplateFieldValue) => void;
};

/**
 * Renders the input that matches a template-field's declared ValueType — the
 * type-aware capability system's frontend half. Same role as ProductModal's
 * MetadataField for product metadata, one switch per WebsiteCustomizableValueType
 * instead of ProductValueType.
 */
const WebsiteCustomizationTemplateField = ({ businessId, field, value, onChange }: WebsiteCustomizationTemplateFieldProps) => {
    const fieldId = `template-field-${field.key}`;
    const optionalSuffix = !field.isRequired && (
        <span className="business-dashboard-form-optional"> (optional)</span>
    );

    if (field.valueType === "Boolean") {
        return (
            <label className="business-dashboard-form-checkbox">
                <input type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} />
                <span>{field.label}</span>
            </label>
        );
    }

    if (field.valueType === "Image") {
        return (
            <WebsiteCustomizationImageField
                fieldId={fieldId}
                businessId={businessId}
                kind="TemplateImage"
                label={field.label}
                value={typeof value === "string" ? value : ""}
                onChange={onChange}
                helpText={field.helpText ?? undefined}
                optional={!field.isRequired}
            />
        );
    }

    if (field.valueType === "Link") {
        const link = typeof value === "object" && value !== null ? value : { text: "", url: "" };

        return (
            <div className="business-dashboard-form-field">
                <label className="business-dashboard-form-label">
                    {field.label}
                    {optionalSuffix}
                </label>

                <input
                    id={fieldId}
                    className="business-dashboard-form-input"
                    type="text"
                    placeholder="Button text"
                    value={link.text}
                    onChange={(e) => onChange({ ...link, text: e.target.value })}
                />

                <input
                    className="business-dashboard-form-input"
                    type="text"
                    placeholder="https://..."
                    value={link.url}
                    onChange={(e) => onChange({ ...link, url: e.target.value })}
                />

                {field.helpText && <p className="business-dashboard-form-hint">{field.helpText}</p>}
            </div>
        );
    }

    if (field.valueType === "Select") {
        const textValue = typeof value === "string" ? value : "";

        return (
            <div className="business-dashboard-form-field">
                <label className="business-dashboard-form-label" htmlFor={fieldId}>
                    {field.label}
                    {optionalSuffix}
                </label>

                <select
                    id={fieldId}
                    className="business-dashboard-form-input"
                    value={textValue}
                    onChange={(e) => onChange(e.target.value)}
                >
                    <option value="">Select...</option>
                    {field.allowedValues.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

                {field.helpText && <p className="business-dashboard-form-hint">{field.helpText}</p>}
            </div>
        );
    }

    if (field.valueType === "Color") {
        const textValue = typeof value === "string" ? value : "";

        return (
            <div className="business-dashboard-form-field">
                <label className="business-dashboard-form-label" htmlFor={fieldId}>
                    {field.label}
                    {optionalSuffix}
                </label>

                <div className="website-customization-color-row">
                    <input
                        type="color"
                        value={/^#[0-9A-Fa-f]{6}$/.test(textValue) ? textValue : "#000000"}
                        onChange={(e) => onChange(e.target.value)}
                    />
                    <input
                        id={fieldId}
                        className="business-dashboard-form-input"
                        type="text"
                        placeholder="#000000"
                        value={textValue}
                        onChange={(e) => onChange(e.target.value)}
                    />
                </div>

                {field.helpText && <p className="business-dashboard-form-hint">{field.helpText}</p>}
            </div>
        );
    }

    const textValue = typeof value === "string" ? value : "";

    return (
        <div className="business-dashboard-form-field">
            <label className="business-dashboard-form-label" htmlFor={fieldId}>
                {field.label}
                {optionalSuffix}
            </label>

            {field.valueType === "Textarea" ? (
                <textarea
                    id={fieldId}
                    className="business-dashboard-form-input business-dashboard-form-textarea"
                    rows={3}
                    value={textValue}
                    onChange={(e) => onChange(e.target.value)}
                />
            ) : (
                <input
                    id={fieldId}
                    className="business-dashboard-form-input"
                    type={field.valueType === "Number" ? "number" : field.valueType === "Url" ? "url" : "text"}
                    value={textValue}
                    onChange={(e) => onChange(e.target.value)}
                />
            )}

            {field.helpText && <p className="business-dashboard-form-hint">{field.helpText}</p>}
        </div>
    );
};

export default WebsiteCustomizationTemplateField;
