import { Link, useNavigate } from "react-router";
import Modal from "../../../../components/Modal/Modal";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { buildAdminBusinessDetailRoute, routes } from "../../../../config/routes";
import { resolveImageUrl } from "../../BusinessOwnerDashboard/utils/resolveImageUrl";
import type useWebsiteTemplateDetailModal from "../hooks/ui/useWebsiteTemplateDetailModal";
import { WEBSITE_CUSTOMIZABLE_FIELD_CATALOGUE } from "../websiteCustomizableFieldCatalogue";

type WebsiteTemplateDetailModalProps = {
    modal: ReturnType<typeof useWebsiteTemplateDetailModal>;
};

const CATALOGUE_CATEGORIES = [...new Set(WEBSITE_CUSTOMIZABLE_FIELD_CATALOGUE.map((entry) => entry.category))];

const REQUEST_STATUS_BADGE: Record<string, string> = {
    Pending: "dashboard-badge--warning",
    InProgress: "dashboard-badge--info",
    Closed: "dashboard-badge--success",
};

const timeAgo = (isoDate: string): string => {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const minutes = Math.round(diffMs / 60_000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

    const days = Math.round(hours / 24);
    if (days === 1) return "yesterday";
    if (days < 30) return `${days} days ago`;

    return new Date(isoDate).toLocaleDateString();
};

const WebsiteTemplateDetailModal = ({ modal }: WebsiteTemplateDetailModalProps) => {
    const {
        isOpen,
        template,
        isLoading,
        isError,
        mode,
        values,
        error,
        isUpdating,
        imageUploading,
        confirmingDeactivate,
        isDeactivating,
        isReactivating,
        close,
        startEdit,
        cancelEdit,
        changeField,
        uploadImage,
        submitEdit,
        requestDeactivate,
        cancelDeactivate,
        confirmDeactivate,
        reactivate,

        componentsLoading,
        componentsError,
        isFieldActive,
        toggleCatalogueField,
        isTogglingCatalogueField,

        requestsPage,
        requestsLoading,
        requestsError,

        activity,
        activityLoading,
        activityError,
    } = modal;

    const navigate = useNavigate();

    return (
        <Modal isOpen={isOpen} onClose={close}>
            <Modal.Header>
                <h2>{mode === "edit" ? "Edit website template" : "Website template"}</h2>
            </Modal.Header>

            <Modal.Body>
                {isLoading ? (
                    <div className="dashboard-table-loading">
                        <Spinner size={28} />
                    </div>
                ) : isError || !template ? (
                    <p className="dashboard-table-message dashboard-table-message--error">
                        Failed to load this template. Please try again.
                    </p>
                ) : mode === "edit" && values ? (
                    <form
                        className="dashboard-form-grid"
                        onSubmit={(e) => {
                            e.preventDefault();
                            submitEdit();
                        }}
                    >
                        <p className="dashboard-modal-text">
                            Name (<code>{template.name}</code>) and domain ({template.domainName}) can't be
                            changed after a template is created.
                        </p>

                        <div>
                            <label className="dashboard-invite-label" htmlFor="edit-template-label">
                                Label
                            </label>
                            <input
                                id="edit-template-label"
                                className="dashboard-invite-input"
                                type="text"
                                value={values.label}
                                onChange={(e) => changeField("label", e.target.value)}
                                disabled={isUpdating}
                            />
                        </div>

                        <div>
                            <label className="dashboard-invite-label" htmlFor="edit-template-image">
                                Preview image
                            </label>
                            <input
                                id="edit-template-image"
                                className="dashboard-invite-input"
                                type="file"
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) uploadImage(file);
                                    e.target.value = "";
                                }}
                                disabled={isUpdating || imageUploading}
                            />
                            {imageUploading && <p className="dashboard-modal-text">Uploading image...</p>}
                            {values.previewImageUrl && !imageUploading && (
                                <img
                                    src={resolveImageUrl(values.previewImageUrl)}
                                    alt="Template preview"
                                    className="dashboard-template-image-preview"
                                />
                            )}
                        </div>

                        <div>
                            <label className="dashboard-invite-label" htmlFor="edit-template-preview-website">
                                Preview website URL
                            </label>
                            <input
                                id="edit-template-preview-website"
                                className="dashboard-invite-input"
                                type="text"
                                value={values.previewWebsiteUrl}
                                onChange={(e) => changeField("previewWebsiteUrl", e.target.value)}
                                placeholder="https://fashion-02-demo.example.com (optional)"
                                disabled={isUpdating}
                            />
                        </div>

                        <div>
                            <label className="dashboard-invite-label" htmlFor="edit-template-order">
                                Display order
                            </label>
                            <input
                                id="edit-template-order"
                                className="dashboard-invite-input"
                                type="number"
                                min={0}
                                step={1}
                                value={values.displayOrder}
                                onChange={(e) => changeField("displayOrder", e.target.value)}
                                disabled={isUpdating}
                            />
                        </div>

                        {error && (
                            <p className="dashboard-invite-error" role="alert">
                                {error}
                            </p>
                        )}
                    </form>
                ) : (
                    <div className="website-request-detail">
                        <div className="website-request-detail__business">
                            <span className="website-request-detail__business-name">{template.label}</span>
                            <span className="website-request-detail__business-id">
                                <code>{template.name}</code>
                            </span>
                        </div>

                        <h4 className="dashboard-subsection-heading">Template Information</h4>
                        <dl className="website-request-detail__grid">
                            <dt>Domain</dt>
                            <dd>{template.domainName}</dd>

                            <dt>Status</dt>
                            <dd>
                                <span className={`dashboard-badge ${template.isActive ? "dashboard-badge--success" : "dashboard-badge--neutral"}`}>
                                    {template.isActive ? "Active" : "Inactive"}
                                </span>
                            </dd>

                            <dt>Display order</dt>
                            <dd>#{template.displayOrder}</dd>

                            <dt>Preview site</dt>
                            <dd>
                                {template.previewWebsiteUrl ? (
                                    <a href={template.previewWebsiteUrl} target="_blank" rel="noopener noreferrer">
                                        {template.previewWebsiteUrl}
                                    </a>
                                ) : (
                                    "—"
                                )}
                            </dd>

                            <dt>Created</dt>
                            <dd>{new Date(template.createdAt).toLocaleString()}</dd>

                            <dt>Updated</dt>
                            <dd>{new Date(template.updatedAt).toLocaleString()}</dd>
                        </dl>

                        <img
                            src={resolveImageUrl(template.previewImageUrl)}
                            alt={`${template.label} preview`}
                            className="dashboard-template-image-preview"
                        />

                        <h4 className="dashboard-subsection-heading">Usage</h4>
                        <dl className="website-request-detail__grid">
                            <dt>Businesses Using</dt>
                            <dd>{template.businesses.length}</dd>

                            <dt>Website Requests</dt>
                            <dd>{template.requestCount}</dd>

                            <dt>Customizable Sections</dt>
                            <dd>{template.activeCustomizableComponentCount}</dd>
                        </dl>

                        <div className="website-request-detail__notes">
                            <span className="website-request-detail__notes-label">
                                Businesses using this template ({template.businesses.length})
                            </span>
                            {template.businesses.length === 0 ? (
                                <p className="dashboard-table-message">No businesses are currently using this template.</p>
                            ) : (
                                <ul className="recent-activity-list">
                                    {template.businesses.map((b) => (
                                        <li key={b.id}>
                                            <Link to={buildAdminBusinessDetailRoute(b.id)} className="dashboard-inline-link">
                                                {b.name}
                                            </Link>
                                            <span className="dashboard-table-muted">
                                                {b.chosenAt ? `Chosen ${new Date(b.chosenAt).toLocaleDateString()}` : ""}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="website-request-detail__notes">
                            <span className="website-request-detail__notes-label">Template Requests</span>
                            {requestsLoading ? (
                                <div className="dashboard-table-loading">
                                    <Spinner size={20} />
                                </div>
                            ) : requestsError ? (
                                <p className="dashboard-table-message dashboard-table-message--error">
                                    Unable to load requests for this template.
                                </p>
                            ) : !requestsPage || requestsPage.items.length === 0 ? (
                                <p className="dashboard-table-message">No website requests have been submitted for this template.</p>
                            ) : (
                                <ul className="recent-activity-list">
                                    {requestsPage.items.map((request) => (
                                        <li key={request.id}>
                                            <button
                                                type="button"
                                                className="dashboard-inline-link-btn"
                                                onClick={() => navigate(`${routes.ADMIN_WEBSITE_REQUESTS}?requestId=${request.id}`)}
                                            >
                                                {request.businessName}
                                            </button>
                                            <span className={`dashboard-badge ${REQUEST_STATUS_BADGE[request.status] ?? "dashboard-badge--neutral"}`}>
                                                {request.status}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="website-request-detail__notes">
                            <span className="website-request-detail__notes-label">Customizable Components</span>

                            <p className="dashboard-table-message" style={{ textAlign: "left", padding: 0 }}>
                                Check what this template's own storefront code actually reads from a business's
                                saved customization values — inspect the template's source before checking a box,
                                since nothing here changes the template's code itself.
                            </p>

                            {componentsLoading ? (
                                <div className="dashboard-table-loading">
                                    <Spinner size={24} />
                                </div>
                            ) : componentsError ? (
                                <p className="dashboard-table-message dashboard-table-message--error">
                                    Failed to load this template's customizable fields. Please try again.
                                </p>
                            ) : (
                                <div className="website-template-field-catalogue">
                                    {CATALOGUE_CATEGORIES.map((category) => (
                                        <fieldset key={category} className="website-template-field-catalogue__group">
                                            <legend>{category}</legend>
                                            {WEBSITE_CUSTOMIZABLE_FIELD_CATALOGUE.filter((entry) => entry.category === category).map(
                                                (entry) => (
                                                    <label
                                                        key={entry.key}
                                                        className="website-template-field-catalogue__item"
                                                        htmlFor={`field-${entry.key}`}
                                                    >
                                                        <input
                                                            id={`field-${entry.key}`}
                                                            type="checkbox"
                                                            checked={isFieldActive(entry.key)}
                                                            onChange={() => toggleCatalogueField(entry)}
                                                            disabled={isTogglingCatalogueField}
                                                        />
                                                        <span>
                                                            <span className="website-template-field-catalogue__label">
                                                                {entry.label}
                                                            </span>
                                                            <span className="website-template-field-catalogue__description">
                                                                {entry.description}
                                                            </span>
                                                        </span>
                                                    </label>
                                                )
                                            )}
                                        </fieldset>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="website-request-detail__notes">
                            <span className="website-request-detail__notes-label">Recent Activity</span>
                            {activityLoading ? (
                                <div className="dashboard-table-loading">
                                    <Spinner size={20} />
                                </div>
                            ) : activityError ? (
                                <p className="dashboard-table-message dashboard-table-message--error">
                                    Unable to load recent activity.
                                </p>
                            ) : activity.length === 0 ? (
                                <p className="dashboard-table-message">No security activity recorded yet.</p>
                            ) : (
                                <ul className="recent-activity-list">
                                    {activity.map((entry) => (
                                        <li key={entry.id}>
                                            <span>{entry.description}</span>
                                            <span className="dashboard-table-muted">{timeAgo(entry.createdAt)}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {confirmingDeactivate ? (
                            <div className="website-request-detail__actions">
                                <p className="dashboard-invite-error">
                                    This template is currently used by {template.businesses.length} business
                                    {template.businesses.length === 1 ? "" : "es"}. Existing businesses using this
                                    template will not be changed — it will only become unavailable for new selections.
                                </p>
                                <div className="dashboard-modal-actions">
                                    <button
                                        type="button"
                                        className="dashboard-modal-cancel-btn"
                                        onClick={cancelDeactivate}
                                        disabled={isDeactivating}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="dashboard-modal-confirm-btn"
                                        onClick={confirmDeactivate}
                                        disabled={isDeactivating}
                                    >
                                        {isDeactivating ? "Deactivating..." : "Deactivate"}
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer>
                {mode === "edit" ? (
                    <div className="dashboard-modal-actions">
                        <button type="button" className="dashboard-modal-cancel-btn" onClick={cancelEdit} disabled={isUpdating}>
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="dashboard-modal-primary-btn"
                            onClick={submitEdit}
                            disabled={isUpdating || imageUploading}
                        >
                            {isUpdating ? "Saving..." : "Save changes"}
                        </button>
                    </div>
                ) : (
                    <div className="dashboard-modal-actions">
                        <button type="button" className="dashboard-modal-cancel-btn" onClick={close}>
                            Close
                        </button>
                        {template && !confirmingDeactivate && (
                            <>
                                {template.isActive ? (
                                    <button type="button" className="dashboard-action-btn" onClick={requestDeactivate}>
                                        Deactivate
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="dashboard-action-btn"
                                        onClick={reactivate}
                                        disabled={isReactivating}
                                    >
                                        {isReactivating ? "Reactivating..." : "Reactivate"}
                                    </button>
                                )}
                                <button type="button" className="dashboard-modal-primary-btn" onClick={startEdit}>
                                    Edit
                                </button>
                            </>
                        )}
                    </div>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default WebsiteTemplateDetailModal;
