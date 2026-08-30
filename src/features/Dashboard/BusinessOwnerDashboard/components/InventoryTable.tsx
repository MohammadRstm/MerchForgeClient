import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Pagination from "../../../../components/Pagination/Pagination";
import StockCell from "./StockCell";
import { resolveImageUrl } from "../utils/resolveImageUrl";
import type { PagedResult } from "../../../../types/pagination";
import type useProductsTableState from "../hooks/ui/useProductsTableState";
import type { BusinessProductResponse, ProductSortField, ProductStockStatus, StockAdjustmentProductRef } from "../types";

// Every meaningful bucket the backend's ProductStockStatus enum exposes — Tracked and
// InStock included, not just the four "problem" tabs, so the table can express every
// status the KPI cards above can filter to.
const STATUS_TABS: { value: ProductStockStatus | undefined; label: string }[] = [
    { value: undefined, label: "All" },
    { value: "Tracked", label: "Tracked" },
    { value: "InStock", label: "In Stock" },
    { value: "LowStock", label: "Low Stock" },
    { value: "OutOfStock", label: "Out of Stock" },
    { value: "Untracked", label: "Untracked" },
];

const SORT_OPTIONS: { value: ProductSortField; label: string }[] = [
    { value: "CreatedAt", label: "Newest" },
    { value: "UpdatedAt", label: "Recently updated" },
    { value: "Title", label: "Title" },
    { value: "Price", label: "Price" },
    { value: "StockQuantity", label: "Stock level" },
];

type InventoryTableProps = {
    productsPage?: PagedResult<BusinessProductResponse>;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    tableState: ReturnType<typeof useProductsTableState>;
    categories: string[];
    lowStockThreshold?: number;
    /** Units sold in the currently-selected analytics period, keyed by product id — powers the Sales column. Absent entries render as "—", not 0, since a product simply outside the bounded performance fetch isn't the same as zero sales. */
    salesByProductId: Record<string, number>;
    onAddStock: (product: StockAdjustmentProductRef) => void;
    onRemoveStock: (product: StockAdjustmentProductRef) => void;
    onExport: () => void;
};

const InventoryTable = ({
    productsPage,
    isLoading,
    isFetching,
    isError,
    tableState,
    categories,
    lowStockThreshold,
    salesByProductId,
    onAddStock,
    onRemoveStock,
    onExport,
}: InventoryTableProps) => {
    const { query, searchInput, handleSearchChange, handleCategoryChange, handleStockStatusChange, handleSortChange, setPage } =
        tableState;

    return (
        <section className="business-dashboard-table-card">
            <div className="business-dashboard-table-header">
                <h3>Products</h3>

                <div className="business-dashboard-table-controls">
                    <input
                        type="text"
                        className="business-dashboard-search-input"
                        placeholder="Search by title or SKU..."
                        value={searchInput}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />

                    <select
                        className="business-dashboard-form-input"
                        value={query.category ?? ""}
                        onChange={(e) => handleCategoryChange(e.target.value || undefined)}
                        aria-label="Filter by category"
                    >
                        <option value="">All categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <select
                        className="business-dashboard-form-input"
                        value={query.sortBy}
                        onChange={(e) => handleSortChange(e.target.value as ProductSortField)}
                        aria-label="Sort by"
                    >
                        {SORT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                Sort: {option.label} {query.sortBy === option.value ? (query.sortDescending ? "↓" : "↑") : ""}
                            </option>
                        ))}
                    </select>

                    <button type="button" className="business-dashboard-button-secondary" onClick={onExport}>
                        Export CSV
                    </button>
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
                    {query.search || query.stockStatus || query.category
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
                                <th>Tracking</th>
                                <th>Stock</th>
                                <th>Threshold</th>
                                <th>Sales</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {productsPage.items.map((product) => {
                                const unitsSold = salesByProductId[product.id];

                                return (
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
                                        <td>
                                            {product.title}
                                            {product.sku && <div className="business-dashboard-form-hint">SKU: {product.sku}</div>}
                                        </td>
                                        <td>{product.category}</td>
                                        <td>
                                            <span className="business-dashboard-badge">
                                                {product.stockQuantity === null ? "Untracked" : "Tracked"}
                                            </span>
                                        </td>
                                        <td>
                                            <StockCell stockQuantity={product.stockQuantity} />
                                        </td>
                                        <td>{product.stockQuantity === null ? "—" : (lowStockThreshold ?? "—")}</td>
                                        <td>{unitsSold === undefined ? "—" : unitsSold}</td>
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
                                );
                            })}
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
