import "./BusinessOwnerDashboard.css";
import { Link } from "react-router";
import { routes } from "../../../config/routes";
import Spinner from "../../../components/LoadingSpinner/LoadingSpinner";
import useOwnerWebsiteCustomizationPage from "./hooks/useOwnerWebsiteCustomizationPage";
import WebsiteCustomizationImageField from "./components/WebsiteCustomizationImageField";
import WebsiteCustomizationHoursField from "./components/WebsiteCustomizationHoursField";
import WebsiteCustomizationTemplateField from "./components/WebsiteCustomizationTemplateField";

const SOCIAL_PLATFORMS = [
    { key: "facebook", label: "Facebook" },
    { key: "instagram", label: "Instagram" },
    { key: "twitter", label: "Twitter / X" },
    { key: "tikTok", label: "TikTok" },
    { key: "youTube", label: "YouTube" },
    { key: "linkedIn", label: "LinkedIn" },
] as const;

const OwnerWebsiteCustomizationPage = () => {
    const {
        businessId,
        websiteUrl,
        previewUrl,
        catalogue,
        catalogueLoading,
        draft,
        draftLoading,
        draftError,
        form,
        isSaving,
        saveError,
        save,
        isPublishing,
        publishError,
        publishChanges,
    } = useOwnerWebsiteCustomizationPage();

    const isLoading = draftLoading || catalogueLoading;

    return (
        <main className="business-dashboard-page">
            <div className="business-dashboard-page-header">
                <div>
                    <Link to={routes.DASHBOARD_WEBSITE} className="business-dashboard-back-link">
                        &larr; Website & Templates
                    </Link>
                    <h1 className="business-dashboard-heading">Customize your website</h1>
                </div>

                <div className="business-dashboard-header-actions">
                    {previewUrl && (
                        <a
                            href={previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="business-dashboard-button-secondary"
                        >
                            Preview
                        </a>
                    )}

                    <button
                        type="button"
                        className="business-dashboard-button-secondary"
                        onClick={save}
                        disabled={isSaving || isLoading}
                    >
                        {isSaving ? "Saving..." : "Save draft"}
                    </button>

                    <button
                        type="button"
                        className="business-dashboard-button-primary"
                        onClick={publishChanges}
                        disabled={isPublishing || isLoading || !websiteUrl}
                        title={websiteUrl ? undefined : "Your website isn't live yet"}
                    >
                        {isPublishing ? "Publishing..." : "Publish"}
                    </button>
                </div>
            </div>

            {saveError && (
                <p className="business-dashboard-form-error" role="alert">
                    {saveError}
                </p>
            )}
            {publishError && (
                <p className="business-dashboard-form-error" role="alert">
                    {publishError}
                </p>
            )}
            {!websiteUrl && (
                <p className="business-dashboard-table-message">
                    Your website isn't live yet, so Publish and Preview aren't available — but you can still save a
                    draft now and publish once it is.
                </p>
            )}

            {isLoading ? (
                <div className="business-dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : draftError || !draft ? (
                <p className="business-dashboard-table-message business-dashboard-table-message--error">
                    Failed to load your website customization. Please try again.
                </p>
            ) : (
                <>
                    <section className="business-dashboard-table-card">
                        <div className="business-dashboard-table-header">
                            <h3>Branding</h3>
                        </div>

                        <div className="business-dashboard-form">
                            <div className="business-dashboard-form-row">
                                <WebsiteCustomizationImageField
                                    fieldId="customization-logo"
                                    businessId={businessId}
                                    kind="Logo"
                                    label="Logo"
                                    value={form.values.logoUrl}
                                    onChange={(url) => form.setField("logoUrl", url)}
                                />

                                <WebsiteCustomizationImageField
                                    fieldId="customization-favicon"
                                    businessId={businessId}
                                    kind="Favicon"
                                    label="Favicon"
                                    value={form.values.faviconUrl}
                                    onChange={(url) => form.setField("faviconUrl", url)}
                                    helpText="Shown in the browser tab. Square images work best."
                                />
                            </div>

                            <div className="business-dashboard-form-row">
                                <div className="business-dashboard-form-field">
                                    <label className="business-dashboard-form-label" htmlFor="customization-tagline">
                                        Tagline
                                        <span className="business-dashboard-form-optional"> (optional)</span>
                                    </label>
                                    <input
                                        id="customization-tagline"
                                        className="business-dashboard-form-input"
                                        type="text"
                                        value={form.values.tagline}
                                        onChange={(e) => form.setField("tagline", e.target.value)}
                                        placeholder="A short line under your logo"
                                    />
                                </div>

                                <div className="business-dashboard-form-field">
                                    <label className="business-dashboard-form-label">
                                        Brand color
                                        <span className="business-dashboard-form-optional"> (optional)</span>
                                    </label>
                                    <div className="website-customization-color-row">
                                        <input
                                            type="color"
                                            value={/^#[0-9A-Fa-f]{6}$/.test(form.values.primaryColor) ? form.values.primaryColor : "#000000"}
                                            onChange={(e) => form.setField("primaryColor", e.target.value)}
                                        />
                                        <input
                                            className="business-dashboard-form-input"
                                            type="text"
                                            placeholder="#000000"
                                            value={form.values.primaryColor}
                                            onChange={(e) => form.setField("primaryColor", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="business-dashboard-form-field">
                                <label className="business-dashboard-form-label" htmlFor="customization-description">
                                    About
                                    <span className="business-dashboard-form-optional"> (optional)</span>
                                </label>
                                <textarea
                                    id="customization-description"
                                    className="business-dashboard-form-input business-dashboard-form-textarea"
                                    rows={3}
                                    value={form.values.description}
                                    onChange={(e) => form.setField("description", e.target.value)}
                                />
                            </div>
                        </div>
                    </section>

                    <section className="business-dashboard-table-card">
                        <div className="business-dashboard-table-header">
                            <h3>Contact & address</h3>
                        </div>

                        <div className="business-dashboard-form">
                            <div className="business-dashboard-form-row">
                                <div className="business-dashboard-form-field">
                                    <label className="business-dashboard-form-label" htmlFor="customization-email">
                                        Contact email
                                        <span className="business-dashboard-form-optional"> (optional)</span>
                                    </label>
                                    <input
                                        id="customization-email"
                                        className="business-dashboard-form-input"
                                        type="email"
                                        value={form.values.contactEmail}
                                        onChange={(e) => form.setField("contactEmail", e.target.value)}
                                    />
                                </div>

                                <div className="business-dashboard-form-field">
                                    <label className="business-dashboard-form-label" htmlFor="customization-phone">
                                        Contact phone
                                        <span className="business-dashboard-form-optional"> (optional)</span>
                                    </label>
                                    <input
                                        id="customization-phone"
                                        className="business-dashboard-form-input"
                                        type="text"
                                        value={form.values.contactPhone}
                                        onChange={(e) => form.setField("contactPhone", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="business-dashboard-form-field">
                                <label className="business-dashboard-form-label" htmlFor="customization-whatsapp">
                                    WhatsApp number
                                    <span className="business-dashboard-form-optional"> (optional)</span>
                                </label>
                                <input
                                    id="customization-whatsapp"
                                    className="business-dashboard-form-input"
                                    type="text"
                                    value={form.values.whatsAppNumber}
                                    onChange={(e) => form.setField("whatsAppNumber", e.target.value)}
                                    placeholder="+15551234567"
                                />
                                <span className="business-dashboard-form-hint">
                                    Digits only, with a country code — not a wa.me link.
                                </span>
                            </div>

                            <div className="business-dashboard-form-row">
                                <div className="business-dashboard-form-field">
                                    <label className="business-dashboard-form-label" htmlFor="customization-address1">
                                        Address line 1
                                        <span className="business-dashboard-form-optional"> (optional)</span>
                                    </label>
                                    <input
                                        id="customization-address1"
                                        className="business-dashboard-form-input"
                                        type="text"
                                        value={form.values.addressLine1}
                                        onChange={(e) => form.setField("addressLine1", e.target.value)}
                                    />
                                </div>

                                <div className="business-dashboard-form-field">
                                    <label className="business-dashboard-form-label" htmlFor="customization-address2">
                                        Address line 2
                                        <span className="business-dashboard-form-optional"> (optional)</span>
                                    </label>
                                    <input
                                        id="customization-address2"
                                        className="business-dashboard-form-input"
                                        type="text"
                                        value={form.values.addressLine2}
                                        onChange={(e) => form.setField("addressLine2", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="business-dashboard-form-row">
                                <div className="business-dashboard-form-field">
                                    <label className="business-dashboard-form-label" htmlFor="customization-city">
                                        City
                                        <span className="business-dashboard-form-optional"> (optional)</span>
                                    </label>
                                    <input
                                        id="customization-city"
                                        className="business-dashboard-form-input"
                                        type="text"
                                        value={form.values.city}
                                        onChange={(e) => form.setField("city", e.target.value)}
                                    />
                                </div>

                                <div className="business-dashboard-form-field">
                                    <label className="business-dashboard-form-label" htmlFor="customization-state">
                                        State / region
                                        <span className="business-dashboard-form-optional"> (optional)</span>
                                    </label>
                                    <input
                                        id="customization-state"
                                        className="business-dashboard-form-input"
                                        type="text"
                                        value={form.values.state}
                                        onChange={(e) => form.setField("state", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="business-dashboard-form-row">
                                <div className="business-dashboard-form-field">
                                    <label className="business-dashboard-form-label" htmlFor="customization-postal">
                                        Postal code
                                        <span className="business-dashboard-form-optional"> (optional)</span>
                                    </label>
                                    <input
                                        id="customization-postal"
                                        className="business-dashboard-form-input"
                                        type="text"
                                        value={form.values.postalCode}
                                        onChange={(e) => form.setField("postalCode", e.target.value)}
                                    />
                                </div>

                                <div className="business-dashboard-form-field">
                                    <label className="business-dashboard-form-label" htmlFor="customization-country">
                                        Country
                                        <span className="business-dashboard-form-optional"> (optional)</span>
                                    </label>
                                    <input
                                        id="customization-country"
                                        className="business-dashboard-form-input"
                                        type="text"
                                        value={form.values.country}
                                        onChange={(e) => form.setField("country", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="business-dashboard-table-card">
                        <div className="business-dashboard-table-header">
                            <h3>Social links</h3>
                        </div>

                        <div className="business-dashboard-form">
                            <div className="business-dashboard-form-row">
                                {SOCIAL_PLATFORMS.map(({ key, label }) => (
                                    <div className="business-dashboard-form-field" key={key}>
                                        <label className="business-dashboard-form-label" htmlFor={`customization-social-${key}`}>
                                            {label}
                                            <span className="business-dashboard-form-optional"> (optional)</span>
                                        </label>
                                        <input
                                            id={`customization-social-${key}`}
                                            className="business-dashboard-form-input"
                                            type="text"
                                            placeholder="https://..."
                                            value={form.values.socialLinks[key]}
                                            onChange={(e) => form.setSocialLink(key, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="business-dashboard-table-card">
                        <div className="business-dashboard-table-header">
                            <h3>Business hours</h3>
                        </div>

                        <WebsiteCustomizationHoursField value={form.values.businessHours} onChange={form.setBusinessHoursDay} />
                    </section>

                    {catalogue.length > 0 && (
                        <section className="business-dashboard-table-card">
                            <div className="business-dashboard-table-header">
                                <h3>Template customization</h3>
                            </div>

                            <div className="business-dashboard-form">
                                {catalogue.map((field) => (
                                    <WebsiteCustomizationTemplateField
                                        key={field.id}
                                        businessId={businessId}
                                        field={field}
                                        value={form.values.templateFields[field.key] ?? ""}
                                        onChange={(value) => form.setTemplateField(field.key, value)}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </main>
    );
};

export default OwnerWebsiteCustomizationPage;
