import useAuth from "../../../../context/Auth/useAuth";
import useBusinessDashboardStats from "./data/useBusinessDashboardStats";
import useBusinessProducts from "./data/useBusinessProducts";
import useBusinessMembers from "./data/useBusinessMembers";
import useBusinessSubscription from "./data/useBusinessSubscription";
import useBusinessFeatures from "./data/useBusinessFeatures";
import usePurchaseFeatureCredits from "./data/usePurchaseFeatureCredits";
import useProductsTableState from "./ui/useProductsTableState";
import useProductModal from "./ui/useProductModal";
import useProductDetailModal from "./ui/useProductDetailModal";
import useMemberModal from "./ui/useMemberModal";
import useWebsiteTemplateModal from "./ui/useWebsiteTemplateModal";
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

    const {
        data: features,
        isLoading: featuresLoading,
        isError: featuresError,
    } = useBusinessFeatures(businessId);

    const {
        mutate: purchaseFeatureCredits,
        isPending: isPurchasingFeatureCredits,
        variables: purchasingPackageId,
        error: purchaseFeatureCreditsErrorRaw,
        reset: resetPurchaseFeatureCreditsError,
    } = usePurchaseFeatureCredits(businessId);

    const requestPurchaseFeatureCredits = (packageId: string) => {
        resetPurchaseFeatureCreditsError();
        purchaseFeatureCredits(packageId);
    };

    const productModal = useProductModal(businessId);
    const productDetailModal = useProductDetailModal(businessId);
    const memberModal = useMemberModal(businessId);
    const websiteTemplateModal = useWebsiteTemplateModal(businessId);

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
     * Opens the assistant alongside the still-open form rather than replacing it —
     * the two are rendered as panes of the same modal (see ProductModal), so the
     * owner keeps the fields in view while talking to the AI.
     */
    const openAiChat = () => {
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
        websiteTemplateModal,

        subscription,
        subscriptionLoading,
        subscriptionError,

        features,
        featuresLoading,
        featuresError,
        // Cleared as soon as the mutation settles, not just when a new one starts —
        // react-query keeps `variables` around after success/error, which would
        // otherwise leave every "Buy" button disabled until the next purchase attempt.
        purchasingPackageId: isPurchasingFeatureCredits ? purchasingPackageId : undefined,
        purchaseFeatureCredits: requestPurchaseFeatureCredits,
        purchaseFeatureCreditsError:
            purchaseFeatureCreditsErrorRaw instanceof ApiError
                ? purchaseFeatureCreditsErrorRaw.message
                : purchaseFeatureCreditsErrorRaw
                    ? "Couldn't complete the purchase. Please try again."
                    : undefined,
    };
};

export default useBusinessOwnerDashboardPage;
