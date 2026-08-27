import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Pagination from "../../../../components/Pagination/Pagination";
import StockCell from "./StockCell";
import { resolveImageUrl } from "../utils/resolveImageUrl";
import type { PagedResult } from "../../../../types/pagination";
import type useProductsTableState from "../hooks/ui/useProductsTableState";
import type { BusinessProductResponse, ProductStockStatus } from "../types";

const STATUS_TABS: { value: ProductStockStatus | undefined; label: string }[] = [
    { value: undefined, label: "All" },
    { value: "LowStock", label: "Low Stock" },
    { value: "OutOfStock", label: "Out of Stock" },
    { value: "Untracked", label: "Untracked" },
];

type InventoryTableProps = {
    productsPage?: PagedResult<BusinessProductResponse>;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    tableState: ReturnType<typeof useProductsTableState>;
    onAddStock: (product: BusinessProductResponse) => void;
    onRemoveStock: (product: BusinessProductResponse) => void;
};

const InventoryTable = ({
    productsPage,
    isLoading,
    isFetching,
    isError,
    tableState,
    onAddStock,
    onRemoveStock,
}: InventoryTableProps) => {
    const { query, searchInput, handleSearchChange, handleStockStatusChange, setPage } = tableState;

    return (
        <section className="business-dashboard-table-card">
            <div className="business-dashboard-table-header">
                <h3>Products</h3>

                <div className="business-dashboard-table-controls">
                    <input
                        type="text"
                        className="business-dashboard-search-input"
                        placeholder="Search by title..."
                        value={searchInput}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>
            </div>

            <div className="business-dashboard-table-controls" style={{ padding: "0 0 12px" }}>
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab.label}
                        type="button"
                        className={
                            query.stockStatus === tab.value
                                ? "business-dashboard-button-primary"
                                : "business-dashboard-button-secondary"
                        }
                        onClick={() => handleStockStatusChange(tab.value)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="business-dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="business-dashboard-table-message business-dashboard-table-message--error">
                    Failed to load products. Please try again.
                </p>
            ) : !productsPage || productsPage.items.length === 0 ? (
                <p className="business-dashboard-table-message">
                    {query.search || query.stockStatus
                        ? "No products match your search or filters."
                        : "No products yet."}
                </p>
            ) : (
                <div className="business-dashboard-table-wrapper" style={{ opacity: isFetching ? 0.6 : 1 }}>
                    <table className="business-dashboard-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {productsPage.items.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        {product.imageUrl ? (
                                            <img
                                                src={resolveImageUrl(product.imageUrl)}
                                                alt=""
                                                className="business-dashboard-product-thumb"
                                            />
                                        ) : (
                                            <span className="business-dashboard-product-thumb-placeholder" aria-hidden="true">
                                                {product.title.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </td>
                                    <td>{product.title}</td>
                                    <td>{product.category}</td>
                                    <td>
                                        <StockCell stockQuantity={product.stockQuantity} />
                                    </td>
                                    <td>
                                        <div className="business-dashboard-table-controls">
                                            <button
                                                type="button"
                                                className="business-dashboard-button-secondary"
                                                onClick={() => onAddStock(product)}
                                            >
                                                Add stock
                                            </button>
                                            <button
                                                type="button"
                                                className="business-dashboard-button-secondary"
                                                onClick={() => onRemoveStock(product)}
                                                disabled={product.stockQuantity === null}
                                                title={
                                                    product.stockQuantity === null
                                                        ? "Nothing to remove — this product isn't tracked"
                                                        : undefined
                                                }
                                            >
                                                Remove stock
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination
                page={productsPage?.page ?? 1}
                totalPages={productsPage?.totalPages ?? 0}
                onPageChange={setPage}
            />
        </section>
    );
};

export default InventoryTable;
