import "./BusinessOwnerDashboard.css";
import { useNavigate } from "react-router";
import { routes } from "../../../config/routes";
import Spinner from "../../../components/LoadingSpinner/LoadingSpinner";
import StatCards from "../../../components/DashboardWidgets/StatCards";
import BreakdownPieChart from "../../../components/DashboardWidgets/BreakdownPieChart";
import GrowthBarChart from "../../../components/DashboardWidgets/GrowthBarChart";
import useOwnerOverviewPage from "./hooks/useOwnerOverviewPage";
import { resolveImageUrl } from "./utils/resolveImageUrl";

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
        subscription,
        features,
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
                    {(needsAttention || subscription || (features && features.length > 0)) && (
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
                                {stats.outOfStockProductCount > 0 && (
                                    <span className="business-dashboard-badge business-dashboard-badge--status-cancelled">
                                        {stats.outOfStockProductCount} out of stock
                                    </span>
                                )}
                                {subscription && (
                                    <span
                                        className={`business-dashboard-badge business-dashboard-badge--status-${subscription.status.toLowerCase()}`}
                                    >
                                        {subscription.planName} · {subscription.status}
                                    </span>
                                )}
                                {features?.map((feature) => (
                                    <span key={feature.featureKey} className="business-dashboard-badge">
                                        {feature.creditsRemaining} {feature.featureName} credit{feature.creditsRemaining === 1 ? "" : "s"}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    <StatCards
                        cards={[
                            { label: "Team Members", value: stats.memberCount },
                            { label: "Total Products", value: stats.productCount },
                            { label: "Product Drafts", value: stats.productDraftCount },
                            { label: "Out of Stock", value: stats.outOfStockProductCount },
                            {
                                label: "Price Range",
                                value:
                                    stats.minProductPrice != null && stats.maxProductPrice != null
                                        ? `${currencyFormatter.format(stats.minProductPrice)} – ${currencyFormatter.format(stats.maxProductPrice)}`
                                        : "—",
                            },
                            { label: "Business Since", value: new Date(stats.createdAt).toLocaleDateString() },
                        ]}
                    />

                    {stats.recentProducts.length > 0 && (
                        <section className="business-dashboard-table-card">
                            <div className="business-dashboard-table-header">
                                <h3>Recently added products</h3>
                            </div>
                            <div className="business-dashboard-table-wrapper">
                                <table className="business-dashboard-table">
                                    <tbody>
                                        {stats.recentProducts.map((product) => (
                                            <tr key={product.id}>
                                                <td>
                                                    {product.imageUrl ? (
                                                        <img
                                                            src={resolveImageUrl(product.imageUrl)}
                                                            alt=""
                                                            className="business-dashboard-product-thumb"
                                                        />
                                                    ) : (
                                                        <span className="business-dashboard-product-thumb-placeholder" aria-hidden="true">
                                                            {product.title.charAt(0).toUpperCase()}
                                                        </span>
                                                    )}
                                                </td>
                                                <td>{product.title}</td>
                                                <td>{product.category}</td>
                                                <td>{currencyFormatter.format(product.price)}</td>
                                                <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

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
