import "./SuperAdminDashboard.css";
import Modal from "../../../components/Modal/Modal";
import useAuth from "../../../context/Auth/useAuth";
import useAdminUsersPage from "./hooks/useAdminUsersPage";
import UsersTable from "./components/UsersTable";

const AdminUsersPage = () => {
    const { session } = useAuth();

    const {
        usersPage,
        usersLoading,
        usersFetching,
        usersError,
        usersTable,
        revokeConfirmation,
    } = useAdminUsersPage();

    return (
        <main className="dashboard-page">
            <div className="dashboard-page-header">
                <h1 className="dashboard-heading">Users & Security</h1>
            </div>

            <UsersTable
                usersPage={usersPage}
                isLoading={usersLoading}
                isFetching={usersFetching}
                isError={usersError}
                tableState={usersTable}
                currentUserId={session?.userId ?? ""}
                onRevoke={revokeConfirmation.requestRevoke}
            />

            <Modal
                isOpen={!!revokeConfirmation.pendingUser}
                onClose={revokeConfirmation.cancelRevoke}
            >
                <Modal.Header>
                    <h2>Revoke sessions?</h2>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        This will sign out{" "}
                        <strong>
                            {revokeConfirmation.pendingUser?.firstName}{" "}
                            {revokeConfirmation.pendingUser?.lastName}
                        </strong>{" "}
                        ({revokeConfirmation.pendingUser?.email}) everywhere. They can log back in
                        with their existing password.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <div className="dashboard-modal-actions">
                        <button
                            type="button"
                            className="dashboard-modal-cancel-btn"
                            onClick={revokeConfirmation.cancelRevoke}
                            disabled={revokeConfirmation.revokePending}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="dashboard-modal-confirm-btn"
                            onClick={revokeConfirmation.confirmRevoke}
                            disabled={revokeConfirmation.revokePending}
                        >
                            {revokeConfirmation.revokePending ? "Revoking..." : "Revoke sessions"}
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
        </main>
    );
};

export default AdminUsersPage;
