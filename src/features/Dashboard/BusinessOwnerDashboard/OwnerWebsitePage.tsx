import "./BusinessOwnerDashboard.css";
import { useNavigate } from "react-router";
import { routes } from "../../../config/routes";
import Spinner from "../../../components/LoadingSpinner/LoadingSpinner";
import useOwnerWebsitePage from "./hooks/useOwnerWebsitePage";
import type { WebsiteTemplateRequestStatus } from "./types";

const STATUS_BADGE_CLASS: Record<WebsiteTemplateRequestStatus, string> = {
    Pending: "business-dashboard-badge",
    InProgress: "business-dashboard-badge business-dashboard-badge--status-trialing",
    Closed: "business-dashboard-badge business-dashboard-badge--status-active",
};

const OwnerWebsitePage = () => {
    const {
        websiteUrl,
        hasActiveSubscription,
        websiteTemplateOptions,
        websiteTemplateOptionsLoading,
        websiteTemplateOptionsError,
        requests,
        requestsLoading,
        requestsError,
    } = useOwnerWebsitePage();

    const navigate = useNavigate();
    const hasOpenRequest = !!websiteTemplateOptions?.hasOpenRequest;

    return (
        <main className="business-dashboard-page">
            <div className="business-dashboard-page-header">
                <h1 className="business-dashboard-heading">Website & Templates</h1>

                <div className="business-dashboard-header-actions">
                    {websiteUrl && (
                        <a
                            href={websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="business-dashboard-button-secondary"
                        >
                            View website
                        </a>
                    )}

                    {websiteUrl && (
                        <button
                            type="button"
                            className="business-dashboard-button-primary"
                            onClick={() => navigate(routes.DASHBOARD_WEBSITE_CUSTOMIZE)}
                        >
                            Customize
                        </button>
                    )}

                    {!websiteTemplateOptionsLoading && websiteTemplateOptions && (
                        <button
                            type="button"
                            className="business-dashboard-button-primary"
                            onClick={() =>
                                navigate(
                                    hasActiveSubscription ? routes.CHOOSE_WEBSITE_TEMPLATE : routes.DASHBOARD_BILLING
                                )
                            }
                            title={hasActiveSubscription ? undefined : "Choose a plan first — a website needs an active subscription."}
                        >
                            {hasOpenRequest
                                ? "View website request"
                                : hasActiveSubscription
                                  ? "Choose website template"
                                  : "Choose a plan to build your website"}
                        </button>
                    )}
                </div>
            </div>

            <section className="business-dashboard-table-card">
                <div className="business-dashboard-table-header">
                    <h3>Current status</h3>
                </div>

                {websiteTemplateOptionsLoading ? (
                    <div className="business-dashboard-table-loading">
                        <Spinner size={28} />
                    </div>
                ) : websiteTemplateOptionsError || !websiteTemplateOptions ? (
                    <p className="business-dashboard-table-message business-dashboard-table-message--error">
                        Failed to load your website status. Please try again.
                    </p>
                ) : websiteUrl ? (
                    <p className="business-dashboard-table-message">
                        Your website is live at{" "}
                        <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                            {websiteUrl}
                        </a>
                        .
                    </p>
                ) : hasOpenRequest ? (
                    <p className="business-dashboard-table-message">
                        Your website request for {websiteTemplateOptions.domainName} businesses is being reviewed.
                        We'll be in touch once it's ready.
                    </p>
                ) : (
                    <p className="business-dashboard-table-message">
                        You don't have a website yet. Choose a template to request one.
                    </p>
                )}
            </section>

            <section className="business-dashboard-table-card">
                <div className="business-dashboard-table-header">
                    <h3>Request history</h3>
                </div>

                {requestsLoading ? (
                    <div className="business-dashboard-table-loading">
                        <Spinner size={28} />
                    </div>
                ) : requestsError ? (
                    <p className="business-dashboard-table-message business-dashboard-table-message--error">
                        Failed to load your request history. Please try again.
                    </p>
                ) : !requests || requests.length === 0 ? (
                    <p className="business-dashboard-table-message">
                        You haven't requested a website yet.
                    </p>
                ) : (
                    <div className="business-dashboard-table-wrapper">
                        <table className="business-dashboard-table">
                            <thead>
                                <tr>
                                    <th>Template</th>
                                    <th>Status</th>
                                    <th>Requested</th>
                                    <th>Build started</th>
                                    <th>Closed</th>
                                    <th>Final URL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map((request) => (
                                    <tr key={request.id}>
                                        <td>{request.templateLabel}</td>
                                        <td>
                                            <span className={STATUS_BADGE_CLASS[request.status]}>{request.status}</span>
                                        </td>
                                        <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                                        <td>{request.buildStartedAt ? new Date(request.buildStartedAt).toLocaleDateString() : "—"}</td>
                                        <td>{request.closedAt ? new Date(request.closedAt).toLocaleDateString() : "—"}</td>
                                        <td>
                                            {request.finalWebsiteUrl ? (
                                                <a href={request.finalWebsiteUrl} target="_blank" rel="noopener noreferrer">
                                                    View
                                                </a>
                                            ) : (
                                                "—"
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
};

export default OwnerWebsitePage;
