import { useState } from "react";
import useAuth from "../../../../context/Auth/useAuth";
import useBusinessDashboardStats from "./data/useBusinessDashboardStats";
import useBusinessProducts from "./data/useBusinessProducts";
import useProductsTableState from "./ui/useProductsTableState";
import useProductModal from "./ui/useProductModal";
import useProductDetailModal from "./ui/useProductDetailModal";
import useVoiceProductDraft from "./ui/useVoiceProductDraft";
import useImageEditChat from "./ui/useImageEditChat";
import useMultiAngleImages from "./ui/useMultiAngleImages";
import useColorImages from "./ui/useColorImages";
import useQuickImageEdits from "./ui/useQuickImageEdits";
import useSuggestProductDetails from "./ui/useSuggestProductDetails";
import useDeleteProduct from "./data/useDeleteProduct";
import useProductCatalogOverview from "./data/useProductCatalogOverview";
import useProductAnalyticsSection from "./ui/useProductAnalyticsSection";
import { getProductColors } from "../utils/getProductColors";
import { ApiError } from "../../../../Error/ApiError";
import type { BusinessProductResponse } from "../types";

const useOwnerProductsPage = () => {
    const { session } = useAuth();
    const businessId = session?.business?.id ?? "";

    // Category options for the filter dropdown come from the same breakdown the
    // Overview page uses — no separate categories endpoint exists or is needed.
    const { data: stats } = useBusinessDashboardStats(businessId);

    const productsTable = useProductsTableState();

    const {
        data: productsPage,
        isLoading: productsLoading,
        isFetching: productsFetching,
        isError: productsError,
    } = useBusinessProducts(businessId, productsTable.query);

    const { data: catalogOverview } = useProductCatalogOverview(businessId);
    const productAnalytics = useProductAnalyticsSection(businessId);

    const productModal = useProductModal(businessId);
    const productDetailModal = useProductDetailModal(businessId, productAnalytics.from, productAnalytics.to);

    const editFromDetail = (productId: string) => {
        productDetailModal.close();
        productModal.openForEdit(productId);
    };

    const voiceDraft = useVoiceProductDraft(businessId, () => {
        productModal.close();
    });

    const imageEditChat = useImageEditChat(businessId, (replacements) => {
        for (const { oldUrl, newUrl } of replacements) {
            productModal.replaceImage(oldUrl, newUrl);
        }
    });

    const multiAngle = useMultiAngleImages(businessId, {
        images: productModal.values.images,
        addImage: productModal.addImage,
        replaceImage: productModal.replaceImage,
    });

    const colorImages = useColorImages(businessId, {
        images: productModal.values.images,
        colors: getProductColors(productModal.values, productModal.form),
        addImage: productModal.addImage,
        replaceImage: productModal.replaceImage,
    });

    const quickImageEdits = useQuickImageEdits(businessId, {
        replaceImage: productModal.replaceImage,
    });

    const suggestDetails = useSuggestProductDetails(businessId, {
        images: productModal.values.images,
    });

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
        categories: stats?.productsByCategory.map((entry) => entry.key) ?? [],

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
        deleteProductError:
            deleteErrorRaw instanceof ApiError
                ? deleteErrorRaw.message
                : deleteErrorRaw
                    ? "Couldn't delete the product. Please try again."
                    : undefined,
        requestDeleteProduct,
        confirmDeleteProduct,
        cancelDeleteProduct: () => setProductPendingDeletion(undefined),
    };
};

export default useOwnerProductsPage;
