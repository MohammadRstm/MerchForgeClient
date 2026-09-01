import Modal from "../../../../components/Modal/Modal";
import type useRevokeAllSessionsModal from "../hooks/ui/useRevokeAllSessionsModal";

type RevokeAllSessionsModalProps = {
    modal: ReturnType<typeof useRevokeAllSessionsModal>;
};

const RevokeAllSessionsModal = ({ modal }: RevokeAllSessionsModalProps) => {
    return (
        <Modal isOpen={modal.isOpen} onClose={modal.close}>
            <Modal.Header>
                <h2>Revoke All Sessions?</h2>
            </Modal.Header>
            <Modal.Body>
                <p>This will sign out every MerchForge platform user, everywhere.</p>
                <p>
                    Your own session is left signed in. Everyone else — including other Super Admins — will need
                    to sign in again.
                </p>
                <p className="dashboard-chart-disclaimer">This action cannot be undone.</p>
            </Modal.Body>
            <Modal.Footer>
                <div className="dashboard-modal-actions">
                    <button
                        type="button"
                        className="dashboard-modal-cancel-btn"
                        onClick={modal.close}
                        disabled={modal.isPending}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="dashboard-modal-confirm-btn"
                        onClick={modal.confirm}
                        disabled={modal.isPending}
                    >
                        {modal.isPending ? "Revoking..." : "Revoke All Sessions"}
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default RevokeAllSessionsModal;
