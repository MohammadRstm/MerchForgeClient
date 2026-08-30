import "./BusinessOwnerDashboard.css";
import useOwnerInventoryPage from "./hooks/useOwnerInventoryPage";
import InventorySummaryCards from "./components/InventorySummaryCards";
import InventoryHealthDonut from "./components/InventoryHealthDonut";
import InventoryIntelligenceSection from "./components/InventoryIntelligenceSection";
import InventoryTable from "./components/InventoryTable";
import RecentStockActivity from "./components/RecentStockActivity";
import StockAdjustmentModal from "./components/StockAdjustmentModal";
import LowStockThresholdModal from "./components/LowStockThresholdModal";

const OwnerInventoryPage = () => {
    const {
        categories,

        productsPage,
        productsLoading,
        productsFetching,
        productsError,
        productsTable,
        salesByProductId,
        filterByStatus,

        exportInventory,
        isExporting,

        summary,

        movements,
        movementsLoading,
        movementsError,

        inventoryAnalytics,

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
                <div>
                    <h1 className="business-dashboard-heading">Inventory</h1>
                    <p className="business-dashboard-page-subtitle">
                        Track stock levels and understand how your inventory is moving.
                    </p>
                </div>

                <div className="business-dashboard-header-actions">
                    <span className="business-dashboard-badge">
                        Low stock threshold: {summary?.lowStockThreshold ?? "—"} units
                    </span>
                    <button type="button" className="business-dashboard-button-secondary" onClick={openThresholdModal}>
                        Edit threshold
                    </button>
                </div>
            </div>

            <InventorySummaryCards
                summary={summary}
                activeStatus={productsTable.query.stockStatus}
                onFilterByStatus={filterByStatus}
            />

            <InventoryHealthDonut summary={summary} />

            <InventoryIntelligenceSection
                state={inventoryAnalytics}
                hasAnyProducts={(summary?.trackedProductCount ?? 0) + (summary?.untrackedProductCount ?? 0) > 0}
                lowStockThreshold={summary?.lowStockThreshold ?? 5}
                onAddStock={openAddStock}
            />

            <InventoryTable
                productsPage={productsPage}
                isLoading={productsLoading}
                isFetching={productsFetching}
                isError={productsError}
                tableState={productsTable}
                categories={categories}
                lowStockThreshold={summary?.lowStockThreshold}
                salesByProductId={salesByProductId}
                onAddStock={openAddStock}
                onRemoveStock={openRemoveStock}
                onExport={exportInventory}
            />
            {isExporting && <p className="business-dashboard-form-hint">Preparing export…</p>}

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
