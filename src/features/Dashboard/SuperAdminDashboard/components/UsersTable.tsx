import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Pagination from "../../../../components/Pagination/Pagination";
import SortableHeader from "../../../../components/SortableHeader/SortableHeader";
import type { PagedResult } from "../../../../types/pagination";
import { BUSINESS_ROLE_FILTER_OPTIONS, SYSTEM_ROLE_FILTER_OPTIONS } from "../constants";
import type useUsersTableState from "../hooks/ui/useUsersTableState";
import type { BusinessRoleFilter, DashboardUserResponse, SystemRoleFilter } from "../types";

type UsersTableProps = {
    usersPage?: PagedResult<DashboardUserResponse>;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    tableState: ReturnType<typeof useUsersTableState>;
    currentUserId: string;
    onOpenUser: (user: DashboardUserResponse) => void;
    onRevoke: (user: DashboardUserResponse) => void;
};

const initials = (firstName: string, lastName: string) =>
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

const UsersTable = ({
    usersPage,
    isLoading,
    isFetching,
    isError,
    tableState,
    currentUserId,
    onOpenUser,
    onRevoke,
}: UsersTableProps) => {
    const {
        query,
        searchInput,
        businessRole,
        hasActiveSession,
        isDisabled,
        hasActiveFilters,
        handleSearchChange,
        handleSystemRoleChange,
        handleBusinessRoleChange,
        handleHasActiveSessionChange,
        handleIsDisabledChange,
        handleSortChange,
        clearFilters,
        setPage,
    } = tableState;

    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Users</h3>

                <div className="dashboard-table-controls">
                    <input
                        type="text"
                        className="dashboard-search-input"
                        placeholder="Search by name, email, or business..."
                        value={searchInput}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />

                    <select
                        className="dashboard-filter-select"
                        value={query.systemRole ?? ""}
                        onChange={(e) =>
                            handleSystemRoleChange(e.target.value ? (e.target.value as SystemRoleFilter) : undefined)
                        }
                    >
                        <option value="">All system roles</option>
                        {SYSTEM_ROLE_FILTER_OPTIONS.map((role) => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                        ))}
                    </select>

                    <select
                        className="dashboard-filter-select"
                        value={businessRole ?? ""}
                        onChange={(e) =>
                            handleBusinessRoleChange(e.target.value ? (e.target.value as BusinessRoleFilter) : undefined)
                        }
                    >
                        <option value="">All business roles</option>
                        {BUSINESS_ROLE_FILTER_OPTIONS.map((role) => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                        ))}
                    </select>

                    <select
                        className="dashboard-filter-select"
                        value={hasActiveSession === undefined ? "" : String(hasActiveSession)}
                        onChange={(e) =>
                            handleHasActiveSessionChange(e.target.value === "" ? undefined : e.target.value === "true")
                        }
                    >
                        <option value="">Any session status</option>
                        <option value="true">Active session</option>
                        <option value="false">No active session</option>
                    </select>

                    <select
                        className="dashboard-filter-select"
                        value={isDisabled === undefined ? "" : String(isDisabled)}
                        onChange={(e) =>
                            handleIsDisabledChange(e.target.value === "" ? undefined : e.target.value === "true")
                        }
                    >
                        <option value="">Any account status</option>
                        <option value="false">Active</option>
                        <option value="true">Disabled</option>
                    </select>

                    {hasActiveFilters && (
                        <button type="button" className="dashboard-inline-link-btn" onClick={clearFilters}>
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="dashboard-table-message dashboard-table-message--error">
                    Failed to load users. Please try again.
                </p>
            ) : !usersPage || usersPage.items.length === 0 ? (
                <p className="dashboard-table-message">
                    {hasActiveFilters ? "No users match your search or filters." : "No platform users found."}
                </p>
            ) : (
                <div className="dashboard-table-wrapper">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <SortableHeader
                                    label="User"
                                    field="Name"
                                    sortBy={query.sortBy}
                                    sortDescending={query.sortDescending}
                                    onSort={handleSortChange}
                                />
                                <SortableHeader
                                    label="System Role"
                                    field="SystemRole"
                                    sortBy={query.sortBy}
                                    sortDescending={query.sortDescending}
                                    onSort={handleSortChange}
                                />
                                <th>Business / Membership</th>
                                <th>Account Status</th>
                                <SortableHeader
                                    label="Session"
                                    field="HasActiveSession"
                                    sortBy={query.sortBy}
                                    sortDescending={query.sortDescending}
                                    onSort={handleSortChange}
                                />
                                <SortableHeader
                                    label="Created"
                                    field="CreatedAt"
                                    sortBy={query.sortBy}
                                    sortDescending={query.sortDescending}
                                    onSort={handleSortChange}
                                />
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody style={{ opacity: isFetching ? 0.6 : 1 }}>
                            {usersPage.items.map((user) => {
                                const isSelf = user.id === currentUserId;

                                return (
                                    <tr
                                        key={user.id}
                                        className="dashboard-table-row--clickable"
                                        onClick={() => onOpenUser(user)}
                                    >
                                        <td>
                                            <div className="dashboard-user-cell">
                                                <span className="dashboard-user-avatar" aria-hidden="true">
                                                    {initials(user.firstName, user.lastName)}
                                                </span>
                                                <div className="dashboard-owner-cell">
                                                    <span>
                                                        {user.firstName} {user.lastName}
                                                        {isSelf && <span className="dashboard-you-tag"> (you)</span>}
                                                    </span>
                                                    <span className="dashboard-owner-email">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className={`dashboard-badge dashboard-badge--${user.systemRole.toLowerCase()}`}
                                            >
                                                {user.systemRole}
                                            </span>
                                        </td>
                                        <td>
                                            {user.businessName ? (
                                                <div className="dashboard-plan-cell">
                                                    <span>
                                                        {user.businessName}
                                                        <span className="dashboard-table-muted"> · {user.businessRole}</span>
                                                    </span>
                                                    {user.additionalMembershipCount > 0 && (
                                                        <span className="dashboard-table-muted">
                                                            +{user.additionalMembershipCount} business
                                                            {user.additionalMembershipCount === 1 ? "" : "es"}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="dashboard-table-muted">No business</span>
                                            )}
                                        </td>
                                        <td>
                                            <span
                                                className={`dashboard-badge ${user.isDisabled ? "dashboard-badge--danger" : "dashboard-badge--success"}`}
                                            >
                                                {user.isDisabled ? "Disabled" : "Active"}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={`dashboard-session${user.hasActiveSession ? " dashboard-session--active" : ""}`}
                                            >
                                                {user.hasActiveSession ? "Active" : "None"}
                                            </span>
                                        </td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="dashboard-action-btn"
                                                disabled={!user.hasActiveSession || isSelf}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onRevoke(user);
                                                }}
                                                title={
                                                    isSelf
                                                        ? "You cannot revoke your own sessions"
                                                        : !user.hasActiveSession
                                                          ? "No active session"
                                                          : "Force logout"
                                                }
                                            >
                                                Force Logout
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination
                page={usersPage?.page ?? 1}
                totalPages={usersPage?.totalPages ?? 0}
                onPageChange={setPage}
            />
        </section>
    );
};

export default UsersTable;
