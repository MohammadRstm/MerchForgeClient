import Modal from "../../../../components/Modal/Modal";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { resolveImageUrl } from "../../BusinessOwnerDashboard/utils/resolveImageUrl";
import type useWebsiteTemplateDetailModal from "../hooks/ui/useWebsiteTemplateDetailModal";
import { WEBSITE_CUSTOMIZABLE_FIELD_CATALOGUE } from "../websiteCustomizableFieldCatalogue";

type WebsiteTemplateDetailModalProps = {
    modal: ReturnType<typeof useWebsiteTemplateDetailModal>;
};

const CATALOGUE_CATEGORIES = [...new Set(WEBSITE_CUSTOMIZABLE_FIELD_CATALOGUE.map((entry) => entry.category))];

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
        confirmingDelete,
        isDeleting,
        close,
        startEdit,
        cancelEdit,
        changeField,
        uploadImage,
        submitEdit,
        requestDelete,
        cancelDelete,
        confirmDelete,

        componentsLoading,
        componentsError,
        isFieldActive,
        toggleCatalogueField,
        isTogglingCatalogueField,
    } = modal;

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

                        <dl className="website-request-detail__grid">
                            <dt>Domain</dt>
                            <dd>{template.domainName}</dd>

                            <dt>Status</dt>
                            <dd>{template.isActive ? "Active" : "Inactive"}</dd>

                            <dt>Display order</dt>
                            <dd>{template.displayOrder}</dd>

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
                        </dl>

                        <img
                            src={resolveImageUrl(template.previewImageUrl)}
                            alt={`${template.label} preview`}
                            className="dashboard-template-image-preview"
                        />

                        <div className="website-request-detail__notes">
                            <span className="website-request-detail__notes-label">
                                Businesses using this template ({template.businesses.length})
                            </span>
                            {template.businesses.length === 0 ? (
                                <p className="dashboard-table-message">No businesses are live on this template yet.</p>
                            ) : (
                                <ul className="dashboard-template-businesses-list">
                                    {template.businesses.map((b) => (
                                        <li key={b.id}>
                                            {b.name} <code>{b.id}</code>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="website-request-detail__notes">
                            <span className="website-request-detail__notes-label">Customizable fields</span>

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

                        {confirmingDelete ? (
                            <div className="website-request-detail__actions">
                                <p className="dashboard-invite-error">
                                    Delete "{template.label}"? It will be hidden from new template requests, but
                                    kept on record for businesses already using it.
                                </p>
                                <div className="dashboard-modal-actions">
                                    <button
                                        type="button"
                                        className="dashboard-modal-cancel-btn"
                                        onClick={cancelDelete}
                                        disabled={isDeleting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="dashboard-modal-confirm-btn"
                                        onClick={confirmDelete}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? "Deleting..." : "Delete template"}
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
                        {template && !confirmingDelete && (
                            <>
                                <button type="button" className="dashboard-action-btn" onClick={requestDelete}>
                                    Delete
                                </button>
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
