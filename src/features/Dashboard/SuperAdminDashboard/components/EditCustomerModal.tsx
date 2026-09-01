import Modal from "../../../../components/Modal/Modal";
import type useEditCustomerModal from "../hooks/ui/useEditCustomerModal";

type EditCustomerModalProps = {
    modal: ReturnType<typeof useEditCustomerModal>;
};

/** Name and phone only - email and anything authentication-related is never editable here. */
const EditCustomerModal = ({ modal }: EditCustomerModalProps) => {
    return (
        <Modal isOpen={modal.isOpen} onClose={modal.close}>
            <Modal.Header>
                <h2>Edit Customer</h2>
            </Modal.Header>
            <Modal.Body>
                <form
                    className="dashboard-form-grid"
                    onSubmit={(e) => {
                        e.preventDefault();
                        modal.submit();
                    }}
                >
                    <div>
                        <label className="dashboard-invite-label" htmlFor="edit-customer-first-name">
                            First name
                        </label>
                        <input
                            id="edit-customer-first-name"
                            className="dashboard-invite-input"
                            type="text"
                            value={modal.values.firstName}
                            onChange={(e) => modal.changeField("firstName", e.target.value)}
                            disabled={modal.isPending}
                        />
                    </div>

                    <div>
                        <label className="dashboard-invite-label" htmlFor="edit-customer-last-name">
                            Last name
                        </label>
                        <input
                            id="edit-customer-last-name"
                            className="dashboard-invite-input"
                            type="text"
                            value={modal.values.lastName}
                            onChange={(e) => modal.changeField("lastName", e.target.value)}
                            disabled={modal.isPending}
                        />
                    </div>

                    <div>
                        <label className="dashboard-invite-label" htmlFor="edit-customer-phone">
                            Phone
                        </label>
                        <input
                            id="edit-customer-phone"
                            className="dashboard-invite-input"
                            type="text"
                            value={modal.values.phone}
                            onChange={(e) => modal.changeField("phone", e.target.value)}
                            placeholder="Optional"
                            disabled={modal.isPending}
                        />
                    </div>

                    {modal.error && (
                        <p className="dashboard-invite-error" role="alert">
                            {modal.error}
                        </p>
                    )}
                </form>
            </Modal.Body>
            <Modal.Footer>
                <div className="dashboard-modal-actions">
                    <button type="button" className="dashboard-modal-cancel-btn" onClick={modal.close} disabled={modal.isPending}>
                        Cancel
                    </button>
                    <button type="button" className="dashboard-modal-primary-btn" onClick={modal.submit} disabled={modal.isPending}>
                        {modal.isPending ? "Saving..." : "Save changes"}
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default EditCustomerModal;
