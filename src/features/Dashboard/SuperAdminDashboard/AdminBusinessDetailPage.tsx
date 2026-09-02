import "./SuperAdminDashboard.css";
import "../BusinessOwnerDashboard/BusinessOwnerDashboard.css";
import { Link, useNavigate } from "react-router";
import Spinner from "../../../components/LoadingSpinner/LoadingSpinner";
import StatCards from "../../../components/DashboardWidgets/StatCards";
import Modal from "../../../components/Modal/Modal";
import { routes } from "../../../config/routes";
import useAdminBusinessDetailPage from "./hooks/useAdminBusinessDetailPage";
import BusinessQuickActions from "./components/BusinessQuickActions";
import BusinessNeedsAttention from "./components/BusinessNeedsAttention";
import BusinessSalesPerformance from "./components/BusinessSalesPerformance";
import BusinessProductOverview from "./components/BusinessProductOverview";
import BusinessInventorySnapshot from "./components/BusinessInventorySnapshot";
import BusinessRecentOrders from "./components/BusinessRecentOrders";
import AdminSubscriptionCard from "./components/AdminSubscriptionCard";
import BusinessInformationCard from "./components/BusinessInformationCard";
import DemoBusinessCredentialsBanner from "./components/DemoBusinessCredentialsBanner";
import { formatCurrency } from "./utils/formatCurrency";

