import { useState } from "react";
import useAuth from "../../../../context/Auth/useAuth";
import useBusinessDashboardStats from "./data/useBusinessDashboardStats";
import useBusinessProducts from "./data/useBusinessProducts";
import useInventorySummary from "./data/useInventorySummary";
import useStockMovements from "./data/useStockMovements";
import useAdjustStock from "./data/useAdjustStock";
import useUpdateLowStockThreshold from "./data/useUpdateLowStockThreshold";
import useProductsTableState from "./ui/useProductsTableState";
import useInventoryAnalyticsSection from "./ui/useInventoryAnalyticsSection";
import useExportInventory from "./ui/useExportInventory";
import { ApiError } from "../../../../Error/ApiError";
import type { ProductStockStatus, StockAdjustmentProductRef } from "../types";

type AdjustmentTarget = {
    product: StockAdjustmentProductRef;
    mode: "add" | "remove";
};

const toErrorMessage = (error: unknown, fallback: string) =>
    error instanceof ApiError ? error.message : error ? fallback : undefined;

const useOwnerInventoryPage = () => {
    const { session } = useAuth();
    const businessId = session?.business?.id ?? "";

    // Category options for the filter dropdown come from the same breakdown the
    // Overview/Products pages use — no separate categories endpoint exists or is needed.
    const { data: stats } = useBusinessDashboardStats(businessId);

    const productsTable = useProductsTableState();

    const {
        data: productsPage,
        isLoading: productsLoading,
        isFetching: productsFetching,
        isError: productsError,
    } = useBusinessProducts(businessId, productsTable.query);

    const {
        data: summary,
        isLoading: summaryLoading,
        isError: summaryError,
    } = useInventorySummary(businessId);

    const {
        data: movements,
        isLoading: movementsLoading,
        isError: movementsError,
    } = useStockMovements(businessId);

    const inventoryAnalytics = useInventoryAnalyticsSection(businessId);

    const salesByProductId = (inventoryAnalytics.performance?.products ?? []).reduce<Record<string, number>>(
        (map, entry) => {
            map[entry.productId] = entry.unitsSold;
            return map;
        },
        {}
    );

    const { exportFiltered, isExporting } = useExportInventory(businessId);

    const exportInventory = () => exportFiltered(productsTable.query, "inventory");

    const filterByStatus = (status: ProductStockStatus | undefined) => {
        productsTable.handleStockStatusChange(status);
    };

    const {
        mutate: adjustStock,
        isPending: isAdjustingStock,
        error: adjustStockErrorRaw,
        reset: resetAdjustStockError,
    } = useAdjustStock(businessId);

    const {
        mutate: updateThreshold,
        isPending: isUpdatingThreshold,
        error: updateThresholdErrorRaw,
        reset: resetUpdateThresholdError,
    } = useUpdateLowStockThreshold(businessId);

    const [adjustmentTarget, setAdjustmentTarget] = useState<AdjustmentTarget | undefined>(undefined);
    const [thresholdModalOpen, setThresholdModalOpen] = useState(false);

    const openAddStock = (product: StockAdjustmentProductRef) => {
        resetAdjustStockError();
        setAdjustmentTarget({ product, mode: "add" });
    };

    const openRemoveStock = (product: StockAdjustmentProductRef) => {
        resetAdjustStockError();
        setAdjustmentTarget({ product, mode: "remove" });
    };

    const cancelAdjustment = () => setAdjustmentTarget(undefined);

    const confirmAdjustment = (quantity: number, reason?: string) => {
        if (!adjustmentTarget) return;

        const amount = adjustmentTarget.mode === "add" ? quantity : -quantity;

        adjustStock(
            { productId: adjustmentTarget.product.id, amount, reason },
            { onSuccess: () => setAdjustmentTarget(undefined) }
        );
    };

    const openThresholdModal = () => {
        resetUpdateThresholdError();
        setThresholdModalOpen(true);
    };

    const cancelThresholdModal = () => setThresholdModalOpen(false);

    const confirmThreshold = (threshold: number) => {
        updateThreshold(threshold, { onSuccess: () => setThresholdModalOpen(false) });
    };

    return {
        categories: stats?.productsByCategory.map((entry) => entry.key) ?? [],

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
        summaryLoading,
        summaryError,

        movements,
        movementsLoading,
        movementsError,

        inventoryAnalytics,

        adjustmentTarget,
        isAdjustingStock,
        adjustStockError: toErrorMessage(adjustStockErrorRaw, "Couldn't adjust stock. Please try again."),
        openAddStock,
        openRemoveStock,
        cancelAdjustment,
        confirmAdjustment,

        thresholdModalOpen,
        isUpdatingThreshold,
        updateThresholdError: toErrorMessage(updateThresholdErrorRaw, "Couldn't update the threshold. Please try again."),
        openThresholdModal,
        cancelThresholdModal,
        confirmThreshold,
    };
};

export default useOwnerInventoryPage;
