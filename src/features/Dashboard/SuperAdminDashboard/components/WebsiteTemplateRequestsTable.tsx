import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Pagination from "../../../../components/Pagination/Pagination";
import type { PagedResult } from "../../../../types/pagination";
import type useWebsiteTemplateRequestsTableState from "../hooks/ui/useWebsiteTemplateRequestsTableState";
import type { WebsiteTemplateRequestSummaryResponse, WebsiteTemplateRequestStatus } from "../types";

type WebsiteTemplateRequestsTableProps = {
    requestsPage?: PagedResult<WebsiteTemplateRequestSummaryResponse>;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    tableState: ReturnType<typeof useWebsiteTemplateRequestsTableState>;
    onOpen: (requestId: string) => void;
};

const STATUS_OPTIONS: WebsiteTemplateRequestStatus[] = ["Pending", "InProgress", "Closed"];

const WebsiteTemplateRequestsTable = ({
    requestsPage,
    isLoading,
    isFetching,
    isError,
    tableState,
    onOpen,
}: WebsiteTemplateRequestsTableProps) => {
    const { status, handleStatusChange, setPage } = tableState;

    return (
        <section className="dashboard-table-card" id="website-requests">
            <div className="dashboard-table-header">
                <h3>Website Requests</h3>

                <div className="dashboard-table-controls">
                    <select
                        className="dashboard-filter-select"
                        value={status ?? ""}
                        onChange={(e) => handleStatusChange(e.target.value as WebsiteTemplateRequestStatus | "")}
                    >
                        <option value="">All statuses</option>
                        {STATUS_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option}
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
                    Failed to load website requests. Please try again.
                </p>
            ) : !requestsPage || requestsPage.items.length === 0 ? (
                <p className="dashboard-table-message">
                    {status ? `No ${status} requests.` : "No website requests yet."}
                </p>
            ) : (
                <div className="dashboard-table-wrapper">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Request ID</th>
                                <th>Owner</th>
                                <th>Business ID</th>
                                <th>Template</th>
                                <th>Domain</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Final URL</th>
                            </tr>
                        </thead>

                        <tbody style={{ opacity: isFetching ? 0.6 : 1 }}>
                            {requestsPage.items.map((request) => (
                                <tr
                                    key={request.id}
                                    className="website-request-row"
                                    onClick={() => onOpen(request.id)}
                                >
                                    <td className="website-request-id-cell" title={request.id}>
                                        {request.id.slice(0, 8)}…
                                    </td>
                                    <td>
                                        <div className="dashboard-owner-cell">
                                            <span>{request.ownerFullName}</span>
                                            <span className="dashboard-owner-email">{request.ownerEmail}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="dashboard-owner-cell">
                                            <span>{request.businessName}</span>
                                            <span className="dashboard-owner-email" title={request.businessId}>
                                                {request.businessId.slice(0, 8)}…
                                            </span>
                                        </div>
                                    </td>
                                    <td>{request.templateLabel}</td>
                                    <td>{request.domainName}</td>
                                    <td>
                                        <span className={`website-request-status website-request-status--${request.status.toLowerCase()}`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        {request.finalWebsiteUrl ? (
                                            <a
                                                href={request.finalWebsiteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Visit
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

            <Pagination
                page={requestsPage?.page ?? 1}
                totalPages={requestsPage?.totalPages ?? 0}
                onPageChange={setPage}
            />
        </section>
    );
};

export default WebsiteTemplateRequestsTable;
