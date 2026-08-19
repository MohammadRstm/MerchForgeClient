import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Pagination from "../../../../components/Pagination/Pagination";
import SortableHeader from "../../../../components/SortableHeader/SortableHeader";
import type { PagedResult } from "../../../../types/pagination";
import type useBusinessesTableState from "../hooks/ui/useBusinessesTableState";
import type { DashboardBusinessResponse } from "../types";

type BusinessesTableProps = {
    businessesPage?: PagedResult<DashboardBusinessResponse>;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    tableState: ReturnType<typeof useBusinessesTableState>;
};

const BusinessesTable = ({
    businessesPage,
    isLoading,
    isFetching,
    isError,
    tableState,
}: BusinessesTableProps) => {
    const { query, searchInput, handleSearchChange, handleSortChange, setPage } = tableState;

    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Businesses</h3>

                <div className="dashboard-table-controls">
                    <input
                        type="text"
                        className="dashboard-search-input"
                        placeholder="Search by business name..."
                        value={searchInput}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="dashboard-table-message dashboard-table-message--error">
                    Failed to load businesses. Please try again.
                </p>
            ) : !businessesPage || businessesPage.items.length === 0 ? (
                <p className="dashboard-table-message">
                    {query.search ? "No businesses match your search." : "No businesses yet."}
                </p>
            ) : (
                <div className="dashboard-table-wrapper">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <SortableHeader
                                    label="Business"
                                    field="Name"
                                    sortBy={query.sortBy}
                                    sortDescending={query.sortDescending}
                                    onSort={handleSortChange}
                                />
                                <th>Owner</th>
                                <SortableHeader
                                    label="Members"
                                    field="MemberCount"
                                    sortBy={query.sortBy}
                                    sortDescending={query.sortDescending}
                                    onSort={handleSortChange}
                                />
                                <SortableHeader
                                    label="Products"
                                    field="ProductCount"
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
                            </tr>
                        </thead>

                        <tbody style={{ opacity: isFetching ? 0.6 : 1 }}>
                            {businessesPage.items.map((business) => (
                                <tr key={business.id}>
                                    <td>{business.name}</td>
                                    <td>
                                        <div className="dashboard-owner-cell">
                                            <span>{business.ownerFullName}</span>
                                            <span className="dashboard-owner-email">{business.ownerEmail}</span>
                                        </div>
                                    </td>
                                    <td>{business.memberCount}</td>
                                    <td>{business.productCount}</td>
                                    <td>{new Date(business.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination
                page={businessesPage?.page ?? 1}
                totalPages={businessesPage?.totalPages ?? 0}
                onPageChange={setPage}
            />
        </section>
    );
};

export default BusinessesTable;
