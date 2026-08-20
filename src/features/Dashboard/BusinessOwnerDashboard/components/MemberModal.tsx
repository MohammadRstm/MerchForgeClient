import Modal from "../../../../components/Modal/Modal";
import type useMemberModal from "../hooks/ui/useMemberModal";

type MemberModalProps = {
    modal: ReturnType<typeof useMemberModal>;
};

const ROLE_BLURB: Record<string, string> = {
    Admin: "Admins help run the store — think managers or team leads.",
    Member: "Members are part of the team without running the store.",
};

const MemberModal = ({ modal }: MemberModalProps) => {
    const heading = modal.role === "Admin" ? "Add an admin" : "Add a member";

    return (
        <Modal isOpen={modal.isOpen} onClose={modal.close}>
            <Modal.Header>
                <h2>{heading}</h2>
            </Modal.Header>

            <Modal.Body>
                <p className="business-dashboard-member-intro">
                    {ROLE_BLURB[modal.role]} We'll create their account and generate a
                    password for you to pass on.
                </p>

                <form
                    className="business-dashboard-member-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        modal.submit();
                    }}
                >
                    <div className="business-dashboard-member-row">
                        <div className="business-dashboard-form-field">
                            <label
                                className="business-dashboard-form-label"
                                htmlFor="member-first-name"
                            >
                                First name
                            </label>

                            <input
                                id="member-first-name"
                                className="business-dashboard-form-input"
                                value={modal.values.firstName}
                                onChange={(e) => modal.change("firstName", e.target.value)}
                                disabled={modal.isPending}
                                autoFocus
                            />

                            {modal.errors.firstName && (
                                <p className="business-dashboard-form-error" role="alert">
                                    {modal.errors.firstName}
                                </p>
                            )}
                        </div>

                        <div className="business-dashboard-form-field">
                            <label
                                className="business-dashboard-form-label"
                                htmlFor="member-last-name"
                            >
                                Last name
                            </label>

                            <input
                                id="member-last-name"
                                className="business-dashboard-form-input"
                                value={modal.values.lastName}
                                onChange={(e) => modal.change("lastName", e.target.value)}
                                disabled={modal.isPending}
                            />

                            {modal.errors.lastName && (
                                <p className="business-dashboard-form-error" role="alert">
                                    {modal.errors.lastName}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="business-dashboard-form-field">
                        <label className="business-dashboard-form-label" htmlFor="member-email">
                            Email
                        </label>

                        <input
                            id="member-email"
                            className="business-dashboard-form-input"
                            type="email"
                            value={modal.values.email}
                            onChange={(e) => modal.change("email", e.target.value)}
                            placeholder="name@example.com"
                            disabled={modal.isPending}
                        />

                        {modal.errors.email && (
                            <p className="business-dashboard-form-error" role="alert">
                                {modal.errors.email}
                            </p>
                        )}
                    </div>

                    <p className="business-dashboard-member-role">
                        Joining as <strong>{modal.role}</strong>
                    </p>
                </form>
            </Modal.Body>

            <Modal.Footer>
                <button
                    type="button"
                    className="business-dashboard-button-secondary"
                    onClick={modal.close}
                    disabled={modal.isPending}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="business-dashboard-button-primary"
                    onClick={modal.submit}
                    disabled={modal.isPending}
                >
                    {modal.isPending ? "Adding…" : heading}
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default MemberModal;
