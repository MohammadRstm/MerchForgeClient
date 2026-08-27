import "./SuperAdminDashboard.css";
import { Link, useNavigate } from "react-router";
import Spinner from "../../../components/LoadingSpinner/LoadingSpinner";
import StatCards from "../../../components/DashboardWidgets/StatCards";
import Modal from "../../../components/Modal/Modal";
import { routes } from "../../../config/routes";
import SubscriptionCard from "../BusinessOwnerDashboard/components/SubscriptionCard";
import useAdminBusinessDetailPage from "./hooks/useAdminBusinessDetailPage";

const currencyFormatter = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });

const AdminBusinessDetailPage = () => {
    const {
        businessId,
        business,
        isLoading,
        isError,

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
                <h1 className="dashboard-heading">{business.name}</h1>

                <div className="business-detail-header-actions">
                    <button type="button" className="dashboard-action-btn" onClick={() => navigate(routes.ADMIN_BUSINESSES)}>
                        Back to businesses
                    </button>
                    <button type="button" className="dashboard-action-btn" onClick={openRevokeConfirm}>
                        Revoke all sessions
                    </button>
                </div>
            </div>

            <section className="dashboard-table-card">
                <div className="dashboard-table-header">
                    <h3>Profile</h3>
                </div>
                <dl className="business-detail-grid">
                    <div>
                        <dt>Owner</dt>
                        <dd>{business.ownerFullName} ({business.ownerEmail})</dd>
                    </div>
                    <div>
                        <dt>Domain</dt>
                        <dd>{business.domainName ?? "Not set"}</dd>
                    </div>
                    <div>
                        <dt>Currency / Locale</dt>
                        <dd>{business.currency} / {business.locale}</dd>
                    </div>
                    <div>
                        <dt>Contact</dt>
                        <dd>{business.contactEmail ?? "—"} {business.contactPhone ? `· ${business.contactPhone}` : ""}</dd>
                    </div>
                    <div>
                        <dt>Created</dt>
                        <dd>{new Date(business.createdAt).toLocaleDateString()}</dd>
                    </div>
                </dl>
                {business.description && <p className="dashboard-table-message" style={{ textAlign: "left", padding: 0 }}>{business.description}</p>}
            </section>

            <StatCards
                cards={[
                    { label: "Members", value: business.members.length },
                    { label: "Products", value: business.productCount },
                    { label: "Product Drafts", value: business.productDraftCount },
                    {
                        label: "Average Price",
                        value: business.averageProductPrice != null ? currencyFormatter.format(business.averageProductPrice) : "—",
                    },
                ]}
            />

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
                    <h3>Website & templates</h3>
                </div>
                <dl className="business-detail-grid">
                    <div>
                        <dt>Website URL</dt>
                        <dd>
                            {business.websiteUrl ? (
                                <a href={business.websiteUrl} target="_blank" rel="noopener noreferrer">{business.websiteUrl}</a>
                            ) : "Not live yet"}
                        </dd>
                    </div>
                    <div>
                        <dt>Current template</dt>
                        <dd>{business.websiteTemplateLabel ?? "None chosen"}</dd>
                    </div>
                    <div>
                        <dt>Chosen</dt>
                        <dd>{business.websiteTemplateChosenAt ? new Date(business.websiteTemplateChosenAt).toLocaleDateString() : "—"}</dd>
                    </div>
                </dl>

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
                                    <tr key={request.id}>
                                        <td>{request.templateLabel}</td>
                                        <td>
                                            <span className={`website-request-status website-request-status--${request.status.toLowerCase()}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            {request.finalWebsiteUrl ? (
                                                <a href={request.finalWebsiteUrl} target="_blank" rel="noopener noreferrer">View</a>
                                            ) : "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <SubscriptionCard
                subscription={business.subscription ?? undefined}
                isLoading={false}
                isError={false}
            />

            <section className="dashboard-table-card">
                <div className="dashboard-table-header">
                    <h3>Feature credits</h3>
                </div>
                {business.featureCredits.length === 0 ? (
                    <p className="dashboard-table-message">No feature credits purchased.</p>
                ) : (
                    <div className="dashboard-table-wrapper">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th>Remaining</th>
                                    <th>Granted (total)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {business.featureCredits.map((credit) => (
                                    <tr key={credit.featureKey}>
                                        <td>{credit.featureName}</td>
                                        <td>{credit.creditsRemaining}</td>
                                        <td>{credit.creditsGrantedTotal}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section className="dashboard-table-card">
                <div className="dashboard-table-header">
                    <h3>Product structure</h3>
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
                        <Link to={routes.ADMIN_PRODUCT_FIELDS}>Add one</Link>.
                    </p>
                ) : (
                    <>
                        <p className="dashboard-table-message" style={{ textAlign: "left", padding: 0, marginBottom: 12 }}>
                            Choose which of this domain's fields this business's products may use, and customize each
                            one for this business. Existing product data is never affected — this only changes what
                            the product form asks for going forward. Need an entirely new field? Add it to the domain
                            catalogue first.
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
