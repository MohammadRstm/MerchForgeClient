import Modal from "../../../../components/Modal/Modal";
import type useInviteBusinessOwnerForm from "../hooks/ui/useInviteBusinessOwnerForm";

type InviteBusinessOwnerModalProps = {
    form: ReturnType<typeof useInviteBusinessOwnerForm>;
};

const InviteBusinessOwnerModal = ({ form }: InviteBusinessOwnerModalProps) => {
    return (
        <Modal isOpen={form.isOpen} onClose={form.close}>
            <Modal.Header>
                <h2>Invite a business owner</h2>
            </Modal.Header>

            <Modal.Body>
                <p className="dashboard-modal-text">
                    We'll email an invitation link to this address. They set up their
                    business when they accept it, and the link expires in 48 hours.
                </p>

                <form
                    className="dashboard-invite-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.submit();
                    }}
                >
                    <label className="dashboard-invite-label" htmlFor="invite-email">
                        Email address
                    </label>

                    <input
                        id="invite-email"
                        className="dashboard-invite-input"
                        type="email"
                        value={form.email}
                        onChange={(e) => form.changeEmail(e.target.value)}
                        placeholder="owner@example.com"
                        disabled={form.isPending}
                        autoFocus
                    />

                    {form.error && (
                        <p className="dashboard-invite-error" role="alert">
                            {form.error}
                        </p>
                    )}
                </form>
            </Modal.Body>

            <Modal.Footer>
                <div className="dashboard-modal-actions">
                    <button
                        type="button"
                        className="dashboard-modal-cancel-btn"
                        onClick={form.close}
                        disabled={form.isPending}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="dashboard-modal-primary-btn"
                        onClick={form.submit}
                        disabled={form.isPending}
                    >
                        {form.isPending ? "Sending..." : "Send invitation"}
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default InviteBusinessOwnerModal;
