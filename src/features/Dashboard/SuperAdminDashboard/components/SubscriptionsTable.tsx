import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Pagination from "../../../../components/Pagination/Pagination";
import SortableHeader from "../../../../components/SortableHeader/SortableHeader";
import type { PagedResult } from "../../../../types/pagination";
import type useSubscriptionsTableState from "../hooks/ui/useSubscriptionsTableState";
import type { AdminSubscriptionListItem } from "../types";
import { subscriptionStatusBadge } from "../utils/subscriptionStatusBadge";

type SubscriptionsTableProps = {
    subscriptionsPage?: PagedResult<AdminSubscriptionListItem>;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    tableState: ReturnType<typeof useSubscriptionsTableState>;
    onOpenSubscription: (businessId: string) => void;
    onOpenBusiness: (businessId: string) => void;
};

const SubscriptionsTable = ({
    subscriptionsPage,
    isLoading,
    isFetching,
    isError,
    tableState,
    onOpenSubscription,
    onOpenBusiness,
}: SubscriptionsTableProps) => {
    const {
        query,
        searchInput,
        planName,
        billingInterval,
        status,
        handleSearchChange,
        clearPlanFilter,
        handleBillingIntervalChange,
        handleStatusChange,
        handleSortChange,
        setPage,
    } = tableState;

    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Subscription Management</h3>

                <div className="dashboard-table-controls">
                    <input
                        type="text"
                        className="dashboard-search-input"
                        placeholder="Search by business, owner name, or email..."
                        value={searchInput}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                    <select
                        className="dashboard-invite-input subscriptions-filter-select"
                        value={billingInterval ?? ""}
                        onChange={(e) => handleBillingIntervalChange(e.target.value as "Monthly" | "Yearly" | "")}
                    >
                        <option value="">All billing periods</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                    </select>
                    <select
                        className="dashboard-invite-input subscriptions-filter-select"
                        value={status ?? ""}
                        onChange={(e) => handleStatusChange(e.target.value as never)}
                    >
                        <option value="">All statuses</option>
                        <option value="Active">Active</option>
                        <option value="Trialing">Trialing</option>
                        <option value="PastDue">Past due</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Expired">Expired</option>
                    </select>
                </div>
            </div>

            {planName && (
                <p className="dashboard-filter-notice">
                    Filtered to <strong>{planName}</strong> subscribers only.{" "}
                    <button type="button" className="dashboard-inline-link-btn" onClick={clearPlanFilter}>
                        Clear filter
                    </button>
                </p>
            )}

            {isLoading ? (
                <div className="dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="dashboard-table-message dashboard-table-message--error">
                    Failed to load subscriptions. Please try again.
                </p>
            ) : !subscriptionsPage || subscriptionsPage.items.length === 0 ? (
                <p className="dashboard-table-message">
                    {query.search || planName || billingInterval || status
                        ? "No subscriptions match your filters."
                        : "No active subscriptions yet."}
                </p>
            ) : (
                <div className="dashboard-table-wrapper">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <SortableHeader
                                    label="Business"
                                    field="BusinessName"
                                    sortBy={query.sortBy}
                                    sortDescending={query.sortDescending}
                                    onSort={handleSortChange}
                                />
                                <SortableHeader
                                    label="Plan"
                                    field="PlanName"
                                    sortBy={query.sortBy}
                                    sortDescending={query.sortDescending}
                                    onSort={handleSortChange}
                                />
                                <th>Billing Period</th>
                                <th>Status</th>
                                <SortableHeader
                                    label="Started"
                                    field="CreatedAt"
                                    sortBy={query.sortBy}
                                    sortDescending={query.sortDescending}
                                    onSort={handleSortChange}
                                />
                                <SortableHeader
                                    label="Renewal / Expiration"
                                    field="CurrentPeriodEnd"
                                    sortBy={query.sortBy}
                                    sortDescending={query.sortDescending}
                                    onSort={handleSortChange}
                                />
                            </tr>
                        </thead>
                        <tbody style={{ opacity: isFetching ? 0.6 : 1 }}>
                            {subscriptionsPage.items.map((subscription) => {
                                const badge = subscriptionStatusBadge(subscription.status);

                                return (
                                    <tr
                                        key={subscription.subscriptionId}
                                        className="dashboard-table-row--clickable"
                                        onClick={() => onOpenSubscription(subscription.businessId)}
                                    >
                                        <td>
                                            <button
                                                type="button"
                                                className="dashboard-inline-link-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onOpenBusiness(subscription.businessId);
                                                }}
                                            >
                                                <div className="dashboard-owner-cell">
                                                    <span>{subscription.businessName}</span>
                                                    <span className="dashboard-owner-email">{subscription.ownerFullName}</span>
                                                </div>
                                            </button>
                                        </td>
                                        <td>
                                            <div className="dashboard-plan-cell">
                                                <span>{subscription.planName}</span>
                                                {!subscription.planIsActive && (
                                                    <span className="dashboard-table-muted">Plan inactive</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="dashboard-badge dashboard-badge--neutral">
                                                {subscription.billingInterval}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`dashboard-badge ${badge.className}`}>{badge.label}</span>
                                        </td>
                                        <td>{new Date(subscription.currentPeriodStart).toLocaleDateString()}</td>
                                        <td>
                                            {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                                            {subscription.cancelAtPeriodEnd && (
                                                <span className="dashboard-table-muted"> · not renewing</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination
                page={subscriptionsPage?.page ?? 1}
                totalPages={subscriptionsPage?.totalPages ?? 0}
                onPageChange={setPage}
            />
        </section>
    );
};

export default SubscriptionsTable;
