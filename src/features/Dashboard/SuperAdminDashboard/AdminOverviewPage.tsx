import "./SuperAdminDashboard.css";
import { useNavigate } from "react-router";
import Spinner from "../../../components/LoadingSpinner/LoadingSpinner";
import StatCards from "../../../components/DashboardWidgets/StatCards";
import BreakdownPieChart from "../../../components/DashboardWidgets/BreakdownPieChart";
import GrowthBarChart from "../../../components/DashboardWidgets/GrowthBarChart";
import useAdminOverviewPage from "./hooks/useAdminOverviewPage";
import InviteBusinessOwnerModal from "./components/InviteBusinessOwnerModal";
import { buildAdminBusinessDetailRoute } from "../../../config/routes";

const AdminOverviewPage = () => {
    const { stats, statsLoading, statsError, inviteForm } = useAdminOverviewPage();
    const navigate = useNavigate();

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
                            { label: "Active Sessions", value: stats.activeSessionCount },
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
                        <BreakdownPieChart
                            title="Businesses by Domain"
                            data={stats.businessesByDomain.map((entry) => ({ label: entry.key, count: entry.count }))}
                        />
                        <BreakdownPieChart
                            title="Subscriptions by Status"
                            data={stats.subscriptionsByStatus.map((entry) => ({ label: entry.key, count: entry.count }))}
                        />
                        <GrowthBarChart title="Businesses Created (6mo)" data={stats.businessesOverTime} />
                        <GrowthBarChart
                            title="Products Created (6mo)"
                            data={stats.productsOverTime}
                            color="#3b82f6"
                        />
                    </div>

                    {stats.recentBusinesses.length > 0 && (
                        <section className="dashboard-table-card">
                            <div className="dashboard-table-header">
                                <h3>Recently created businesses</h3>
                            </div>
                            <div className="dashboard-table-wrapper">
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>Business</th>
                                            <th>Owner</th>
                                            <th>Created</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recentBusinesses.map((business) => (
                                            <tr
                                                key={business.id}
                                                className="dashboard-table-row--clickable"
                                                onClick={() => navigate(buildAdminBusinessDetailRoute(business.id))}
                                            >
                                                <td>{business.name}</td>
                                                <td>
                                                    <div className="dashboard-owner-cell">
                                                        <span>{business.ownerFullName}</span>
                                                        <span className="dashboard-owner-email">{business.ownerEmail}</span>
                                                    </div>
                                                </td>
                                                <td>{new Date(business.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}
                </>
            )}

            <InviteBusinessOwnerModal form={inviteForm} />
        </main>
    );
};

export default AdminOverviewPage;
