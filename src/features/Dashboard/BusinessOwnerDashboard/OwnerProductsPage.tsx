import "./BusinessOwnerDashboard.css";
import useOwnerProductsPage from "./hooks/useOwnerProductsPage";
import ProductsGrid from "./components/ProductsGrid";
import ProductModal from "./components/ProductModal";
import ProductDetailModal from "./components/ProductDetailModal";
import DeleteProductModal from "./components/DeleteProductModal";

const OwnerProductsPage = () => {
    const {
        categories,

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

    return (
        <main className="business-dashboard-page">
            <div className="business-dashboard-page-header">
                <h1 className="business-dashboard-heading">Products</h1>
            </div>

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
            />

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
