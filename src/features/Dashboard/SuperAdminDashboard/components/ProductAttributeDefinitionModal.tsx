import Modal from "../../../../components/Modal/Modal";
import useDomains from "../../../Auth/AcceptInvitation/hooks/data/useDomains";
import type useAdminProductFieldsPage from "../hooks/useAdminProductFieldsPage";
import type { ProductAttributeValueType } from "../types";

const VALUE_TYPES: ProductAttributeValueType[] = ["Text", "Number", "Boolean", "TextList", "ColorList"];

type ProductAttributeDefinitionModalProps = {
    page: ReturnType<typeof useAdminProductFieldsPage>;
};

const ProductAttributeDefinitionModal = ({ page }: ProductAttributeDefinitionModalProps) => {
    const { data: domains, isLoading: domainsLoading } = useDomains();

    const {
        isModalOpen,
        isEditing,
        createValues,
        editValues,
        errors,
        isSaving,
        close,
        changeCreate,
        changeEdit,
        submit,
    } = page;

    return (
        <Modal isOpen={isModalOpen} onClose={close}>
            <Modal.Header>
                <h2>{isEditing ? "Edit product field" : "Add product field"}</h2>
            </Modal.Header>

            <Modal.Body>
                <form
                    className="dashboard-form-grid"
                    onSubmit={(e) => {
                        e.preventDefault();
                        submit();
                    }}
                >
                    {!isEditing && (
                        <>
                            <div>
                                <label className="dashboard-invite-label" htmlFor="attr-domain">
                                    Domain
                                </label>
                                <select
                                    id="attr-domain"
                                    className="dashboard-invite-input"
                                    value={createValues.businessDomainId}
                                    onChange={(e) => changeCreate("businessDomainId", e.target.value)}
                                    disabled={isSaving || domainsLoading}
                                >
                                    <option value="">Select a domain...</option>
                                    {domains?.map((domain) => (
                                        <option key={domain.id} value={domain.id}>
                                            {domain.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="dashboard-invite-label" htmlFor="attr-key">
                                    Key
                                </label>
                                <input
                                    id="attr-key"
                                    className="dashboard-invite-input"
                                    type="text"
                                    value={createValues.key}
                                    onChange={(e) => changeCreate("key", e.target.value)}
                                    placeholder="countryOfOrigin"
                                    disabled={isSaving}
                                />
                                {errors.key && (
                                    <p className="dashboard-invite-error" role="alert">
                                        {errors.key}
                                    </p>
                                )}
                            </div>
                        </>
                    )}

                    <div>
                        <label className="dashboard-invite-label" htmlFor="attr-label">
                            Label
                        </label>
                        <input
                            id="attr-label"
                            className="dashboard-invite-input"
                            type="text"
                            value={isEditing ? editValues.label : createValues.label}
                            onChange={(e) =>
                                isEditing ? changeEdit("label", e.target.value) : changeCreate("label", e.target.value)
                            }
                            placeholder="Country of origin"
                            disabled={isSaving}
                        />
                        {errors.label && (
                            <p className="dashboard-invite-error" role="alert">
                                {errors.label}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="dashboard-invite-label" htmlFor="attr-value-type">
                            Value type
                        </label>
                        <select
                            id="attr-value-type"
                            className="dashboard-invite-input"
                            value={isEditing ? editValues.valueType : createValues.valueType}
                            onChange={(e) => {
                                const value = e.target.value as ProductAttributeValueType;
                                if (isEditing) {
                                    changeEdit("valueType", value);
                                } else {
                                    changeCreate("valueType", value);
                                }
                            }}
                            disabled={isSaving}
                        >
                            {VALUE_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="dashboard-invite-label" htmlFor="attr-allowed-values">
                            Allowed values (optional, comma-separated)
                        </label>
                        <input
                            id="attr-allowed-values"
                            className="dashboard-invite-input"
                            type="text"
                            value={isEditing ? editValues.allowedValuesInput : createValues.allowedValuesInput}
                            onChange={(e) =>
                                isEditing
                                    ? changeEdit("allowedValuesInput", e.target.value)
                                    : changeCreate("allowedValuesInput", e.target.value)
                            }
                            placeholder="Small, Medium, Large"
                            disabled={isSaving}
                        />
                    </div>

                    <div>
                        <label className="dashboard-invite-label" htmlFor="attr-display-order">
                            Display order
                        </label>
                        <input
                            id="attr-display-order"
                            className="dashboard-invite-input"
                            type="number"
                            min={0}
                            step={1}
                            value={isEditing ? editValues.displayOrder : createValues.displayOrder}
                            onChange={(e) =>
                                isEditing
                                    ? changeEdit("displayOrder", e.target.value)
                                    : changeCreate("displayOrder", e.target.value)
                            }
                            disabled={isSaving}
                        />
                    </div>

                    <div className="dashboard-invite-checkbox-row">
                        <label className="dashboard-invite-label" htmlFor="attr-required">
                            <input
                                id="attr-required"
                                type="checkbox"
                                checked={isEditing ? editValues.isRequired : createValues.isRequired}
                                onChange={(e) =>
                                    isEditing
                                        ? changeEdit("isRequired", e.target.checked)
                                        : changeCreate("isRequired", e.target.checked)
                                }
                                disabled={isSaving}
                            />{" "}
                            Required
                        </label>
                    </div>
                </form>
            </Modal.Body>

            <Modal.Footer>
                <div className="dashboard-modal-actions">
                    <button type="button" className="dashboard-modal-cancel-btn" onClick={close} disabled={isSaving}>
                        Cancel
                    </button>

                    <button type="button" className="dashboard-modal-primary-btn" onClick={submit} disabled={isSaving}>
                        {isSaving ? "Saving..." : isEditing ? "Save changes" : "Add field"}
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default ProductAttributeDefinitionModal;
