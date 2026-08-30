import Modal from "../../../../components/Modal/Modal";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type { BusinessSubscriptionResponse } from "../types";
import type { SubscriptionPlanDetailResponse } from "../../SuperAdminDashboard/types";

const currencyFormatter = (currency: string) => new Intl.NumberFormat(undefined, { style: "currency", currency });

const planLine = (plan: { price: number; currency: string; billingInterval: string }) =>
    `${currencyFormatter(plan.currency).format(plan.price)} / ${plan.billingInterval.toLowerCase()}`;

type PlanChangeConfirmModalProps = {
    plan?: SubscriptionPlanDetailResponse;
    currentSubscription?: BusinessSubscriptionResponse | null;
    isSubmitting: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

/**
 * Honest about what actually happens: there's no payment gateway wired in yet, so
 * confirming here genuinely and immediately changes the plan for real — free of
 * charge, not a simulated "checkout" and not a claim that a payment succeeded.
 */
const PlanChangeConfirmModal = ({
    plan,
    currentSubscription,
    isSubmitting,
    onConfirm,
    onCancel,
}: PlanChangeConfirmModalProps) => {
    const isOpen = Boolean(plan);
    const isUpgrade = currentSubscription?.status === "Active" && plan && plan.price > currentSubscription.price;
    const isDowngrade = currentSubscription?.status === "Active" && plan && plan.price < currentSubscription.price;
    const verb = !currentSubscription || currentSubscription.status !== "Active" ? "Subscribe to" : isUpgrade ? "Upgrade to" : isDowngrade ? "Downgrade to" : "Switch to";

    return (
        <Modal isOpen={isOpen} onClose={onCancel}>
            <Modal.Header>
                <h2>
                    {verb} {plan?.name}
                </h2>
            </Modal.Header>

            <Modal.Body>
                {plan && plan.features.length > 0 && (
                    <>
                        <p className="business-dashboard-form-label">You'll get:</p>
                        <ul className="business-dashboard-subscription-features">
                            {plan.features.map((feature) => (
                                <li key={feature.featureKey}>
                                    ✓ {feature.featureName}
                                    {feature.limit != null && (
                                        <span className="business-dashboard-subscription-feature-limit"> ({feature.limit}/period)</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                <div className="plan-change-summary">
                    <div>
                        <span className="business-dashboard-form-label">Current plan</span>
                        <span>
                            {currentSubscription?.status === "Active"
                                ? `${currentSubscription.planName} — ${planLine(currentSubscription)}`
                                : "No active plan"}
                        </span>
                    </div>
                    <div>
                        <span className="business-dashboard-form-label">New plan</span>
                        <span>{plan && `${plan.name} — ${planLine(plan)}`}</span>
                    </div>
                </div>

                <p className="business-dashboard-form-hint plan-change-payment-note">
                    No payment will be charged — MerchForge billing isn't connected to a payment provider yet. Confirming
                    below updates your plan immediately at no cost.
                </p>
            </Modal.Body>

            <Modal.Footer>
                <button type="button" className="business-dashboard-button-secondary" onClick={onCancel}>
                    Cancel
                </button>
                <button type="button" className="business-dashboard-button-primary" onClick={onConfirm} disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Spinner size={14} /> Confirming…
                        </>
                    ) : (
                        "Confirm Change"
                    )}
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default PlanChangeConfirmModal;
