import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Pagination from "../../../../components/Pagination/Pagination";
import SortableHeader from "../../../../components/SortableHeader/SortableHeader";
import type { PagedResult } from "../../../../types/pagination";
import { formatCurrency } from "../utils/formatCurrency";
import type useCustomersTableState from "../hooks/ui/useCustomersTableState";
import type { BusinessOption, DashboardCustomerResponse } from "../types";

const initials = (firstName: string, lastName: string) =>
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

type CustomersTableProps = {
    customersPage?: PagedResult<DashboardCustomerResponse>;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    tableState: ReturnType<typeof useCustomersTableState>;
    businessOptions: BusinessOption[];
    onOpenCustomer: (customerId: string) => void;
};

const CustomersTable = ({
    customersPage,
    isLoading,
    isFetching,
    isError,
    tableState,
    businessOptions,
    onOpenCustomer,
}: CustomersTableProps) => {
    const {
        query,
        searchInput,
        businessId,
        businessName,
        hasOrders,
        registeredFrom,
        registeredTo,
        hasActiveFilters,
        handleSearchChange,
        handleBusinessChange,
        clearBusinessFilter,
        handleHasOrdersChange,
        handleRegisteredFromChange,
        handleRegisteredToChange,
        handleSortChange,
        clearFilters,
        setPage,
    } = tableState;

    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Customers</h3>

                <div className="dashboard-table-controls">
                    <input
                        type="text"
                        className="dashboard-search-input"
                        placeholder="Search by name, email, or phone..."
                        value={searchInput}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />

                    <select
                        className="dashboard-filter-select"
                        value={businessId ?? ""}
                        onChange={(e) => {
                            const selected = businessOptions.find((b) => b.id === e.target.value);
                            handleBusinessChange(selected?.id ?? "", selected?.name ?? "");
                        }}
                    >
                        <option value="">All businesses</option>
                        {businessOptions.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.name}
                            </option>
                        ))}
                    </select>

                    <select
                        className="dashboard-filter-select"
                        value={hasOrders === undefined ? "" : String(hasOrders)}
                        onChange={(e) => handleHasOrdersChange(e.target.value === "" ? undefined : e.target.value === "true")}
                    >
                        <option value="">Any order activity</option>
                        <option value="true">Has orders</option>
                        <option value="false">No orders</option>
                    </select>

                    <input
                        type="date"
                        className="dashboard-invite-input audit-date-input"
                        value={registeredFrom}
                        onChange={(e) => handleRegisteredFromChange(e.target.value)}
                        aria-label="Registered from"
                    />
                    <input
                        type="date"
                        className="dashboard-invite-input audit-date-input"
                        value={registeredTo}
                        onChange={(e) => handleRegisteredToChange(e.target.value)}
                        aria-label="Registered to"
                    />

                    {hasActiveFilters && (
                        <button type="button" className="dashboard-inline-link-btn" onClick={clearFilters}>
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            {businessId && (
                <p className="dashboard-filter-notice">
                    Showing customers of <strong>{businessName ?? "this business"}</strong> only.{" "}
                    <button type="button" className="dashboard-inline-link-btn" onClick={clearBusinessFilter}>
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
                    Failed to load customers. Please try again.
                </p>
            ) : !customersPage || customersPage.items.length === 0 ? (
                <p className="dashboard-table-message">
                    {hasActiveFilters ? "No customers match your filters." : "No storefront customers yet."}
                </p>
            ) : (
                <div className="dashboard-table-wrapper">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <SortableHeader
                                    label="Customer"
                                    field="Name"
                                    sortBy={query.sortBy}
                                    sortDescending={query.sortDescending}
                                    onSort={handleSortChange}
                                />
                                <th>Businesses</th>
                                <SortableHeader
                                    label="Orders"
                                    field="OrderCount"
                                    sortBy={query.sortBy}
                                    sortDescending={query.sortDescending}
                                    onSort={handleSortChange}
                                />
                                <SortableHeader
                                    label="Total Spent"
                                    field="TotalSpent"
                                    sortBy={query.sortBy}
                                    sortDescending={query.sortDescending}
                                    onSort={handleSortChange}
                                />
                                <SortableHeader
                                    label="Last Order"
                                    field="LastOrderAt"
                                    sortBy={query.sortBy}
                                    sortDescending={query.sortDescending}
                                    onSort={handleSortChange}
                                />
                                <SortableHeader
                                    label="Registered"
                                    field="CreatedAt"
                                    sortBy={query.sortBy}
                                    sortDescending={query.sortDescending}
                                    onSort={handleSortChange}
                                />
                                <th>Session</th>
                            </tr>
                        </thead>

                        <tbody style={{ opacity: isFetching ? 0.6 : 1 }}>
                            {customersPage.items.map((customer) => (
                                <tr
                                    key={customer.id}
                                    className="dashboard-table-row--clickable"
                                    onClick={() => onOpenCustomer(customer.id)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            onOpenCustomer(customer.id);
                                        }
                                    }}
                                >
                                    <td>
                                        <div className="dashboard-user-cell">
                                            <span className="dashboard-user-avatar" aria-hidden="true">
                                                {initials(customer.firstName, customer.lastName)}
                                            </span>
                                            <div className="dashboard-owner-cell">
                                                <span>{customer.firstName} {customer.lastName}</span>
                                                <span className="dashboard-owner-email">{customer.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {customer.recentBusinessNames.length === 0 ? (
                                            <span className="dashboard-table-muted">No business activity</span>
                                        ) : (
                                            <div className="dashboard-plan-cell">
                                                {customer.recentBusinessNames.map((name) => (
                                                    <span key={name}>{name}</span>
                                                ))}
                                                {customer.additionalBusinessCount > 0 && (
                                                    <span className="dashboard-table-muted">
                                                        +{customer.additionalBusinessCount} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td>{customer.orderCount}</td>
                                    <td>
                                        {customer.spentCurrency
                                            ? formatCurrency(customer.totalSpent, customer.spentCurrency)
                                            : "—"}
                                    </td>
                                    <td>{customer.lastOrderAt ? new Date(customer.lastOrderAt).toLocaleDateString() : "—"}</td>
                                    <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`dashboard-session${customer.hasActiveSession ? " dashboard-session--active" : ""}`}>
                                            {customer.hasActiveSession ? "Active" : "None"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination
                page={customersPage?.page ?? 1}
                totalPages={customersPage?.totalPages ?? 0}
                onPageChange={setPage}
            />
        </section>
    );
};

export default CustomersTable;
