import Modal from "../../../../components/Modal/Modal";
import type { BusinessSubscriptionResponse } from "../types";

type CancelSubscriptionModalProps = {
    isOpen: boolean;
    subscription?: BusinessSubscriptionResponse | null;
    isSubmitting: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

/** Real cancellation — CancelSubscriptionAsync already sets CancelAtPeriodEnd server-side, so this explains exactly what that does rather than a generic "are you sure". */
const CancelSubscriptionModal = ({ isOpen, subscription, isSubmitting, onConfirm, onCancel }: CancelSubscriptionModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onCancel}>
            <Modal.Header>
                <h2>Cancel your {subscription?.planName} plan?</h2>
            </Modal.Header>

            <Modal.Body>
                <p className="business-dashboard-form-hint">
                    Your plan will remain active until{" "}
                    <strong>
                        {subscription && new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, { dateStyle: "long" })}
                    </strong>
                    . After that, your subscription ends and your storefront is taken down. You can resume by choosing a
                    plan again at any time before or after that date.
                </p>
            </Modal.Body>

            <Modal.Footer>
                <button type="button" className="business-dashboard-button-secondary" onClick={onCancel} disabled={isSubmitting}>
                    Keep my plan
                </button>
                <button type="button" className="business-dashboard-button-primary" onClick={onConfirm} disabled={isSubmitting}>
                    {isSubmitting ? "Cancelling…" : "Cancel Subscription"}
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default CancelSubscriptionModal;
