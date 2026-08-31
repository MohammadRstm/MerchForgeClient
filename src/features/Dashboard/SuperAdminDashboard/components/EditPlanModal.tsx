import Modal from "../../../../components/Modal/Modal";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type useEditPlanModal from "../hooks/ui/useEditPlanModal";

type EditPlanModalProps = {
    modal: ReturnType<typeof useEditPlanModal>;
};

const EditPlanModal = ({ modal }: EditPlanModalProps) => {
    if (!modal.group || !modal.values) {
        return <Modal isOpen={false} onClose={modal.close}><Modal.Body>{null}</Modal.Body></Modal>;
    }

    const { group, values } = modal;

    if (modal.confirmStep) {
        return (
            <Modal isOpen={modal.isOpen} onClose={modal.close}>
                <Modal.Header>
                    <h2>Confirm changes to {group.name}</h2>
                </Modal.Header>
                <Modal.Body>
                    <p className="dashboard-table-message" style={{ textAlign: "left", padding: 0, marginBottom: 12 }}>
                        This plan currently has <strong>{group.totalActiveSubscriberCount}</strong> active
                        subscriber{group.totalActiveSubscriberCount === 1 ? "" : "s"}. Changes apply to them
                        immediately — there's no grandfathering.
                    </p>

                    <dl className="business-detail-grid">
                        {modal.changeSummary.map((change) => (
                            <div key={change.label}>
                                <dt>{change.label}</dt>
                                <dd>{change.from} → {change.to}</dd>
                            </div>
                        ))}
                    </dl>

                    {modal.error && (
                        <p className="dashboard-invite-error" role="alert">
                            {modal.error}
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <div className="dashboard-modal-actions">
                        <button type="button" className="dashboard-modal-cancel-btn" onClick={modal.cancelConfirm} disabled={modal.isSaving}>
                            Back
                        </button>
                        <button type="button" className="dashboard-modal-primary-btn" onClick={modal.commitSave} disabled={modal.isSaving}>
                            {modal.isSaving ? "Saving..." : "Confirm Change"}
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <Modal isOpen={modal.isOpen} onClose={modal.close}>
            <Modal.Header>
                <h2>Edit {group.name}</h2>
            </Modal.Header>

            <Modal.Body>
                <form
                    className="dashboard-form-grid"
                    onSubmit={(e) => {
                        e.preventDefault();
                        modal.requestSave();
                    }}
                >
                    <h4 className="dashboard-subsection-heading">General</h4>

                    <div>
                        <label className="dashboard-invite-label" htmlFor="edit-plan-name">
                            Name
                        </label>
                        <input
                            id="edit-plan-name"
                            className="dashboard-invite-input"
                            type="text"
                            value={values.name}
                            onChange={(e) => modal.changeField("name", e.target.value)}
                            disabled={modal.isSaving}
                        />
                    </div>

                    <div>
                        <label className="dashboard-invite-label" htmlFor="edit-plan-description">
                            Description
                        </label>
                        <input
                            id="edit-plan-description"
                            className="dashboard-invite-input"
                            type="text"
                            value={values.description}
                            onChange={(e) => modal.changeField("description", e.target.value)}
                            placeholder="Optional"
                            disabled={modal.isSaving}
                        />
                    </div>

                    <h4 className="dashboard-subsection-heading">Pricing</h4>

                    <div>
                        <label className="dashboard-invite-label" htmlFor="edit-plan-currency">
                            Currency
                        </label>
                        <input
                            id="edit-plan-currency"
                            className="dashboard-invite-input"
                            type="text"
                            maxLength={3}
                            value={values.currency}
                            onChange={(e) => modal.changeField("currency", e.target.value.toUpperCase())}
                            disabled={modal.isSaving}
                        />
                    </div>

                    <div>
                        <label className="dashboard-invite-label" htmlFor="edit-plan-monthly-price">
                            Monthly price
                        </label>
                        <input
                            id="edit-plan-monthly-price"
                            className="dashboard-invite-input"
                            type="number"
                            min={0}
                            step={0.01}
                            value={values.monthlyPrice}
                            onChange={(e) => modal.changeField("monthlyPrice", e.target.value)}
                            disabled={modal.isSaving || !group.monthly}
                            placeholder={group.monthly ? undefined : "No monthly option"}
                        />
                    </div>

                    <div>
                        <label className="dashboard-invite-label" htmlFor="edit-plan-yearly-price">
                            Yearly price
                        </label>
                        <input
                            id="edit-plan-yearly-price"
                            className="dashboard-invite-input"
                            type="number"
                            min={0}
                            step={0.01}
                            value={values.yearlyPrice}
                            onChange={(e) => modal.changeField("yearlyPrice", e.target.value)}
                            disabled={modal.isSaving || !group.yearly}
                            placeholder={group.yearly ? undefined : "No yearly option"}
                        />
                    </div>

                    <h4 className="dashboard-subsection-heading">Features</h4>

                    {modal.features.length === 0 ? (
                        <div className="dashboard-table-loading">
                            <Spinner size={24} />
                        </div>
                    ) : (
                        <div className="subscription-plan-feature-picker">
                            {modal.features.map((feature) => {
                                const checked = feature.id in values.selectedFeatures;

                                return (
                                    <div key={feature.id} className="subscription-plan-feature-picker__item">
                                        <label htmlFor={`edit-feature-${feature.id}`}>
                                            <input
                                                id={`edit-feature-${feature.id}`}
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() => modal.toggleFeature(feature.id)}
                                                disabled={modal.isSaving}
                                            />
                                            <span>
                                                <span className="subscription-plan-feature-picker__name">{feature.name}</span>
                                                {feature.description && (
                                                    <span className="subscription-plan-feature-picker__description">
                                                        {feature.description}
                                                    </span>
                                                )}
                                            </span>
                                        </label>

                                        {checked && (
                                            <input
                                                className="dashboard-invite-input subscription-plan-feature-picker__limit"
                                                type="number"
                                                min={1}
                                                step={1}
                                                placeholder="Unlimited"
                                                value={values.selectedFeatures[feature.id]}
                                                onChange={(e) => modal.setFeatureLimit(feature.id, e.target.value)}
                                                disabled={modal.isSaving}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {modal.error && (
                        <p className="dashboard-invite-error" role="alert">
                            {modal.error}
                        </p>
                    )}
                </form>
            </Modal.Body>

            <Modal.Footer>
                <div className="dashboard-modal-actions">
                    <button type="button" className="dashboard-modal-cancel-btn" onClick={modal.close} disabled={modal.isSaving}>
                        Cancel
                    </button>
                    <button type="button" className="dashboard-modal-primary-btn" onClick={modal.requestSave} disabled={modal.isSaving}>
                        {modal.isSaving ? "Saving..." : "Save changes"}
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default EditPlanModal;
