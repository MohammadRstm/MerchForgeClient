import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Pagination from "../../../../components/Pagination/Pagination";
import SortableHeader from "../../../../components/SortableHeader/SortableHeader";
import type { PagedResult } from "../../../../types/pagination";
import { SYSTEM_ROLE_FILTER_OPTIONS } from "../constants";
import type useUsersTableState from "../hooks/ui/useUsersTableState";
import type { DashboardUserResponse, SystemRoleFilter } from "../types";

type UsersTableProps = {
    usersPage?: PagedResult<DashboardUserResponse>;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    tableState: ReturnType<typeof useUsersTableState>;
    currentUserId: string;
    onRevoke: (user: DashboardUserResponse) => void;
};

const UsersTable = ({
    usersPage,
    isLoading,
    isFetching,
    isError,
    tableState,
    currentUserId,
    onRevoke,
}: UsersTableProps) => {
    const {
        query,
        searchInput,
        handleSearchChange,
        handleSystemRoleChange,
        handleSortChange,
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
                        placeholder="Search by name or email..."
                        value={searchInput}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />

                    <select
                        className="dashboard-filter-select"
                        value={query.systemRole ?? ""}
                        onChange={(e) =>
                            handleSystemRoleChange(
                                e.target.value
                                    ? (e.target.value as SystemRoleFilter)
                                    : undefined
                            )
                        }
                    >
                        <option value="">All roles</option>
                        {SYSTEM_ROLE_FILTER_OPTIONS.map((role) => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                        ))}
                    </select>
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
                    {query.search || query.systemRole
                        ? "No users match your search or filters."
                        : "No users yet."}
                </p>
            ) : (
                <div className="dashboard-table-wrapper">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <SortableHeader
                                    label="Name"
                                    field="Name"
                                    sortBy={query.sortBy}
                                    sortDescending={query.sortDescending}
                                    onSort={handleSortChange}
                                />
                                <SortableHeader
                                    label="Email"
                                    field="Email"
                                    sortBy={query.sortBy}
                                    sortDescending={query.sortDescending}
                                    onSort={handleSortChange}
                                />
                                <th>System Role</th>
                                <th>Business</th>
                                <th>Session</th>
                                <SortableHeader
                                    label="Joined"
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
                                    <tr key={user.id}>
                                        <td>
                                            {user.firstName} {user.lastName}
                                            {isSelf && <span className="dashboard-you-tag"> (you)</span>}
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span
                                                className={`dashboard-badge dashboard-badge--${user.systemRole.toLowerCase()}`}
                                            >
                                                {user.systemRole}
                                            </span>
                                        </td>
                                        <td>
                                            {user.businessName
                                                ? `${user.businessName} (${user.businessRole})`
                                                : "—"}
                                        </td>
                                        <td>
                                            <span
                                                className={`dashboard-session${
                                                    user.hasActiveSession
                                                        ? " dashboard-session--active"
                                                        : ""
                                                }`}
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
                                                onClick={() => onRevoke(user)}
                                                title={
                                                    isSelf
                                                        ? "You cannot revoke your own sessions"
                                                        : !user.hasActiveSession
                                                        ? "No active session"
                                                        : "Revoke sessions"
                                                }
                                            >
                                                Revoke sessions
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
