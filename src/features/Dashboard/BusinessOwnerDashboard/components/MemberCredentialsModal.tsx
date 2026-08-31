import Modal from "../../../../components/Modal/Modal";
import type { CreateBusinessMemberResponse } from "../types";

type MemberCredentialsModalProps = {
    member: CreateBusinessMemberResponse | null;
    onDismiss: () => void;
};

/**
 * Shown once, right after a member is created. Their account has no usable
 * password yet — they were emailed an invitation to set their own — so this just
 * confirms the invite went out rather than displaying a credential.
 */
const MemberCredentialsModal = ({ member, onDismiss }: MemberCredentialsModalProps) => {
    return (
        <Modal isOpen={Boolean(member)} onClose={onDismiss}>
            <Modal.Header>
                <h2>{member?.firstName} is on the team</h2>
            </Modal.Header>

            <Modal.Body>
                <p className="business-dashboard-member-intro">
                    We've emailed {member?.firstName} an invitation to set their own
                    password and finish setting up their account.
                </p>

                <dl className="business-dashboard-credentials">
                    <dt>Email</dt>
                    <dd>{member?.email}</dd>

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
                    Got it
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default MemberCredentialsModal;
