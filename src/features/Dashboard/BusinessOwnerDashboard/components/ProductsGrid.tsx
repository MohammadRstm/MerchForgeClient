import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Pagination from "../../../../components/Pagination/Pagination";
import ProductCard from "./ProductCard";
import type { PagedResult } from "../../../../types/pagination";
import type useProductsTableState from "../hooks/ui/useProductsTableState";
import type { BusinessProductResponse, ProductPerformanceEntry, ProductSortField } from "../types";

const SORT_OPTIONS: { field: ProductSortField; label: string }[] = [
    { field: "CreatedAt", label: "Date added" },
    { field: "Title", label: "Title" },
    { field: "Price", label: "Price" },
];

type ProductsGridProps = {
    productsPage?: PagedResult<BusinessProductResponse>;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    tableState: ReturnType<typeof useProductsTableState>;
    categories: string[];
    onAddProduct: () => void;
    onViewProduct: (productId: string) => void;
    onEditProduct: (productId: string) => void;
    onDeleteProduct: (product: BusinessProductResponse) => void;
    deletingProductId?: string;
    /** Sales for the selected analytics period, keyed by product id — powers each card's subtle performance line. */
    performanceByProductId?: Record<string, ProductPerformanceEntry>;
};

const ProductsGrid = ({
    productsPage,
    isLoading,
    isFetching,
    isError,
    tableState,
    categories,
    onAddProduct,
    onViewProduct,
    onEditProduct,
    onDeleteProduct,
    deletingProductId,
    performanceByProductId,
}: ProductsGridProps) => {
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

                    <select
                        className="business-dashboard-filter-select"
                        value={query.sortBy}
                        onChange={(e) => handleSortChange(e.target.value as ProductSortField)}
                        aria-label="Sort by"
                    >
                        {SORT_OPTIONS.map((option) => (
                            <option key={option.field} value={option.field}>
                                Sort: {option.label} {query.sortBy === option.field ? (query.sortDescending ? "↓" : "↑") : ""}
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
                <div className="products-grid" style={{ opacity: isFetching ? 0.6 : 1 }}>
                    {productsPage.items.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            performance={performanceByProductId?.[product.id]}
                            onView={onViewProduct}
                            onEdit={onEditProduct}
                            onDelete={onDeleteProduct}
                            isDeleting={deletingProductId === product.id}
                        />
                    ))}
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

export default ProductsGrid;
