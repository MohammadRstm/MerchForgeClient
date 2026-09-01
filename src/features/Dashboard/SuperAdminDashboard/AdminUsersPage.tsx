import "./SuperAdminDashboard.css";
import "../BusinessOwnerDashboard/BusinessOwnerDashboard.css";
import Modal from "../../../components/Modal/Modal";
import useAuth from "../../../context/Auth/useAuth";
import useAdminUsersPage from "./hooks/useAdminUsersPage";
import UsersTable from "./components/UsersTable";
import UserSecurityKpis from "./components/UserSecurityKpis";
import PlatformRoleDistribution from "./components/PlatformRoleDistribution";
import UserDetailDrawer from "./components/UserDetailDrawer";
import DisableAccountModal from "./components/DisableAccountModal";
import ForceLogoutModal from "./components/ForceLogoutModal";
import RevokeAllSessionsModal from "./components/RevokeAllSessionsModal";
import SecurityOverviewKpis from "./components/SecurityOverviewKpis";
import SecurityActivityChart from "./components/SecurityActivityChart";
import FailedLoginMonitor from "./components/FailedLoginMonitor";
import SecurityAlertsPanel from "./components/SecurityAlertsPanel";
import SessionManagementPanel from "./components/SessionManagementPanel";
import AuditLogTable from "./components/AuditLogTable";

const AdminUsersPage = () => {
    const { session } = useAuth();
    const currentUserId = session?.userId ?? "";

    const {
        tab,
        setTab,

        stats,
        statsLoading,
        statsError,
        activeUsersCount,
        activeUsersLoading,

        usersPage,
        usersLoading,
        usersFetching,
        usersError,
        usersTable,
        revokeConfirmation,
        userDetailModal,
        revokeAllSessionsModal,
        goToUserRole,

        auditTable,
        auditLogsPage,
        auditLogsLoading,
        auditLogsFetching,
        auditLogsError,

        securityOverview,
        securityOverviewLoading,
        securityOverviewError,
        failedLoginStats,
        failedLoginStatsLoading,
        failedLoginStatsError,
        securityAlerts,
        securityAlertsLoading,
        securityAlertsError,
    } = useAdminUsersPage(currentUserId);

    return (
        <main className="dashboard-page">
            <div className="dashboard-page-header">
                <div>
                    <h1 className="dashboard-heading">Users & Security</h1>
                    <p className="dashboard-subheading">Manage platform access, user accounts, sessions, and security activity.</p>
                </div>
            </div>

            <div className="order-status-tabs" role="tablist" aria-label="Users and Security sections">
                <button
                    type="button"
                    role="tab"
                    aria-selected={tab === "users"}
                    className={`order-status-tab${tab === "users" ? " order-status-tab--active" : ""}`}
                    onClick={() => setTab("users")}
                >
                    Users
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={tab === "security"}
                    className={`order-status-tab${tab === "security" ? " order-status-tab--active" : ""}`}
                    onClick={() => setTab("security")}
                >
                    Security
                </button>
            </div>

            {tab === "users" ? (
                <>
                    <UserSecurityKpis
                        stats={stats}
                        isLoading={statsLoading}
                        isError={statsError}
                        activeUsersCount={activeUsersCount}
                        activeUsersLoading={activeUsersLoading}
                    />

                    <PlatformRoleDistribution
                        data={stats?.usersBySystemRole}
                        isLoading={statsLoading}
                        isError={statsError}
                        onSelectRole={goToUserRole}
                    />

                    <UsersTable
                        usersPage={usersPage}
                        isLoading={usersLoading}
                        isFetching={usersFetching}
                        isError={usersError}
                        tableState={usersTable}
                        currentUserId={currentUserId}
                        onOpenUser={(user) => userDetailModal.open(user.id)}
                        onRevoke={revokeConfirmation.requestRevoke}
                    />

                    <UserDetailDrawer modal={userDetailModal} />
                    <DisableAccountModal modal={userDetailModal} />
                    <ForceLogoutModal modal={userDetailModal} />

                    <Modal isOpen={!!revokeConfirmation.pendingUser} onClose={revokeConfirmation.cancelRevoke}>
                        <Modal.Header>
                            <h2>Force Logout</h2>
                        </Modal.Header>
                        <Modal.Body>
                            <p>
                                This will terminate all active sessions for{" "}
                                <strong>
                                    {revokeConfirmation.pendingUser?.firstName} {revokeConfirmation.pendingUser?.lastName}
                                </strong>{" "}
                                ({revokeConfirmation.pendingUser?.email}).
                            </p>
                            <p>The user will need to sign in again.</p>
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
                                    {revokeConfirmation.revokePending ? "Logging out..." : "Force Logout"}
                                </button>
                            </div>
                        </Modal.Footer>
                    </Modal>
                </>
            ) : (
                <>
                    <SecurityOverviewKpis
                        overview={securityOverview}
                        isLoading={securityOverviewLoading}
                        isError={securityOverviewError}
                    />

                    <SecurityActivityChart
                        points={securityOverview?.activityOverTime}
                        isLoading={securityOverviewLoading}
                        isError={securityOverviewError}
                    />

                    <SecurityAlertsPanel
                        alerts={securityAlerts}
                        isLoading={securityAlertsLoading}
                        isError={securityAlertsError}
                    />

                    <div className="business-detail-two-col">
                        <FailedLoginMonitor
                            stats={failedLoginStats}
                            isLoading={failedLoginStatsLoading}
                            isError={failedLoginStatsError}
                        />

                        <SessionManagementPanel
                            activeSessions={securityOverview?.activeSessions}
                            isLoading={securityOverviewLoading}
                            onRevokeAll={revokeAllSessionsModal.open}
                        />
                    </div>

                    <AuditLogTable
                        auditLogsPage={auditLogsPage}
                        isLoading={auditLogsLoading}
                        isFetching={auditLogsFetching}
                        isError={auditLogsError}
                        tableState={auditTable}
                    />

                    <RevokeAllSessionsModal modal={revokeAllSessionsModal} />
                </>
            )}
        </main>
    );
};

export default AdminUsersPage;
