import Modal from "../../../../components/Modal/Modal";

type CancelOrderModalProps = {
    isOpen: boolean;
    /** e.g. "#MF-A1B2C3D4" for a single order, or "3 orders" for a bulk cancel. */
    subject?: string;
    isCancelling: boolean;
    error?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

/** Shared confirmation for both single-order and bulk cancellation — cancelling is the only destructive action on this page. */
const CancelOrderModal = ({ isOpen, subject, isCancelling, error, onConfirm, onCancel }: CancelOrderModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onCancel}>
            <Modal.Header>
                <h2>Cancel order{subject ? ` ${subject}` : ""}?</h2>
            </Modal.Header>

            <Modal.Body>
                <p>This action will mark {subject ? "it" : "the selected orders"} as cancelled.</p>

                {error && (
                    <p className="business-dashboard-form-error" role="alert">
                        {error}
                    </p>
                )}
            </Modal.Body>

            <Modal.Footer>
                <button type="button" className="business-dashboard-button-secondary" onClick={onCancel}>
                    Keep Order
                </button>
                <button
                    type="button"
                    className="business-dashboard-button-danger"
                    onClick={onConfirm}
                    disabled={isCancelling}
                >
                    {isCancelling ? "Cancelling…" : "Cancel Order"}
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default CancelOrderModal;
