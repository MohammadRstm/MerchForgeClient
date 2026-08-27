import "./BusinessOwnerDashboard.css";
import { useNavigate } from "react-router";
import { routes } from "../../../config/routes";
import Spinner from "../../../components/LoadingSpinner/LoadingSpinner";
import StatCards from "../../../components/DashboardWidgets/StatCards";
import BreakdownPieChart from "../../../components/DashboardWidgets/BreakdownPieChart";
import GrowthBarChart from "../../../components/DashboardWidgets/GrowthBarChart";
import useOwnerOverviewPage from "./hooks/useOwnerOverviewPage";

const currencyFormatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
});

const OwnerOverviewPage = () => {
    const {
        businessName,
        stats,
        statsLoading,
        statsError,
        websiteTemplateOptions,
        websiteTemplateOptionsLoading,
        inProgressDraftCount,
    } = useOwnerOverviewPage();

    const navigate = useNavigate();

    const hasOpenWebsiteRequest = !!websiteTemplateOptions?.hasOpenRequest;
    const needsAttention = hasOpenWebsiteRequest || inProgressDraftCount > 0;

    return (
        <main className="business-dashboard-page">
            <div className="business-dashboard-page-header">
                <h1 className="business-dashboard-heading">{businessName || "Business"} Overview</h1>

                <div className="business-dashboard-header-actions">
                    {stats?.websiteUrl && (
                        <a
                            href={stats.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="business-dashboard-button-secondary"
                        >
                            View website
                        </a>
                    )}

                    {!websiteTemplateOptionsLoading && websiteTemplateOptions && (
                        <button
                            type="button"
                            className="business-dashboard-button-primary"
                            onClick={() => navigate(routes.DASHBOARD_WEBSITE)}
                        >
                            {hasOpenWebsiteRequest ? "View website request" : "Choose website template"}
                        </button>
                    )}
                </div>
            </div>

            {statsLoading ? (
                <div className="business-dashboard-stats-loading">
                    <Spinner size={32} />
                </div>
            ) : statsError || !stats ? (
                <p className="business-dashboard-table-message business-dashboard-table-message--error">
                    Failed to load business statistics. Please try again.
                </p>
            ) : (
                <>
                    {needsAttention && (
                        <section className="business-dashboard-table-card">
                            <div className="business-dashboard-table-header">
                                <h3>Needs attention</h3>
                            </div>
                            <div className="business-dashboard-header-actions">
                                {hasOpenWebsiteRequest && (
                                    <span className="business-dashboard-badge business-dashboard-badge--status-trialing">
                                        Website request in progress
                                    </span>
                                )}
                                {inProgressDraftCount > 0 && (
                                    <span className="business-dashboard-badge business-dashboard-badge--status-trialing">
                                        {inProgressDraftCount} product draft{inProgressDraftCount === 1 ? "" : "s"} in progress
                                    </span>
                                )}
                            </div>
                        </section>
                    )}

                    <StatCards
                        cards={[
                            { label: "Team Members", value: stats.memberCount },
                            { label: "Total Products", value: stats.productCount },
                            { label: "Product Drafts", value: stats.productDraftCount },
                            {
                                label: "Average Price",
                                value:
                                    stats.averageProductPrice != null
                                        ? currencyFormatter.format(stats.averageProductPrice)
                                        : "—",
                            },
                            { label: "Business Since", value: new Date(stats.createdAt).toLocaleDateString() },
                        ]}
                    />

                    <div className="widget-charts-grid">
                        <BreakdownPieChart
                            title="Products by Category"
                            data={stats.productsByCategory.map((entry) => ({ label: entry.key, count: entry.count }))}
                        />
                        <BreakdownPieChart
                            title="Team by Role"
                            data={stats.membersByRole.map((entry) => ({ label: entry.key, count: entry.count }))}
                        />
                        <BreakdownPieChart
                            title="Product Drafts by Status"
                            data={stats.productDraftsByStatus.map((entry) => ({ label: entry.key, count: entry.count }))}
                        />
                        <GrowthBarChart
                            title="Products Added (6mo)"
                            data={stats.productsOverTime}
                            color="#3b82f6"
                        />
                    </div>
                </>
            )}
        </main>
    );
};

export default OwnerOverviewPage;
