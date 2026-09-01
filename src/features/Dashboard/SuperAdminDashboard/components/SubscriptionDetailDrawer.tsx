import Modal from "../../../../components/Modal/Modal";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { formatCurrency } from "../utils/formatCurrency";
import { subscriptionStatusBadge } from "../utils/subscriptionStatusBadge";
import type useSubscriptionDetailModal from "../hooks/ui/useSubscriptionDetailModal";
import type useChangeSubscriptionModal from "../hooks/ui/useChangeSubscriptionModal";
import ChangeSubscriptionModal from "./ChangeSubscriptionModal";

type SubscriptionDetailDrawerProps = {
    modal: ReturnType<typeof useSubscriptionDetailModal>;
    changeModal: ReturnType<typeof useChangeSubscriptionModal>;
};

const SubscriptionDetailDrawer = ({ modal, changeModal }: SubscriptionDetailDrawerProps) => {
    const { business } = modal;
    const subscription = business?.subscription;
    const badge = subscriptionStatusBadge(subscription?.status ?? null);

    return (
        <>
            <Modal isOpen={modal.isOpen && !modal.cancelConfirmOpen} onClose={modal.close}>
                <Modal.Header>
                    <h2>{business?.name ?? "Subscription"}</h2>
                </Modal.Header>
                <Modal.Body>
                    {modal.isLoading ? (
                        <div className="dashboard-table-loading">
                            <Spinner size={28} />
                        </div>
                    ) : modal.isError || !business ? (
                        <p className="dashboard-table-message dashboard-table-message--error">
                            Unable to load this subscription.
                        </p>
                    ) : (
                        <>
                            <dl className="business-detail-grid">
                                <div>
                                    <dt>Owner</dt>
                                    <dd>{business.ownerFullName}</dd>
                                </div>
                                <div>
                                    <dt>Domain</dt>
                                    <dd>{business.domainName ?? "Not set"}</dd>
                                </div>
                            </dl>

                            <h4 className="dashboard-subsection-heading">Subscription</h4>

                            {!subscription ? (
                                <p className="dashboard-table-message">No active subscription.</p>
                            ) : (
                                <>
                                    <div className="dashboard-table-header" style={{ marginBottom: 8 }}>
                                        <span>
                                            {subscription.planName} · {subscription.billingInterval}
                                        </span>
                                        <span className={`dashboard-badge ${badge.className}`}>{badge.label}</span>
                                    </div>

                                    <dl className="business-detail-grid">
                                        <div>
                                            <dt>Price</dt>
                                            <dd>{formatCurrency(subscription.price, subscription.currency)}</dd>
                                        </div>
                                        <div>
                                            <dt>Current period</dt>
                                            <dd>
                                                {new Date(subscription.currentPeriodStart).toLocaleDateString()} –{" "}
                                                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                                            </dd>
                                        </div>
                                        {business.activeSubscriberCountForPlan !== null && (
                                            <div>
                                                <dt>Active subscribers on this plan</dt>
                                                <dd>{business.activeSubscriberCountForPlan}</dd>
                                            </div>
                                        )}
                                    </dl>

                                    {subscription.features.length > 0 && (
                                        <div className="product-overview-categories" style={{ marginTop: 8 }}>
                                            {subscription.features.map((feature) => (
                                                <span key={feature.featureKey} className="dashboard-badge dashboard-badge--info">
                                                    {feature.featureName}
                                                    {feature.limit != null && ` · ${feature.limit}/period`}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {business.featureCredits.length > 0 && (
                                <>
                                    <h4 className="dashboard-subsection-heading">Feature Credits</h4>
                                    <div className="feature-credits-list">
                                        {business.featureCredits.map((credit) => (
                                            <div key={credit.featureKey} className="feature-credit-row-header">
                                                <span>{credit.featureName}</span>
                                                <span className="dashboard-table-muted">
                                                    {credit.includedInPlan
                                                        ? "Unlimited (in plan)"
                                                        : `${credit.creditsRemaining} / ${credit.creditsGrantedTotal} remaining`}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            <h4 className="dashboard-subsection-heading">History</h4>
                            {modal.historyLoading ? (
                                <div className="dashboard-table-loading">
                                    <Spinner size={20} />
                                </div>
                            ) : modal.history.length === 0 ? (
                                <p className="dashboard-table-message">No subscription history yet.</p>
                            ) : (
                                <ul className="recent-activity-list">
                                    {modal.history.map((entry) => (
                                        <li key={entry.id}>
                                            <span>
                                                {entry.planName} · {entry.billingInterval}
                                            </span>
                                            <span className="dashboard-table-muted">
                                                {entry.status}
                                                {" · "}
                                                {new Date(entry.createdAt).toLocaleDateString()}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <div className="dashboard-modal-actions">
                        <button type="button" className="dashboard-modal-cancel-btn" onClick={modal.close}>
                            Close
                        </button>
                        {subscription && !subscription.cancelAtPeriodEnd && (
                            <button type="button" className="dashboard-action-btn" onClick={modal.openCancelConfirm}>
                                Cancel Subscription
                            </button>
                        )}
                        <button type="button" className="dashboard-modal-primary-btn" onClick={changeModal.open}>
                            Change Plan
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>

            <Modal isOpen={modal.cancelConfirmOpen} onClose={modal.closeCancelConfirm}>
                <Modal.Header>
                    <h2>Cancel subscription?</h2>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        <strong>{business?.name}</strong>'s access continues until the current period ends (
                        {subscription && new Date(subscription.currentPeriodEnd).toLocaleDateString()}), then the
                        subscription ends automatically. This does not cancel it immediately.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <div className="dashboard-modal-actions">
                        <button type="button" className="dashboard-modal-cancel-btn" onClick={modal.closeCancelConfirm} disabled={modal.isCancelling}>
                            Back
                        </button>
                        <button type="button" className="dashboard-modal-confirm-btn" onClick={modal.confirmCancel} disabled={modal.isCancelling}>
                            {modal.isCancelling ? "Cancelling..." : "Confirm"}
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>

            <ChangeSubscriptionModal modal={changeModal} businessName={business?.name ?? ""} />
        </>
    );
};

export default SubscriptionDetailDrawer;
