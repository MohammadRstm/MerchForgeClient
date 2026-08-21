import "./SuperAdminDashboard.css";
import Modal from "../../../components/Modal/Modal";
import Spinner from "../../../components/LoadingSpinner/LoadingSpinner";
import StatCards from "../../../components/DashboardWidgets/StatCards";
import BreakdownPieChart from "../../../components/DashboardWidgets/BreakdownPieChart";
import GrowthBarChart from "../../../components/DashboardWidgets/GrowthBarChart";
import useAuth from "../../../context/Auth/useAuth";
import useSuperAdminDashboardPage from "./hooks/useSuperAdminDashboardPage";
import UsersTable from "./components/UsersTable";
import BusinessesTable from "./components/BusinessesTable";
import WebsiteTemplatesTable from "./components/WebsiteTemplatesTable";
import InviteBusinessOwnerModal from "./components/InviteBusinessOwnerModal";
import CreateWebsiteTemplateModal from "./components/CreateWebsiteTemplateModal";

const SuperAdminDashboard = () => {
    const { session } = useAuth();

    const {
        stats,
        statsLoading,
        statsError,

        usersPage,
        usersLoading,
        usersFetching,
        usersError,
        usersTable,

        businessesPage,
        businessesLoading,
        businessesFetching,
        businessesError,
        businessesTable,

        websiteTemplates,
        websiteTemplatesLoading,
        websiteTemplatesError,

        revokeConfirmation,
        inviteForm,
        createTemplateForm,
    } = useSuperAdminDashboardPage();

    return (
        <main className="dashboard-page">
            <div className="dashboard-page-header">
                <h1 className="dashboard-heading">Platform Dashboard</h1>

                <button
                    type="button"
                    className="dashboard-primary-btn"
                    onClick={inviteForm.open}
                >
                    Invite business owner
                </button>
            </div>

            {statsLoading ? (
                <div className="dashboard-stats-loading">
                    <Spinner size={32} />
                </div>
            ) : statsError || !stats ? (
                <p className="dashboard-table-message dashboard-table-message--error">
                    Failed to load platform statistics. Please try again.
                </p>
            ) : (
                <>
                    <StatCards
                        cards={[
                            { label: "Total Users", value: stats.totalUsers },
                            { label: "Total Businesses", value: stats.totalBusinesses },
                            { label: "Total Products", value: stats.totalProducts },
                            { label: "Product Drafts", value: stats.totalProductDrafts },
                            { label: "Pending Invitations", value: stats.pendingInvitations },
                        ]}
                    />

                    <div className="widget-charts-grid">
                        <BreakdownPieChart
                            title="Users by System Role"
                            data={stats.usersBySystemRole.map((entry) => ({ label: entry.key, count: entry.count }))}
                        />
                        <BreakdownPieChart
                            title="Business Members by Role"
                            data={stats.businessUsersByRole.map((entry) => ({ label: entry.key, count: entry.count }))}
                        />
                        <GrowthBarChart title="Businesses Created (6mo)" data={stats.businessesOverTime} />
                        <GrowthBarChart
                            title="Products Created (6mo)"
                            data={stats.productsOverTime}
                            color="#3b82f6"
                        />
                    </div>
                </>
            )}

            <UsersTable
                usersPage={usersPage}
                isLoading={usersLoading}
                isFetching={usersFetching}
                isError={usersError}
                tableState={usersTable}
                currentUserId={session?.userId ?? ""}
                onRevoke={revokeConfirmation.requestRevoke}
            />

            <BusinessesTable
                businessesPage={businessesPage}
                isLoading={businessesLoading}
                isFetching={businessesFetching}
                isError={businessesError}
                tableState={businessesTable}
            />

            <WebsiteTemplatesTable
                templates={websiteTemplates}
                isLoading={websiteTemplatesLoading}
                isError={websiteTemplatesError}
                onAdd={createTemplateForm.open}
            />

            <InviteBusinessOwnerModal form={inviteForm} />

            <CreateWebsiteTemplateModal form={createTemplateForm} />

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

export default SuperAdminDashboard;
