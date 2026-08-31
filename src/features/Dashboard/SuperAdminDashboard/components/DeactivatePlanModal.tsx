import Modal from "../../../../components/Modal/Modal";
import { formatCurrency } from "../utils/formatCurrency";
import type useDeactivatePlanModal from "../hooks/ui/useDeactivatePlanModal";

type DeactivatePlanModalProps = {
    modal: ReturnType<typeof useDeactivatePlanModal>;
};

const DeactivatePlanModal = ({ modal }: DeactivatePlanModalProps) => {
    const { group } = modal;

    return (
        <Modal isOpen={modal.isOpen} onClose={modal.close}>
            <Modal.Header>
                <h2>{group?.name ?? "Plan"} — Active / Inactive</h2>
            </Modal.Header>
            <Modal.Body>
                {group && (
                    <>
                        <p className="dashboard-table-message" style={{ textAlign: "left", padding: 0, marginBottom: 12 }}>
                            <strong>{group.totalActiveSubscriberCount}</strong> business
                            {group.totalActiveSubscriberCount === 1 ? " is" : "es are"} currently subscribed to this
                            tier. Deactivating an interval prevents <em>new</em> subscriptions to it — existing
                            subscribers keep their current plan, features, and renewal behavior completely
                            unaffected. Reactivating makes it available to subscribe to again.
                        </p>

                        <div className="deactivate-plan-intervals">
                            {group.monthly && (
                                <div className="deactivate-plan-interval-row">
                                    <div>
                                        <strong>Monthly</strong>
                                        <span className="dashboard-table-muted">
                                            {" "}
                                            {formatCurrency(group.monthly.price, group.currency)} ·{" "}
                                            {group.monthly.activeSubscriberCount} subscriber
                                            {group.monthly.activeSubscriberCount === 1 ? "" : "s"}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        className="dashboard-action-btn"
                                        disabled={modal.isPending}
                                        onClick={() => modal.toggleInterval(group.monthly!.id, group.monthly!.isActive)}
                                    >
                                        {modal.isPending && modal.pendingPlanId === group.monthly.id
                                            ? "Saving..."
                                            : group.monthly.isActive
                                              ? "Deactivate"
                                              : "Reactivate"}
                                    </button>
                                </div>
                            )}

                            {group.yearly && (
                                <div className="deactivate-plan-interval-row">
                                    <div>
                                        <strong>Yearly</strong>
                                        <span className="dashboard-table-muted">
                                            {" "}
                                            {formatCurrency(group.yearly.price, group.currency)} ·{" "}
                                            {group.yearly.activeSubscriberCount} subscriber
                                            {group.yearly.activeSubscriberCount === 1 ? "" : "s"}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        className="dashboard-action-btn"
                                        disabled={modal.isPending}
                                        onClick={() => modal.toggleInterval(group.yearly!.id, group.yearly!.isActive)}
                                    >
                                        {modal.isPending && modal.pendingPlanId === group.yearly.id
                                            ? "Saving..."
                                            : group.yearly.isActive
                                              ? "Deactivate"
                                              : "Reactivate"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <div className="dashboard-modal-actions">
                    <button type="button" className="dashboard-modal-cancel-btn" onClick={modal.close}>
                        Done
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default DeactivatePlanModal;
