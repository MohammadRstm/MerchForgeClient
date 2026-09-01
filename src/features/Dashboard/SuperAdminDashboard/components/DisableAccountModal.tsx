import Modal from "../../../../components/Modal/Modal";
import type useUserDetailModal from "../hooks/ui/useUserDetailModal";

type DisableAccountModalProps = {
    modal: ReturnType<typeof useUserDetailModal>;
};

const DisableAccountModal = ({ modal }: DisableAccountModalProps) => {
    const { user } = modal;

    return (
        <Modal isOpen={modal.disableConfirmOpen} onClose={modal.closeDisableConfirm}>
            <Modal.Header>
                <h2>Disable Account?</h2>
            </Modal.Header>
            <Modal.Body>
                <p>
                    <strong>
                        {user?.firstName} {user?.lastName}
                    </strong>{" "}
                    will no longer be able to sign in, and any active sessions are signed out immediately.
                    Their business memberships and historical records remain intact — you can re-enable this
                    account at any time.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <div className="dashboard-modal-actions">
                    <button
                        type="button"
                        className="dashboard-modal-cancel-btn"
                        onClick={modal.closeDisableConfirm}
                        disabled={modal.isDisabling}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="dashboard-modal-confirm-btn"
                        onClick={modal.confirmDisable}
                        disabled={modal.isDisabling}
                    >
                        {modal.isDisabling ? "Disabling..." : "Disable Account"}
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default DisableAccountModal;
