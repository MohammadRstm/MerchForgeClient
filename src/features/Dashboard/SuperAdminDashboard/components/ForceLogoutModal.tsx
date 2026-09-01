import Modal from "../../../../components/Modal/Modal";
import type useUserDetailModal from "../hooks/ui/useUserDetailModal";

type ForceLogoutModalProps = {
    modal: ReturnType<typeof useUserDetailModal>;
};

const ForceLogoutModal = ({ modal }: ForceLogoutModalProps) => {
    return (
        <Modal isOpen={modal.revokeConfirmOpen} onClose={modal.closeRevokeConfirm}>
            <Modal.Header>
                <h2>Force Logout</h2>
            </Modal.Header>
            <Modal.Body>
                <p>
                    This will terminate all active sessions for{" "}
                    <strong>
                        {modal.user?.firstName} {modal.user?.lastName}
                    </strong>
                    .
                </p>
                <p>The user will need to sign in again.</p>
            </Modal.Body>
            <Modal.Footer>
                <div className="dashboard-modal-actions">
                    <button
                        type="button"
                        className="dashboard-modal-cancel-btn"
                        onClick={modal.closeRevokeConfirm}
                        disabled={modal.isRevoking}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="dashboard-modal-confirm-btn"
                        onClick={modal.confirmRevoke}
                        disabled={modal.isRevoking}
                    >
                        {modal.isRevoking ? "Logging out..." : "Force Logout"}
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default ForceLogoutModal;