const AdminBusinessDetailPage = () => {
    const {
        businessId,
        business,
        isLoading,
        isError,

        kpiOrderAnalytics,
        kpiOrderAnalyticsLoading,

        salesPreset,
        setSalesPreset,
        salesPresets,
        salesMetric,
        setSalesMetric,
        salesAnalytics,
        salesAnalyticsLoading,
        salesAnalyticsFetching,
        salesAnalyticsError,

        recentOrders,
        recentOrdersLoading,
        recentOrdersError,

        inventorySummary,
        inventorySummaryLoading,
        inventorySummaryError,

        topProducts,
        productPerformanceLoading,
        productPerformanceError,

        customerSnapshot,
        customerSnapshotLoading,

        revokeConfirmOpen,
        openRevokeConfirm,
        closeRevokeConfirm,
        confirmRevoke,
        isRevoking,
        revokeResult,

        catalogue,
        catalogueLoading,
        catalogueError,
        shapeLoading,
        fieldOverrides,
        toggleKey,
        updateFieldOverride,
        saveMetadataShape,
        isSavingShape,
        shapeSaved,
    } = useAdminBusinessDetailPage();

    const navigate = useNavigate();

    if (isLoading) {
        return (
            <main className="dashboard-page">
                <div className="dashboard-stats-loading">
                    <Spinner size={32} />
                </div>
            </main>
        );
    }

    if (isError || !business) {
        return (
            <main className="dashboard-page">
                <p className="dashboard-table-message dashboard-table-message--error">
                    Failed to load this business. Please try again.
                </p>
            </main>
        );
    }

    return (
        <main className="dashboard-page">
            <div className="dashboard-page-header">
                <div>
                    <h1 className="dashboard-heading">{business.name}</h1>
                    <p className="dashboard-subheading">
                        Owner: {business.ownerFullName} · Domain: {business.domainName ?? "Not set"}
                    </p>
                </div>

                <div className="business-detail-header-actions">
                    <button type="button" className="dashboard-action-btn" onClick={() => navigate(routes.ADMIN_BUSINESSES)}>
                        Back to businesses
                    </button>
                    <BusinessQuickActions
                        websiteUrl={business.websiteUrl}
                        businessId={businessId}
                        businessName={business.name}
                        onRevokeSessions={openRevokeConfirm}
                    />
                </div>
            </div>

            <DemoBusinessCredentialsBanner businessId={businessId} isDemo={business.isDemo} />

            <StatCards
                cards={[
                    { label: "Products", value: business.productCount },
                    {
                        label: "Orders",
                        value: kpiOrderAnalyticsLoading ? "…" : kpiOrderAnalytics?.currentPeriod.orderCount ?? 0,
                    },
                    {
                        label: "Recorded Order Revenue",
                        value: kpiOrderAnalyticsLoading
                            ? "…"
                            : formatCurrency(kpiOrderAnalytics?.currentPeriod.revenue ?? 0, business.currency),
                    },
                    {
                        label: "Customers",
                        value: customerSnapshotLoading ? "…" : customerSnapshot?.totalCustomers ?? 0,
                    },
                    { label: "Team Members", value: business.members.length },
                ]}
            />

            <BusinessNeedsAttention business={business} inventorySummary={inventorySummary} />

            <BusinessSalesPerformance
                analytics={salesAnalytics}
                isLoading={salesAnalyticsLoading}
                isFetching={salesAnalyticsFetching}
                isError={salesAnalyticsError}
                preset={salesPreset}
                presets={salesPresets}
                onChangePreset={setSalesPreset}
                metric={salesMetric}
                onChangeMetric={setSalesMetric}
            />

            <div className="business-detail-two-col">
                <BusinessProductOverview
                    productCount={business.productCount}
                    productsByCategory={business.productsByCategory}
                    productDraftCount={business.productDraftCount}
                    topProducts={topProducts}
                    currency={business.currency}
                    isLoading={productPerformanceLoading}
                    isError={productPerformanceError}
                />
                <BusinessInventorySnapshot
                    summary={inventorySummary}
                    isLoading={inventorySummaryLoading}
                    isError={inventorySummaryError}
                />
            </div>

            <BusinessRecentOrders orders={recentOrders} isLoading={recentOrdersLoading} isError={recentOrdersError} />

            <section className="dashboard-table-card">
                <div className="dashboard-table-header">
                    <h3>Storefront</h3>
                </div>
                <dl className="business-detail-grid">
                    <div>
                        <dt>Website URL</dt>
                        <dd>
                            {business.websiteUrl ? (
                                <a href={business.websiteUrl} target="_blank" rel="noopener noreferrer" className="dashboard-inline-link">{business.websiteUrl}</a>
                            ) : "No storefront configured."}
                        </dd>
                    </div>
                    <div>
                        <dt>Template</dt>
                        <dd>{business.websiteTemplateLabel ?? "None chosen"}</dd>
                    </div>
                    <div>
                        <dt>Domain</dt>
                        <dd>{business.domainName ?? "Not set"}</dd>
                    </div>
                    <div>
                        <dt>Chosen</dt>
                        <dd>{business.websiteTemplateChosenAt ? new Date(business.websiteTemplateChosenAt).toLocaleDateString() : "—"}</dd>
                    </div>
                </dl>

                <h4 className="dashboard-subsection-heading">Website Requests</h4>
                {business.websiteTemplateRequests.length === 0 ? (
                    <p className="dashboard-table-message">No website requests yet.</p>
                ) : (
                    <div className="dashboard-table-wrapper">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Template</th>
                                    <th>Status</th>
                                    <th>Requested</th>
                                    <th>Final URL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {business.websiteTemplateRequests.map((request) => (
                                    <tr
                                        key={request.id}
                                        className="dashboard-table-row--clickable"
                                        onClick={() => navigate(`${routes.ADMIN_WEBSITE_REQUESTS}?requestId=${request.id}`)}
                                    >
                                        <td>{new Date(request.createdAt).toLocaleDateString()} · {request.templateLabel}</td>
                                        <td>
                                            <span className={`website-request-status website-request-status--${request.status.toLowerCase()}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            {request.finalWebsiteUrl ? (
                                                <a href={request.finalWebsiteUrl} target="_blank" rel="noopener noreferrer" className="dashboard-inline-link" onClick={(e) => e.stopPropagation()}>View</a>
                                            ) : "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <AdminSubscriptionCard
                subscription={business.subscription}
                activeSubscriberCountForPlan={business.activeSubscriberCountForPlan}
            />

            <section className="dashboard-table-card">
                <div className="dashboard-table-header">
                    <h3>Feature Credits</h3>
                </div>
                {business.featureCredits.length === 0 ? (
                    <p className="dashboard-table-message">No purchasable features configured.</p>
                ) : (
                    <div className="feature-credits-list">
                        {business.featureCredits.map((credit) => {
                            const percentUsed =
                                !credit.includedInPlan && credit.creditsGrantedTotal > 0
                                    ? Math.min(
                                          100,
                                          ((credit.creditsGrantedTotal - credit.creditsRemaining) /
                                              credit.creditsGrantedTotal) *
                                              100
                                      )
                                    : 0;

                            return (
                                <div key={credit.featureKey} className="feature-credit-row">
                                    <div className="feature-credit-row-header">
                                        <span>{credit.featureName}</span>
                                        {credit.includedInPlan ? (
                                            <span className="dashboard-badge dashboard-badge--success">
                                                Unlimited (in plan)
                                            </span>
                                        ) : credit.creditsGrantedTotal > 0 ? (
                                            <span className="dashboard-table-muted">
                                                {credit.creditsRemaining} / {credit.creditsGrantedTotal} remaining
                                            </span>
                                        ) : (
                                            <span className="dashboard-table-muted">No credits purchased</span>
                                        )}
                                    </div>
                                    {!credit.includedInPlan && credit.creditsGrantedTotal > 0 && (
                                        <div className="feature-credit-bar">
                                            <div
                                                className="feature-credit-bar-fill"
                                                style={{ width: `${percentUsed}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <BusinessInformationCard business={business} />

            <section className="dashboard-table-card">
                <div className="dashboard-table-header">
                    <h3>Team</h3>
                </div>
                {business.members.length === 0 ? (
                    <p className="dashboard-table-message">No team members.</p>
                ) : (
                    <div className="dashboard-table-wrapper">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {business.members.map((member) => (
                                    <tr key={member.userId}>
                                        <td>{member.firstName} {member.lastName}</td>
                                        <td>{member.email}</td>
                                        <td>
                                            <span className={`dashboard-badge dashboard-badge--${member.role.toLowerCase()}`}>
                                                {member.role}
                                            </span>
                                        </td>
                                        <td>{new Date(member.joinedAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section className="dashboard-table-card">
                <div className="dashboard-table-header">
                    <h3>Product Configuration</h3>
                    <Link to={routes.ADMIN_PRODUCT_FIELDS} className="dashboard-action-btn">
                        Manage domain fields
                    </Link>
                </div>

                {!business.businessDomainId ? (
                    <p className="dashboard-table-message">
                        This business has no domain set, so it has no metadata field catalogue yet.
                    </p>
                ) : catalogueLoading || shapeLoading || !fieldOverrides ? (
                    <div className="dashboard-table-loading">
                        <Spinner size={28} />
                    </div>
                ) : catalogueError ? (
                    <p className="dashboard-table-message dashboard-table-message--error">
                        Failed to load this domain's product fields. Please try again.
                    </p>
                ) : !catalogue || catalogue.length === 0 ? (
                    <p className="dashboard-table-message">
                        This domain has no optional product fields defined yet.{" "}
                        <Link to={routes.ADMIN_PRODUCT_FIELDS} className="dashboard-inline-link">Add one</Link>.
                    </p>
                ) : (
                    <>
                        <p className="dashboard-table-message" style={{ textAlign: "left", padding: 0, marginBottom: 12 }}>
                            Domain: <strong>{business.domainName}</strong>. Choose which of this domain's fields this
                            business's products may use, and customize each one. Existing product data is never
                            affected — this only changes what the product form asks for going forward.
                        </p>
                        <div className="metadata-shape-list">
                            {catalogue.map((attribute) => {
                                const override = fieldOverrides.get(attribute.key);
                                const isIncluded = !!override;

                                return (
                                    <div key={attribute.id} className="metadata-shape-item metadata-shape-item--editable">
                                        <label className="metadata-shape-item-toggle">
                                            <input
                                                type="checkbox"
                                                checked={isIncluded}
                                                onChange={() => toggleKey(attribute.key)}
                                            />
                                            <span className="metadata-shape-item-key">{attribute.key}</span>
                                            <span className="metadata-shape-item-type">
                                                {attribute.valueType}
                                                {!attribute.isActive && " · retired"}
                                            </span>
                                        </label>

                                        {isIncluded && (
                                            <div className="metadata-shape-item-fields">
                                                <input
                                                    type="text"
                                                    className="dashboard-invite-input"
                                                    value={override.label}
                                                    onChange={(e) => updateFieldOverride(attribute.key, "label", e.target.value)}
                                                    placeholder="Label"
                                                />
                                                <input
                                                    type="text"
                                                    className="dashboard-invite-input"
                                                    value={override.allowedValuesInput}
                                                    onChange={(e) =>
                                                        updateFieldOverride(attribute.key, "allowedValuesInput", e.target.value)
                                                    }
                                                    placeholder="Allowed values (comma-separated, optional)"
                                                />
                                                <label className="dashboard-invite-checkbox-row">
                                                    <input
                                                        type="checkbox"
                                                        checked={override.isRequired}
                                                        onChange={(e) =>
                                                            updateFieldOverride(attribute.key, "isRequired", e.target.checked)
                                                        }
                                                    />
                                                    Required
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <button
                            type="button"
                            className="dashboard-primary-btn"
                            onClick={saveMetadataShape}
                            disabled={isSavingShape}
                        >
                            {isSavingShape ? "Saving..." : "Save product structure"}
                        </button>
                        {shapeSaved && <span style={{ marginLeft: 12, color: "#12875a", fontSize: 13 }}>Saved.</span>}
                    </>
                )}
            </section>

            <Modal isOpen={revokeConfirmOpen} onClose={closeRevokeConfirm}>
                <Modal.Header>
                    <h2>Revoke all sessions?</h2>
                </Modal.Header>
                <Modal.Body>
                    {revokeResult ? (
                        <p>Revoked {revokeResult.revokedSessionsCount} session(s) for {business.name}.</p>
                    ) : (
                        <p>
                            This signs out every member of <strong>{business.name}</strong> ({businessId})
                            everywhere. They can log back in with their existing password.
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <div className="dashboard-modal-actions">
                        {revokeResult ? (
                            <button type="button" className="dashboard-modal-confirm-btn" onClick={closeRevokeConfirm}>
                                Done
                            </button>
                        ) : (
                            <>
                                <button type="button" className="dashboard-modal-cancel-btn" onClick={closeRevokeConfirm} disabled={isRevoking}>
                                    Cancel
                                </button>
                                <button type="button" className="dashboard-modal-confirm-btn" onClick={confirmRevoke} disabled={isRevoking}>
                                    {isRevoking ? "Revoking..." : "Revoke sessions"}
                                </button>
                            </>
                        )}
                    </div>
                </Modal.Footer>
            </Modal>
        </main>
    );
};

export default AdminBusinessDetailPage;
