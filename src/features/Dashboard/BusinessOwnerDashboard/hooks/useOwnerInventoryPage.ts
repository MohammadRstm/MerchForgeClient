import { useState } from "react";
import useAuth from "../../../../context/Auth/useAuth";
import useBusinessProducts from "./data/useBusinessProducts";
import useInventorySummary from "./data/useInventorySummary";
import useStockMovements from "./data/useStockMovements";
import useAdjustStock from "./data/useAdjustStock";
import useUpdateLowStockThreshold from "./data/useUpdateLowStockThreshold";
import useProductsTableState from "./ui/useProductsTableState";
import { ApiError } from "../../../../Error/ApiError";
import type { BusinessProductResponse } from "../types";

type AdjustmentTarget = {
    product: BusinessProductResponse;
    mode: "add" | "remove";
};

const toErrorMessage = (error: unknown, fallback: string) =>
    error instanceof ApiError ? error.message : error ? fallback : undefined;

const useOwnerInventoryPage = () => {
    const { session } = useAuth();
    const businessId = session?.business?.id ?? "";

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

    const openAddStock = (product: BusinessProductResponse) => {
        resetAdjustStockError();
        setAdjustmentTarget({ product, mode: "add" });
    };

    const openRemoveStock = (product: BusinessProductResponse) => {
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
        productsPage,
        productsLoading,
        productsFetching,
        productsError,
        productsTable,

        summary,
        summaryLoading,
        summaryError,

        movements,
        movementsLoading,
        movementsError,

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
