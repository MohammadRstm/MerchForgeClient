import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Pagination from "../../../../components/Pagination/Pagination";
import SortableHeader from "../../../../components/SortableHeader/SortableHeader";
import type { PagedResult } from "../../../../types/pagination";
import type useCustomersTableState from "../hooks/ui/useCustomersTableState";
import type { DashboardCustomerResponse } from "../types";

type CustomersTableProps = {
    customersPage?: PagedResult<DashboardCustomerResponse>;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    tableState: ReturnType<typeof useCustomersTableState>;
    onOpenCustomer: (customerId: string) => void;
};

const CustomersTable = ({
    customersPage,
    isLoading,
    isFetching,
    isError,
    tableState,
    onOpenCustomer,
}: CustomersTableProps) => {
    const { query, searchInput, handleSearchChange, handleSortChange, setPage } = tableState;

    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Customers</h3>

                <div className="dashboard-table-controls">
                    <input
                        type="text"
                        className="dashboard-search-input"
                        placeholder="Search by name or email..."
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
                    Failed to load customers. Please try again.
                </p>
            ) : !customersPage || customersPage.items.length === 0 ? (
                <p className="dashboard-table-message">
                    {query.search ? "No customers match your search." : "No customers yet."}
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
                                <th>Orders</th>
                                <SortableHeader
                                    label="Joined"
                                    field="CreatedAt"
                                    sortBy={query.sortBy}
                                    sortDescending={query.sortDescending}
                                    onSort={handleSortChange}
                                />
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
                                    <td>{customer.firstName} {customer.lastName}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.orderCount}</td>
                                    <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
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
