import Modal from "../../../../components/Modal/Modal";
import type useRevokeCustomerSessionsModal from "../hooks/ui/useRevokeCustomerSessionsModal";

type RevokeCustomerSessionsModalProps = {
    modal: ReturnType<typeof useRevokeCustomerSessionsModal>;
};

const RevokeCustomerSessionsModal = ({ modal }: RevokeCustomerSessionsModalProps) => {
    return (
        <Modal isOpen={modal.isOpen} onClose={modal.close}>
            <Modal.Header>
                <h2>Revoke Customer Sessions?</h2>
            </Modal.Header>
            <Modal.Body>
                <p>This will sign the customer out of all active storefront sessions.</p>
            </Modal.Body>
            <Modal.Footer>
                <div className="dashboard-modal-actions">
                    <button type="button" className="dashboard-modal-cancel-btn" onClick={modal.close} disabled={modal.isPending}>
                        Cancel
                    </button>
                    <button type="button" className="dashboard-modal-confirm-btn" onClick={modal.confirm} disabled={modal.isPending}>
                        {modal.isPending ? "Revoking..." : "Revoke Sessions"}
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default RevokeCustomerSessionsModal;
