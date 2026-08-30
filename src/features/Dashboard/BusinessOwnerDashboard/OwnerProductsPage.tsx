import { useRef } from "react";
import "./BusinessOwnerDashboard.css";
import useOwnerProductsPage from "./hooks/useOwnerProductsPage";
import ProductCatalogOverviewCards from "./components/ProductCatalogOverviewCards";
import ProductIntelligenceSection from "./components/ProductIntelligenceSection";
import ProductsGrid from "./components/ProductsGrid";
import ProductModal from "./components/ProductModal";
import ProductDetailModal from "./components/ProductDetailModal";
import DeleteProductModal from "./components/DeleteProductModal";
import type { ProductPerformanceEntry } from "./types";

const OwnerProductsPage = () => {
    const {
        categories,

        catalogOverview,
        productAnalytics,

        productsPage,
        productsLoading,
        productsFetching,
        productsError,
        productsTable,

        productModal,
        productDetailModal,
        editFromDetail,
        voiceDraft,
        imageEditChat,
        multiAngle,
        colorImages,
        quickImageEdits,
        suggestDetails,

        productPendingDeletion,
        isDeletingProduct,
        deleteProductError,
        requestDeleteProduct,
        confirmDeleteProduct,
        cancelDeleteProduct,
    } = useOwnerProductsPage();

    const gridRef = useRef<HTMLDivElement>(null);

    const performanceByProductId = (productAnalytics.performance?.products ?? []).reduce<
        Record<string, ProductPerformanceEntry>
    >((map, entry) => {
        map[entry.productId] = entry;
        return map;
    }, {});

    const handleViewAllProducts = () => {
        productsTable.handleSearchChange("");
        productsTable.handleCategoryChange(undefined);
        gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <main className="business-dashboard-page">
            <div className="business-dashboard-page-header">
                <div>
                    <h1 className="business-dashboard-heading">Products</h1>
                    <p className="business-dashboard-page-subtitle">
                        Manage your catalog and understand how your products are performing.
                    </p>
                </div>

                <button type="button" className="business-dashboard-button-primary" onClick={productModal.openForCreate}>
                    + Add Product
                </button>
            </div>

            <ProductCatalogOverviewCards overview={catalogOverview} />

            <ProductIntelligenceSection
                state={productAnalytics}
                hasAnyProducts={(catalogOverview?.totalProducts ?? 0) > 0}
                onSelectProduct={productDetailModal.open}
                onViewAllProducts={handleViewAllProducts}
            />

            <div ref={gridRef}>
                <ProductsGrid
                    productsPage={productsPage}
                    isLoading={productsLoading}
                    isFetching={productsFetching}
                    isError={productsError}
                    tableState={productsTable}
                    categories={categories}
                    onAddProduct={productModal.openForCreate}
                    onViewProduct={productDetailModal.open}
                    onEditProduct={productModal.openForEdit}
                    onDeleteProduct={requestDeleteProduct}
                    deletingProductId={isDeletingProduct ? productPendingDeletion?.id : undefined}
                    performanceByProductId={performanceByProductId}
                />
            </div>

            <ProductModal
                modal={productModal}
                voiceDraft={voiceDraft}
                imageEditChat={imageEditChat}
                multiAngle={multiAngle}
                colorImages={colorImages}
                quickImageEdits={quickImageEdits}
                suggestDetails={suggestDetails}
            />

            <ProductDetailModal modal={productDetailModal} onEdit={editFromDetail} />

            <DeleteProductModal
                product={productPendingDeletion}
                isDeleting={isDeletingProduct}
                error={deleteProductError}
                onConfirm={confirmDeleteProduct}
                onCancel={cancelDeleteProduct}
            />
        </main>
    );
};

export default OwnerProductsPage;
