import Modal from "../../../../components/Modal/Modal";
import type { CreateBusinessMemberResponse } from "../types";

type MemberCredentialsModalProps = {
    member: CreateBusinessMemberResponse | null;
    onDismiss: () => void;
};

/**
 * Shown once, right after a member is created. The password is generated server-side
 * and only ever stored hashed, so this is the single moment it can be read — hence a
 * modal the owner has to dismiss rather than a toast that disappears on its own.
 */
const MemberCredentialsModal = ({ member, onDismiss }: MemberCredentialsModalProps) => {
    return (
        <Modal isOpen={Boolean(member)} onClose={onDismiss}>
            <Modal.Header>
                <h2>{member?.firstName} is on the team</h2>
            </Modal.Header>

            <Modal.Body>
                <p className="business-dashboard-member-intro">
                    Send these details to {member?.firstName}. We can't show the password
                    again once you close this.
                </p>

                <dl className="business-dashboard-credentials">
                    <dt>Email</dt>
                    <dd>{member?.email}</dd>

                    <dt>Password</dt>
                    <dd className="business-dashboard-credentials-secret">
                        {member?.rawPassword}
                    </dd>

                    <dt>Role</dt>
                    <dd>{member?.role}</dd>
                </dl>
            </Modal.Body>

            <Modal.Footer>
                <button
                    type="button"
                    className="business-dashboard-button-primary"
                    onClick={onDismiss}
                >
                    I've saved these details
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default MemberCredentialsModal;
