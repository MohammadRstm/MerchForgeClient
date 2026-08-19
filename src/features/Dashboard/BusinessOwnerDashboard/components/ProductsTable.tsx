import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Pagination from "../../../../components/Pagination/Pagination";
import SortableHeader from "../../../../components/SortableHeader/SortableHeader";
import type { PagedResult } from "../../../../types/pagination";
import type useProductsTableState from "../hooks/ui/useProductsTableState";
import type { BusinessProductResponse } from "../types";
import { resolveImageUrl } from "./ProductImageDropzone";

type ProductsTableProps = {
    productsPage?: PagedResult<BusinessProductResponse>;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    tableState: ReturnType<typeof useProductsTableState>;
    categories: string[];
    onAddProduct: () => void;
    onEditProduct: (productId: string) => void;
    onDeleteProduct: (product: BusinessProductResponse) => void;
    deletingProductId?: string;
};

const currencyFormatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
});

const ProductsTable = ({
    productsPage,
    isLoading,
    isFetching,
    isError,
    tableState,
    categories,
    onAddProduct,
    onEditProduct,
    onDeleteProduct,
    deletingProductId,
}: ProductsTableProps) => {
    const { query, searchInput, handleSearchChange, handleCategoryChange, handleSortChange, setPage } = tableState;

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

                    <select
                        className="business-dashboard-filter-select"
                        value={query.category ?? ""}
                        onChange={(e) => handleCategoryChange(e.target.value || undefined)}
                    >
                        <option value="">All categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        className="business-dashboard-button-primary"
                        onClick={onAddProduct}
                    >
                        Add product
                    </button>
                </div>
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
                    {query.search || query.category
                        ? "No products match your search or filters."
                        : "No products yet. Add your first one to get started."}
                </p>
            ) : (
                <div className="business-dashboard-table-wrapper">
                    <table className="business-dashboard-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <SortableHeader
                                    label="Title"
                                    field="Title"
                                    sortBy={query.sortBy}
                                    sortDescending={query.sortDescending}
                                    onSort={handleSortChange}
                                />
                                <th>Category</th>
                                <SortableHeader
                                    label="Price"
                                    field="Price"
                                    sortBy={query.sortBy}
                                    sortDescending={query.sortDescending}
                                    onSort={handleSortChange}
                                />
                                <SortableHeader
                                    label="Added"
                                    field="CreatedAt"
                                    sortBy={query.sortBy}
                                    sortDescending={query.sortDescending}
                                    onSort={handleSortChange}
                                />
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody style={{ opacity: isFetching ? 0.6 : 1 }}>
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
                                            <span
                                                className="business-dashboard-product-thumb-placeholder"
                                                aria-hidden="true"
                                            >
                                                {product.title.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </td>
                                    <td>{product.title}</td>
                                    <td>{product.category}</td>
                                    <td>{currencyFormatter.format(product.price)}</td>
                                    <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="business-dashboard-row-actions">
                                            <button
                                                type="button"
                                                className="business-dashboard-button-ghost"
                                                onClick={() => onEditProduct(product.id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="business-dashboard-button-ghost business-dashboard-button-ghost--danger"
                                                onClick={() => onDeleteProduct(product)}
                                                disabled={deletingProductId === product.id}
                                            >
                                                {deletingProductId === product.id ? "Deleting…" : "Delete"}
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

export default ProductsTable;
