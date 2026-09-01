import { Link } from "react-router";
import Modal from "../../../../components/Modal/Modal";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { buildAdminBusinessDetailRoute } from "../../../../config/routes";
import type useUserDetailModal from "../hooks/ui/useUserDetailModal";

type UserDetailDrawerProps = {
    modal: ReturnType<typeof useUserDetailModal>;
};

const timeAgo = (isoDate: string): string => {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const minutes = Math.round(diffMs / 60_000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

    const days = Math.round(hours / 24);
    if (days === 1) return "yesterday";
    if (days < 30) return `${days} days ago`;

    return new Date(isoDate).toLocaleDateString();
};

const UserDetailDrawer = ({ modal }: UserDetailDrawerProps) => {
    const { user } = modal;

    return (
        <Modal isOpen={modal.isOpen && !modal.disableConfirmOpen && !modal.revokeConfirmOpen} onClose={modal.close}>
            <Modal.Header>
                <h2>{user ? `${user.firstName} ${user.lastName}` : "User"}</h2>
            </Modal.Header>
            <Modal.Body>
                {modal.isLoading ? (
                    <div className="dashboard-table-loading">
                        <Spinner size={28} />
                    </div>
                ) : modal.isError || !user ? (
                    <p className="dashboard-table-message dashboard-table-message--error">
                        Unable to load this user.
                    </p>
                ) : (
                    <>
                        <div className="dashboard-table-header" style={{ marginBottom: 8 }}>
                            <span className={`dashboard-badge dashboard-badge--${user.systemRole.toLowerCase()}`}>
                                {user.systemRole}
                            </span>
                            <span className={`dashboard-badge ${user.isDisabled ? "dashboard-badge--danger" : "dashboard-badge--success"}`}>
                                {user.isDisabled ? "Disabled" : "Active"}
                            </span>
                        </div>

                        <h4 className="dashboard-subsection-heading">Account</h4>
                        <dl className="business-detail-grid">
                            <div>
                                <dt>Email</dt>
                                <dd>{user.email}</dd>
                            </div>
                            <div>
                                <dt>Created</dt>
                                <dd>{new Date(user.createdAt).toLocaleString()}</dd>
                            </div>
                            <div>
                                <dt>Updated</dt>
                                <dd>{new Date(user.updatedAt).toLocaleString()}</dd>
                            </div>
                            {user.isDisabled && (
                                <div>
                                    <dt>Disabled</dt>
                                    <dd>
                                        {user.disabledAt && new Date(user.disabledAt).toLocaleString()}
                                        {user.disabledByName && ` by ${user.disabledByName}`}
                                    </dd>
                                </div>
                            )}
                        </dl>

                        <h4 className="dashboard-subsection-heading">Business Memberships</h4>
                        {user.memberships.length === 0 ? (
                            <p className="dashboard-table-message">Not a member of any business.</p>
                        ) : (
                            <ul className="recent-activity-list">
                                {user.memberships.map((membership) => (
                                    <li key={membership.businessId}>
                                        <Link
                                            to={buildAdminBusinessDetailRoute(membership.businessId)}
                                            className="dashboard-inline-link"
                                        >
                                            {membership.businessName}
                                        </Link>
                                        <span className="dashboard-table-muted">
                                            {membership.businessRole} · joined {new Date(membership.joinedAt).toLocaleDateString()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <h4 className="dashboard-subsection-heading">Sessions</h4>
                        <dl className="business-detail-grid">
                            <div>
                                <dt>Status</dt>
                                <dd>
                                    <span className={`dashboard-session${user.hasActiveSession ? " dashboard-session--active" : ""}`}>
                                        {user.hasActiveSession ? "Active" : "No active session"}
                                    </span>
                                </dd>
                            </div>
                            {user.hasActiveSession && (
                                <>
                                    <div>
                                        <dt>Active sessions</dt>
                                        <dd>{user.activeSessionCount}</dd>
                                    </div>
                                    {user.nextSessionExpiresAt && (
                                        <div>
                                            <dt>Next expiration</dt>
                                            <dd>{new Date(user.nextSessionExpiresAt).toLocaleString()}</dd>
                                        </div>
                                    )}
                                </>
                            )}
                        </dl>

                        <h4 className="dashboard-subsection-heading">Recent Activity</h4>
                        {user.recentActivity.length === 0 ? (
                            <p className="dashboard-table-message">No security activity recorded yet.</p>
                        ) : (
                            <ul className="recent-activity-list">
                                {user.recentActivity.map((entry) => (
                                    <li key={entry.id}>
                                        <div>
                                            <span>{entry.description}</span>
                                            {!entry.success && (
                                                <span className="dashboard-badge dashboard-badge--danger" style={{ marginLeft: 8 }}>
                                                    Failed
                                                </span>
                                            )}
                                        </div>
                                        <span className="dashboard-table-muted">{timeAgo(entry.createdAt)}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <div className="dashboard-modal-actions">
                    <button type="button" className="dashboard-modal-cancel-btn" onClick={modal.close}>
                        Close
                    </button>
                    {user && !modal.isSelf && user.hasActiveSession && (
                        <button
                            type="button"
                            className="dashboard-action-btn"
                            onClick={modal.openRevokeConfirm}
                            disabled={modal.isRevoking}
                        >
                            Force Logout
                        </button>
                    )}
                    {user && !modal.isSelf && (
                        user.isDisabled ? (
                            <button
                                type="button"
                                className="dashboard-modal-primary-btn"
                                onClick={modal.handleEnable}
                                disabled={modal.isEnabling}
                            >
                                {modal.isEnabling ? "Enabling..." : "Enable Account"}
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="dashboard-modal-confirm-btn"
                                onClick={modal.openDisableConfirm}
                                disabled={modal.isDisabling}
                            >
                                Disable Account
                            </button>
                        )
                    )}
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default UserDetailDrawer;
