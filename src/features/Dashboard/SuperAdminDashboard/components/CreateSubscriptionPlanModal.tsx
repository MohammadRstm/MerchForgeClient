import Modal from "../../../../components/Modal/Modal";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import useSubscriptionPlanFeatures from "../hooks/data/useSubscriptionPlanFeatures";
import type useCreateSubscriptionPlanForm from "../hooks/ui/useCreateSubscriptionPlanForm";

type CreateSubscriptionPlanModalProps = {
    form: ReturnType<typeof useCreateSubscriptionPlanForm>;
};

const CreateSubscriptionPlanModal = ({ form }: CreateSubscriptionPlanModalProps) => {
    const { data: features, isLoading: featuresLoading } = useSubscriptionPlanFeatures();

    return (
        <Modal isOpen={form.isOpen} onClose={form.close}>
            <Modal.Header>
                <h2>Add a subscription plan</h2>
            </Modal.Header>

            <Modal.Body>
                <form
                    className="dashboard-form-grid"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.submit();
                    }}
                >
                    <div>
                        <label className="dashboard-invite-label" htmlFor="plan-name">
                            Name
                        </label>
                        <input
                            id="plan-name"
                            className="dashboard-invite-input"
                            type="text"
                            value={form.values.name}
                            onChange={(e) => form.changeField("name", e.target.value)}
                            placeholder="Starter"
                            disabled={form.isPending}
                        />
                    </div>

                    <div>
                        <label className="dashboard-invite-label" htmlFor="plan-description">
                            Description
                        </label>
                        <input
                            id="plan-description"
                            className="dashboard-invite-input"
                            type="text"
                            value={form.values.description}
                            onChange={(e) => form.changeField("description", e.target.value)}
                            placeholder="Optional"
                            disabled={form.isPending}
                        />
                    </div>

                    <div>
                        <label className="dashboard-invite-label" htmlFor="plan-price">
                            Price
                        </label>
                        <input
                            id="plan-price"
                            className="dashboard-invite-input"
                            type="number"
                            min={0}
                            step={0.01}
                            value={form.values.price}
                            onChange={(e) => form.changeField("price", e.target.value)}
                            disabled={form.isPending}
                        />
                    </div>

                    <div>
                        <label className="dashboard-invite-label" htmlFor="plan-currency">
                            Currency
                        </label>
                        <input
                            id="plan-currency"
                            className="dashboard-invite-input"
                            type="text"
                            maxLength={3}
                            value={form.values.currency}
                            onChange={(e) => form.changeField("currency", e.target.value.toUpperCase())}
                            placeholder="USD"
                            disabled={form.isPending}
                        />
                    </div>

                    <div>
                        <label className="dashboard-invite-label" htmlFor="plan-interval">
                            Billing interval
                        </label>
                        <select
                            id="plan-interval"
                            className="dashboard-invite-input"
                            value={form.values.billingInterval}
                            onChange={(e) => form.changeField("billingInterval", e.target.value as "Monthly" | "Yearly")}
                            disabled={form.isPending}
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
                                    const checked = feature.id in form.values.selectedFeatures;

                                    return (
                                        <div key={feature.id} className="subscription-plan-feature-picker__item">
                                            <label htmlFor={`create-feature-${feature.id}`}>
                                                <input
                                                    id={`create-feature-${feature.id}`}
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => form.toggleFeature(feature.id)}
                                                    disabled={form.isPending}
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
                                                    value={form.values.selectedFeatures[feature.id]}
                                                    onChange={(e) => form.setFeatureLimit(feature.id, e.target.value)}
                                                    disabled={form.isPending}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {form.error && (
                        <p className="dashboard-invite-error" role="alert">
                            {form.error}
                        </p>
                    )}
                </form>
            </Modal.Body>

            <Modal.Footer>
                <div className="dashboard-modal-actions">
                    <button
                        type="button"
                        className="dashboard-modal-cancel-btn"
                        onClick={form.close}
                        disabled={form.isPending}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="dashboard-modal-primary-btn"
                        onClick={form.submit}
                        disabled={form.isPending}
                    >
                        {form.isPending ? "Adding..." : "Add plan"}
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateSubscriptionPlanModal;
