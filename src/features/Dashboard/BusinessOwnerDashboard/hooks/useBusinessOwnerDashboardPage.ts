import useAuth from "../../../../context/Auth/useAuth";
import useBusinessDashboardStats from "./data/useBusinessDashboardStats";
import useBusinessProducts from "./data/useBusinessProducts";
import useBusinessMembers from "./data/useBusinessMembers";
import useBusinessSubscription from "./data/useBusinessSubscription";
import useProductsTableState from "./ui/useProductsTableState";
import useProductModal from "./ui/useProductModal";
import useProductDetailModal from "./ui/useProductDetailModal";
import useMemberModal from "./ui/useMemberModal";
import useProductAiChat from "./ui/useProductAiChat";
import useDeleteProduct from "./data/useDeleteProduct";
import { useState } from "react";
import { ApiError } from "../../../../Error/ApiError";
import type { BusinessProductResponse } from "../types";

const useBusinessOwnerDashboardPage = () => {
    const { session } = useAuth();
    const businessId = session?.business?.id ?? "";

    const {
        data: stats,
        isLoading: statsLoading,
        isError: statsError,
    } = useBusinessDashboardStats(businessId);

    const productsTable = useProductsTableState();

    const {
        data: productsPage,
        isLoading: productsLoading,
        isFetching: productsFetching,
        isError: productsError,
    } = useBusinessProducts(businessId, productsTable.query);

    const {
        data: members,
        isLoading: membersLoading,
        isError: membersError,
    } = useBusinessMembers(businessId);

    const {
        data: subscription,
        isLoading: subscriptionLoading,
        isError: subscriptionError,
    } = useBusinessSubscription(businessId);

    const productModal = useProductModal(businessId);
    const productDetailModal = useProductDetailModal(businessId);
    const memberModal = useMemberModal(businessId);

    /** Switches from viewing to editing the same product — the detail card is read-only, so an edit always starts a fresh trip through the form. */
    const editFromDetail = (productId: string) => {
        productDetailModal.close();
        productModal.openForEdit(productId);
    };

    const aiChat = useProductAiChat(businessId, () => {
        // The AI flow created the product itself, so the manual modal - if it was the
        // route in - has nothing left to submit.
        productModal.close();
    });

    /**
     * Closes the manual form when handing over to the assistant. Both modals render
     * their own backdrop, so leaving the first open stacks two dialogs and the owner
     * ends up dismissing a form they thought they had left.
     */
    const openAiChat = () => {
        productModal.close();
        aiChat.open();
    };

    const [productPendingDeletion, setProductPendingDeletion] =
        useState<BusinessProductResponse | undefined>(undefined);

    const {
        mutate: deleteProduct,
        isPending: isDeletingProduct,
        error: deleteErrorRaw,
        reset: resetDeleteError,
    } = useDeleteProduct(businessId);

    const requestDeleteProduct = (product: BusinessProductResponse) => {
        resetDeleteError();
        setProductPendingDeletion(product);
    };

    const confirmDeleteProduct = () => {
        if (!productPendingDeletion) return;

        deleteProduct(productPendingDeletion.id, {
            onSuccess: () => setProductPendingDeletion(undefined),
        });
    };

    return {
        businessId,
        businessName: session?.business?.name ?? "",

        productModal,
        productDetailModal,
        editFromDetail,
        aiChat,
        openAiChat,

        productPendingDeletion,
        isDeletingProduct,
        deleteProductError:
            deleteErrorRaw instanceof ApiError
                ? deleteErrorRaw.message
                : deleteErrorRaw
                    ? "Couldn't delete the product. Please try again."
                    : undefined,
        requestDeleteProduct,
        confirmDeleteProduct,
        cancelDeleteProduct: () => setProductPendingDeletion(undefined),

        stats,
        statsLoading,
        statsError,

        productsPage,
        productsLoading,
        productsFetching,
        productsError,
        productsTable,

        members,
        membersLoading,
        membersError,
        memberModal,

        subscription,
        subscriptionLoading,
        subscriptionError,
    };
};

export default useBusinessOwnerDashboardPage;
