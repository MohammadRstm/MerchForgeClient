import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Pagination from "../../../../components/Pagination/Pagination";
import type { PagedResult } from "../../../../types/pagination";
import type useAuditLogTableState from "../hooks/ui/useAuditLogTableState";
import type { AuditEventType, AuditLogResponse } from "../types";

type AuditLogTableProps = {
    auditLogsPage?: PagedResult<AuditLogResponse>;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    tableState: ReturnType<typeof useAuditLogTableState>;
};

const EVENT_TYPE_OPTIONS: AuditEventType[] = [
    "Authentication",
    "UserManagement",
    "BusinessManagement",
    "Subscription",
    "Template",
    "ProductFields",
    "Security",
];

const EVENT_TYPE_LABELS: Record<AuditEventType, string> = {
    Authentication: "Authentication",
    UserManagement: "User Management",
    BusinessManagement: "Business Management",
    Subscription: "Subscription",
    Template: "Template",
    ProductFields: "Product Fields",
    Security: "Security",
};

const humanizeAction = (action: string) => action.replace(/([a-z0-9])([A-Z])/g, "$1 $2");

const timeAgo = (isoDate: string): string => {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const minutes = Math.round(diffMs / 60_000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

    const days = Math.round(hours / 24);
    if (days === 1) return "yesterday";
    if (days < 14) return `${days} days ago`;

    return new Date(isoDate).toLocaleDateString();
};

const AuditLogTable = ({ auditLogsPage, isLoading, isFetching, isError, tableState }: AuditLogTableProps) => {
    const {
        actorInput,
        eventType,
        success,
        fromDate,
        toDate,
        hasActiveFilters,
        handleActorChange,
        handleEventTypeChange,
        handleSuccessChange,
        handleFromDateChange,
        handleToDateChange,
        clearFilters,
        setPage,
    } = tableState;

    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Audit Log</h3>

                <div className="dashboard-table-controls">
                    <input
                        type="text"
                        className="dashboard-search-input"
                        placeholder="Search by actor..."
                        value={actorInput}
                        onChange={(e) => handleActorChange(e.target.value)}
                    />

                    <select
                        className="dashboard-filter-select"
                        value={eventType ?? ""}
                        onChange={(e) => handleEventTypeChange(e.target.value ? (e.target.value as AuditEventType) : undefined)}
                    >
                        <option value="">All event types</option>
                        {EVENT_TYPE_OPTIONS.map((type) => (
                            <option key={type} value={type}>
                                {EVENT_TYPE_LABELS[type]}
                            </option>
                        ))}
                    </select>

                    <select
                        className="dashboard-filter-select"
                        value={success === undefined ? "" : String(success)}
                        onChange={(e) => handleSuccessChange(e.target.value === "" ? undefined : e.target.value === "true")}
                    >
                        <option value="">Any result</option>
                        <option value="true">Success</option>
                        <option value="false">Failure</option>
                    </select>

                    <input
                        type="date"
                        className="dashboard-invite-input audit-date-input"
                        value={fromDate}
                        onChange={(e) => handleFromDateChange(e.target.value)}
                        aria-label="From date"
                    />
                    <input
                        type="date"
                        className="dashboard-invite-input audit-date-input"
                        value={toDate}
                        onChange={(e) => handleToDateChange(e.target.value)}
                        aria-label="To date"
                    />

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
                    Unable to load security activity.
                </p>
            ) : !auditLogsPage || auditLogsPage.items.length === 0 ? (
                <p className="dashboard-table-message">
                    {hasActiveFilters ? "No activity matches your filters." : "No security activity recorded yet."}
                </p>
            ) : (
                <div className="dashboard-table-wrapper">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Actor</th>
                                <th>Action</th>
                                <th>Business</th>
                                <th>Result</th>
                            </tr>
                        </thead>
                        <tbody style={{ opacity: isFetching ? 0.6 : 1 }}>
                            {auditLogsPage.items.map((entry) => (
                                <tr key={entry.id}>
                                    <td title={new Date(entry.createdAt).toLocaleString()}>{timeAgo(entry.createdAt)}</td>
                                    <td>{entry.actorDisplayName}</td>
                                    <td>
                                        <div className="dashboard-plan-cell">
                                            <span>{humanizeAction(entry.action)}</span>
                                            <span className="dashboard-table-muted">{entry.description}</span>
                                        </div>
                                    </td>
                                    <td>{entry.businessName ?? "—"}</td>
                                    <td>
                                        <span className={`dashboard-badge ${entry.success ? "dashboard-badge--success" : "dashboard-badge--danger"}`}>
                                            {entry.success ? "Success" : "Failure"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination
                page={auditLogsPage?.page ?? 1}
                totalPages={auditLogsPage?.totalPages ?? 0}
                onPageChange={setPage}
            />
        </section>
    );
};

export default AuditLogTable;
