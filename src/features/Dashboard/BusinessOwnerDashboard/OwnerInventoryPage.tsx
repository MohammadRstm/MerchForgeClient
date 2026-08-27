import "./BusinessOwnerDashboard.css";
import useOwnerInventoryPage from "./hooks/useOwnerInventoryPage";
import InventorySummaryCards from "./components/InventorySummaryCards";
import InventoryTable from "./components/InventoryTable";
import RecentStockActivity from "./components/RecentStockActivity";
import StockAdjustmentModal from "./components/StockAdjustmentModal";
import LowStockThresholdModal from "./components/LowStockThresholdModal";

const OwnerInventoryPage = () => {
    const {
        productsPage,
        productsLoading,
        productsFetching,
        productsError,
        productsTable,

        summary,

        movements,
        movementsLoading,
        movementsError,

        adjustmentTarget,
        isAdjustingStock,
        adjustStockError,
        openAddStock,
        openRemoveStock,
        cancelAdjustment,
        confirmAdjustment,

        thresholdModalOpen,
        isUpdatingThreshold,
        updateThresholdError,
        openThresholdModal,
        cancelThresholdModal,
        confirmThreshold,
    } = useOwnerInventoryPage();

    return (
        <main className="business-dashboard-page">
            <div className="business-dashboard-page-header">
                <h1 className="business-dashboard-heading">Inventory</h1>
            </div>

            <InventorySummaryCards summary={summary} onEditThreshold={openThresholdModal} />

            <InventoryTable
                productsPage={productsPage}
                isLoading={productsLoading}
                isFetching={productsFetching}
                isError={productsError}
                tableState={productsTable}
                onAddStock={openAddStock}
                onRemoveStock={openRemoveStock}
            />

            <RecentStockActivity movements={movements} isLoading={movementsLoading} isError={movementsError} />

            <StockAdjustmentModal
                product={adjustmentTarget?.product}
                mode={adjustmentTarget?.mode ?? "add"}
                isSubmitting={isAdjustingStock}
                error={adjustStockError}
                onConfirm={confirmAdjustment}
                onCancel={cancelAdjustment}
            />

            <LowStockThresholdModal
                isOpen={thresholdModalOpen}
                currentThreshold={summary?.lowStockThreshold}
                isSubmitting={isUpdatingThreshold}
                error={updateThresholdError}
                onConfirm={confirmThreshold}
                onCancel={cancelThresholdModal}
            />
        </main>
    );
};

export default OwnerInventoryPage;
