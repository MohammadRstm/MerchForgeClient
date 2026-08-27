import "./SuperAdminDashboard.css";
import Spinner from "../../../components/LoadingSpinner/LoadingSpinner";
import StatCards from "../../../components/DashboardWidgets/StatCards";
import BreakdownPieChart from "../../../components/DashboardWidgets/BreakdownPieChart";
import GrowthBarChart from "../../../components/DashboardWidgets/GrowthBarChart";
import useAdminOverviewPage from "./hooks/useAdminOverviewPage";
import InviteBusinessOwnerModal from "./components/InviteBusinessOwnerModal";

const AdminOverviewPage = () => {
    const { stats, statsLoading, statsError, inviteForm } = useAdminOverviewPage();

    return (
        <main className="dashboard-page">
            <div className="dashboard-page-header">
                <h1 className="dashboard-heading">Platform Overview</h1>

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
                            { label: "Pending Website Requests", value: stats.pendingWebsiteTemplateRequests },
                            { label: "Completed Website Requests", value: stats.completedWebsiteTemplateRequests },
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

            <InviteBusinessOwnerModal form={inviteForm} />
        </main>
    );
};

export default AdminOverviewPage;
