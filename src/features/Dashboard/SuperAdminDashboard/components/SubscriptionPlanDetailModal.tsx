import Modal from "../../../../components/Modal/Modal";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type useSubscriptionPlanDetailModal from "../hooks/ui/useSubscriptionPlanDetailModal";

type SubscriptionPlanDetailModalProps = {
    modal: ReturnType<typeof useSubscriptionPlanDetailModal>;
};

const SubscriptionPlanDetailModal = ({ modal }: SubscriptionPlanDetailModalProps) => {
    const {
        isOpen,
        plan,
        isLoading,
        isError,
        features,
        featuresLoading,
        mode,
        values,
        error,
        isUpdating,
        isTogglingActive,
        close,
        startEdit,
        cancelEdit,
        changeField,
        toggleFeature,
        setFeatureLimit,
        submitEdit,
        toggleActive,
    } = modal;

    return (
        <Modal isOpen={isOpen} onClose={close}>
            <Modal.Header>
                <h2>{mode === "edit" ? "Edit subscription plan" : "Subscription plan"}</h2>
            </Modal.Header>

            <Modal.Body>
                {isLoading ? (
                    <div className="dashboard-table-loading">
                        <Spinner size={28} />
                    </div>
                ) : isError || !plan ? (
                    <p className="dashboard-table-message dashboard-table-message--error">
                        Failed to load this plan. Please try again.
                    </p>
                ) : mode === "edit" && values ? (
                    <form
                        className="dashboard-form-grid"
                        onSubmit={(e) => {
                            e.preventDefault();
                            submitEdit();
                        }}
                    >
                        <div>
                            <label className="dashboard-invite-label" htmlFor="edit-plan-name">
                                Name
                            </label>
                            <input
                                id="edit-plan-name"
                                className="dashboard-invite-input"
                                type="text"
                                value={values.name}
                                onChange={(e) => changeField("name", e.target.value)}
                                disabled={isUpdating}
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
                                onChange={(e) => changeField("description", e.target.value)}
                                disabled={isUpdating}
                            />
                        </div>

                        <div>
                            <label className="dashboard-invite-label" htmlFor="edit-plan-price">
                                Price
                            </label>
                            <input
                                id="edit-plan-price"
                                className="dashboard-invite-input"
                                type="number"
                                min={0}
                                step={0.01}
                                value={values.price}
                                onChange={(e) => changeField("price", e.target.value)}
                                disabled={isUpdating}
                            />
                        </div>

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
                                onChange={(e) => changeField("currency", e.target.value.toUpperCase())}
                                disabled={isUpdating}
                            />
                        </div>

                        <div>
                            <label className="dashboard-invite-label" htmlFor="edit-plan-interval">
                                Billing interval
                            </label>
                            <select
                                id="edit-plan-interval"
                                className="dashboard-invite-input"
                                value={values.billingInterval}
                                onChange={(e) => changeField("billingInterval", e.target.value as "Monthly" | "Yearly")}
                                disabled={isUpdating}
                            >
                                <option value="Monthly">Monthly</option>
                                <option value="Yearly">Yearly</option>
                            </select>
                        </div>

                        <div>
                            <span className="dashboard-invite-label">Features</span>

                            {featuresLoading ? (
                                <div className="dashboard-table-loading">
                                    <Spinner size={24} />
                                </div>
                            ) : (
                                <div className="subscription-plan-feature-picker">
                                    {features?.map((feature) => {
                                        const checked = feature.id in values.selectedFeatures;

                                        return (
                                            <div key={feature.id} className="subscription-plan-feature-picker__item">
                                                <label htmlFor={`edit-feature-${feature.id}`}>
                                                    <input
                                                        id={`edit-feature-${feature.id}`}
                                                        type="checkbox"
                                                        checked={checked}
                                                        onChange={() => toggleFeature(feature.id)}
                                                        disabled={isUpdating}
                                                    />
                                                    <span>
                                                        <span className="subscription-plan-feature-picker__name">
                                                            {feature.name}
                                                        </span>
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
                                                        onChange={(e) => setFeatureLimit(feature.id, e.target.value)}
                                                        disabled={isUpdating}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
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
                            <span className="website-request-detail__business-name">{plan.name}</span>
                        </div>

                        <dl className="website-request-detail__grid">
                            <dt>Description</dt>
                            <dd>{plan.description ?? "—"}</dd>

                            <dt>Price</dt>
                            <dd>
                                {new Intl.NumberFormat(undefined, { style: "currency", currency: plan.currency }).format(
                                    plan.price
                                )}{" "}
                                / {plan.billingInterval.toLowerCase()}
                            </dd>

                            <dt>Status</dt>
                            <dd>{plan.isActive ? "Active" : "Inactive"}</dd>

                            <dt>Active subscribers</dt>
                            <dd>{plan.activeSubscriberCount}</dd>
                        </dl>

                        <div className="website-request-detail__notes">
                            <span className="website-request-detail__notes-label">
                                Features ({plan.features.length})
                            </span>

                            {plan.features.length === 0 ? (
                                <p className="dashboard-table-message">This plan doesn't include any features.</p>
                            ) : (
                                <ul className="dashboard-template-businesses-list">
                                    {plan.features.map((feature) => (
                                        <li key={feature.featureKey}>
                                            {feature.featureName}
                                            {feature.limit !== null && ` — ${feature.limit}/period`}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
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
                            disabled={isUpdating}
                        >
                            {isUpdating ? "Saving..." : "Save changes"}
                        </button>
                    </div>
                ) : (
                    <div className="dashboard-modal-actions">
                        <button type="button" className="dashboard-modal-cancel-btn" onClick={close}>
                            Close
                        </button>
                        {plan && (
                            <>
                                <button
                                    type="button"
                                    className="dashboard-action-btn"
                                    onClick={toggleActive}
                                    disabled={isTogglingActive}
                                >
                                    {plan.isActive ? "Deactivate" : "Reactivate"}
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

export default SubscriptionPlanDetailModal;
