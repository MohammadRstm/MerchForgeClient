import Modal from "../../../../components/Modal/Modal";
import { formatCurrency } from "../utils/formatCurrency";
import type useChangeSubscriptionModal from "../hooks/ui/useChangeSubscriptionModal";

type ChangeSubscriptionModalProps = {
    modal: ReturnType<typeof useChangeSubscriptionModal>;
    businessName: string;
};

const ChangeSubscriptionModal = ({ modal, businessName }: ChangeSubscriptionModalProps) => {
    const { currentSubscription, target } = modal;

    if (target) {
        return (
            <Modal isOpen={modal.isOpen} onClose={modal.close}>
                <Modal.Header>
                    <h2>Change Subscription</h2>
                </Modal.Header>
                <Modal.Body>
                    <dl className="business-detail-grid">
                        <div>
                            <dt>Business</dt>
                            <dd>{businessName}</dd>
                        </div>
                        <div>
                            <dt>Current plan</dt>
                            <dd>
                                {currentSubscription
                                    ? `${currentSubscription.planName} — ${currentSubscription.billingInterval}`
                                    : "No active plan"}
                            </dd>
                        </div>
                        <div>
                            <dt>New plan</dt>
                            <dd>
                                {target.planName} — {target.billingInterval} ({formatCurrency(target.price, target.currency)})
                            </dd>
                        </div>
                        {currentSubscription && (
                            <div>
                                <dt>Current period</dt>
                                <dd>
                                    {new Date(currentSubscription.currentPeriodStart).toLocaleDateString()} →{" "}
                                    {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
                                </dd>
                            </div>
                        )}
                    </dl>

                    <p className="dashboard-table-message" style={{ textAlign: "left", padding: 0, marginTop: 12 }}>
                        This starts a brand-new billing period from today, rather than extending the current one.
                    </p>

                    <p className="dashboard-chart-disclaimer" style={{ marginTop: 8 }}>
                        Changing this business's plan will reset their AI Image Editing credit balance to the new
                        plan's allotment. Any credits purchased separately and not yet used will be overwritten, not
                        preserved.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <div className="dashboard-modal-actions">
                        <button type="button" className="dashboard-modal-cancel-btn" onClick={modal.backToPicker} disabled={modal.isPending}>
                            Back
                        </button>
                        <button type="button" className="dashboard-modal-primary-btn" onClick={modal.confirmChange} disabled={modal.isPending}>
                            {modal.isPending ? "Changing..." : "Confirm Change"}
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <Modal isOpen={modal.isOpen} onClose={modal.close}>
            <Modal.Header>
                <h2>Change Subscription</h2>
            </Modal.Header>
            <Modal.Body>
                {modal.groups.length === 0 ? (
                    <p className="dashboard-table-message">No plans available.</p>
                ) : (
                    <div className="plan-cards-grid">
                        {modal.groups.map((group) => {
                            const isCurrentInterval = (interval: "Monthly" | "Yearly") =>
                                currentSubscription?.planName === group.name && currentSubscription?.billingInterval === interval;

                            return (
                                <div key={group.name} className="change-plan-option-card">
                                    <h4>{group.name}</h4>
                                    <div className="change-plan-option-buttons">
                                        {group.monthly?.isActive && !isCurrentInterval("Monthly") && (
                                            <button
                                                type="button"
                                                className="dashboard-action-btn"
                                                onClick={() =>
                                                    modal.selectTarget(group.monthly!.id, group.name, "Monthly", group.monthly!.price, group.currency)
                                                }
                                            >
                                                Monthly · {formatCurrency(group.monthly.price, group.currency)}
                                            </button>
                                        )}
                                        {group.yearly?.isActive && !isCurrentInterval("Yearly") && (
                                            <button
                                                type="button"
                                                className="dashboard-action-btn"
                                                onClick={() =>
                                                    modal.selectTarget(group.yearly!.id, group.name, "Yearly", group.yearly!.price, group.currency)
                                                }
                                            >
                                                Yearly · {formatCurrency(group.yearly.price, group.currency)}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <div className="dashboard-modal-actions">
                    <button type="button" className="dashboard-modal-cancel-btn" onClick={modal.close}>
                        Cancel
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default ChangeSubscriptionModal;
