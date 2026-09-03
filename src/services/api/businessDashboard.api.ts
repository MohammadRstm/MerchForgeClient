import z from "zod";
import type {
    ProductsQueryParams,
    CreateBusinessMemberPayload,
    OrdersQueryParams,
    OrderStatus,
    PaymentStatus,
    SocialLinksDto,
    BusinessHoursDto,
} from "../../features/Dashboard/BusinessOwnerDashboard/types";
import type { PagedQuery } from "../../types/pagination";
import {
    businessDashboardStatsResponseSchema,
    businessMemberResponseSchema,
    createBusinessMemberResponseSchema,
    businessProductDetailSchema,
    businessProductsPageSchema,
    businessSubscriptionResponseSchema,
    productFormSchema,
    productImageUploadSchema,
    websiteTemplateOptionsSchema,
    websiteTemplateRequestSchema,
    featureCreditOverviewSchema,
    businessFeatureCreditSchema,
    stockAdjustmentResponseSchema,
    inventorySummarySchema,
    stockMovementSchema,
    inventoryAnalyticsResponseSchema,
    inventoryPerformanceResponseSchema,
    subscriptionHistoryEntryResponseSchema,
    customerSnapshotResponseSchema,
    businessOrdersPageSchema,
    businessOrderDetailResponseSchema,
    orderStatsResponseSchema,
    orderNoteResponseSchema,
    orderStatusHistoryEntryResponseSchema,
    orderAnalyticsResponseSchema,
    productCatalogOverviewResponseSchema,
    productAnalyticsResponseSchema,
    productPerformanceResponseSchema,
    websiteTemplateCustomizableComponentSchema,
    websiteCustomizationDraftResponseSchema,
    publishWebsiteCustomizationResponseSchema,
    regeneratePreviewTokenResponseSchema,
    uploadWebsiteCustomizationImageResponseSchema,
    productReviewsPageSchema,
} from "../../features/Dashboard/BusinessOwnerDashboard/validation";
import { authenticatedApi } from "./api";
import { apiRoutes } from "./apiRoutes";

/** One image in a save payload — already uploaded, referenced by the URL the upload endpoint returned. */
export type SaveProductImagePayload = {
    url: string;
    isMain: boolean;
    width?: number;
    height?: number;
    altText?: string;
};

/**
 * Wire shape for create/update. Metadata values are already converted to their real
 * JSON types (string / number / boolean / string[]) by the form before this point —
 * the backend validates each against the type its definition declares.
 *
 * A full replace, not a partial patch: every field is sent on every save, matching
 * the backend's own SaveProductRequest contract (one DTO for both create and update).
 */
export type SaveProductPayload = {
    title: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    categoryId: string;
    images: SaveProductImagePayload[];
    sku?: string;
    stockQuantity?: number;
    tags: string[];
    saleEndsAt?: string;
    metadata: Record<string, unknown> | null;
};

export const getBusinessDashboardStatsService = async (businessId: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_STATS(businessId));

    return businessDashboardStatsResponseSchema.parse(data);
};

export const getBusinessProductsService = async (businessId: string, query: ProductsQueryParams) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_PRODUCTS(businessId), {
        params: query,
    });

    return businessProductsPageSchema.parse(data);
};

export const getProductCatalogOverviewService = async (businessId: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_PRODUCT_CATALOG_OVERVIEW(businessId));

    return productCatalogOverviewResponseSchema.parse(data);
};

export const getProductAnalyticsService = async (businessId: string, from: string, to: string, productId?: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_PRODUCT_ANALYTICS(businessId), {
        params: { from, to, productId },
    });

    return productAnalyticsResponseSchema.parse(data);
};

export const getProductPerformanceService = async (businessId: string, from: string, to: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_PRODUCT_PERFORMANCE(businessId), {
        params: { from, to },
    });

    return productPerformanceResponseSchema.parse(data);
};

export const getBusinessMembersService = async (businessId: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_MEMBERS(businessId));

    return z.array(businessMemberResponseSchema).parse(data);
};

/**
 * Creates the account and attaches it to the business in one call. The businessId
 * goes in the path, not the body — the API derives the tenant from the route it has
 * already authorized.
 */
export const createBusinessMemberService = async (
    businessId: string,
    payload: CreateBusinessMemberPayload
) => {
    const { data } = await authenticatedApi.post(
        apiRoutes.BUSINESS_DASHBOARD_MEMBERS(businessId),
        payload
    );

    return createBusinessMemberResponseSchema.parse(data);
};

export const getBusinessSubscriptionService = async (businessId: string) => {
    const response = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_SUBSCRIPTION(businessId));

    // A business with no subscription yet comes back as 204 No Content
    // (ASP.NET Core's default behavior for an Ok(null) action result).
    if (response.status === 204 || !response.data) {
        return null;
    }

    return businessSubscriptionResponseSchema.parse(response.data);
};

/** Subscribes (or switches) the business to a plan — always replaces the current Active subscription immediately, no real payment gateway yet. */
export const subscribeToPlanService = async (businessId: string, subscriptionPlanId: string) => {
    const { data } = await authenticatedApi.post(apiRoutes.BUSINESS_DASHBOARD_SUBSCRIPTION(businessId), {
        subscriptionPlanId,
    });

    return businessSubscriptionResponseSchema.parse(data);
};

/** Marks the subscription to end at CurrentPeriodEnd instead of renewing — access continues uninterrupted until then. */
export const cancelSubscriptionService = async (businessId: string) => {
    const { data } = await authenticatedApi.post(apiRoutes.BUSINESS_DASHBOARD_SUBSCRIPTION_CANCEL(businessId));

    return businessSubscriptionResponseSchema.parse(data);
};

/** Every plan this business has ever been on, newest first — read from the existing Subscription rows, not a separate history model. */
export const getSubscriptionHistoryService = async (businessId: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_SUBSCRIPTION_HISTORY(businessId));

    return z.array(subscriptionHistoryEntryResponseSchema).parse(data);
};

// ---- product CRUD ----

export const getProductFormService = async (businessId: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_PRODUCT_FORM(businessId));

    return productFormSchema.parse(data);
};

export const getBusinessProductService = async (businessId: string, productId: string) => {
    const { data } = await authenticatedApi.get(
        apiRoutes.BUSINESS_DASHBOARD_PRODUCT(businessId, productId)
    );

    return businessProductDetailSchema.parse(data);
};

export const createBusinessProductService = async (
    businessId: string,
    payload: SaveProductPayload
) => {
    const { data } = await authenticatedApi.post(
        apiRoutes.BUSINESS_DASHBOARD_PRODUCTS(businessId),
        payload
    );

    return businessProductDetailSchema.parse(data);
};

export const updateBusinessProductService = async (
    businessId: string,
    productId: string,
    payload: SaveProductPayload
) => {
    const { data } = await authenticatedApi.put(
        apiRoutes.BUSINESS_DASHBOARD_PRODUCT(businessId, productId),
        payload
    );

    return businessProductDetailSchema.parse(data);
};

export const deleteBusinessProductService = async (businessId: string, productId: string) => {
    await authenticatedApi.delete(apiRoutes.BUSINESS_DASHBOARD_PRODUCT(businessId, productId));
};

// ---- website template requests ----

export const getWebsiteTemplateOptionsService = async (businessId: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_WEBSITE_TEMPLATE_OPTIONS(businessId));

    return websiteTemplateOptionsSchema.parse(data);
};

export const getWebsiteTemplateRequestsService = async (businessId: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_WEBSITE_TEMPLATE_REQUESTS(businessId));

    return z.array(websiteTemplateRequestSchema).parse(data);
};

export const createWebsiteTemplateRequestService = async (
    businessId: string,
    websiteTemplateId: string,
    customizationNotes: string
) => {
    const { data } = await authenticatedApi.post(apiRoutes.BUSINESS_DASHBOARD_WEBSITE_TEMPLATE_REQUESTS(businessId), {
        websiteTemplateId,
        customizationNotes,
    });

    return websiteTemplateRequestSchema.parse(data);
};

// ---- feature credits ----

export const getBusinessFeaturesService = async (businessId: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_FEATURES(businessId));

    return z.array(featureCreditOverviewSchema).parse(data);
};

export const purchaseFeatureCreditsService = async (businessId: string, packageId: string) => {
    const { data } = await authenticatedApi.post(apiRoutes.BUSINESS_DASHBOARD_FEATURE_PURCHASES(businessId), {
        packageId,
    });

    return businessFeatureCreditSchema.parse(data);
};

// ---- inventory ----

/** Amount is signed: positive to add stock, negative to remove. */
export const adjustProductStockService = async (
    businessId: string,
    productId: string,
    amount: number,
    reason?: string
) => {
    const { data } = await authenticatedApi.post(
        apiRoutes.BUSINESS_DASHBOARD_STOCK_ADJUSTMENT(businessId, productId),
        { amount, reason }
    );

    return stockAdjustmentResponseSchema.parse(data);
};

export const getInventorySummaryService = async (businessId: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_INVENTORY_SUMMARY(businessId));

    return inventorySummarySchema.parse(data);
};

export const getStockMovementsService = async (businessId: string, take = 20, productId?: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_INVENTORY_MOVEMENTS(businessId), {
        params: { take, productId },
    });

    return z.array(stockMovementSchema).parse(data);
};

export const updateLowStockThresholdService = async (businessId: string, lowStockThreshold: number) => {
    await authenticatedApi.put(apiRoutes.BUSINESS_DASHBOARD_LOW_STOCK_THRESHOLD(businessId), {
        lowStockThreshold,
    });
};

export const getInventoryAnalyticsService = async (businessId: string, from: string, to: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_INVENTORY_ANALYTICS(businessId), {
        params: { from, to },
    });

    return inventoryAnalyticsResponseSchema.parse(data);
};

export const getInventoryPerformanceService = async (businessId: string, from: string, to: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_INVENTORY_PERFORMANCE(businessId), {
        params: { from, to },
    });

    return inventoryPerformanceResponseSchema.parse(data);
};

// ---- orders ----

export const getBusinessOrdersService = async (businessId: string, query: OrdersQueryParams) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_ORDERS(businessId), {
        params: query,
    });

    return businessOrdersPageSchema.parse(data);
};

export const getBusinessOrderService = async (businessId: string, orderId: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_ORDER(businessId, orderId));

    return businessOrderDetailResponseSchema.parse(data);
};

export const updateOrderStatusService = async (businessId: string, orderId: string, status: OrderStatus) => {
    const { data } = await authenticatedApi.put(apiRoutes.BUSINESS_DASHBOARD_ORDER_STATUS(businessId, orderId), {
        status,
    });

    return businessOrderDetailResponseSchema.parse(data);
};

export const getOrderStatsService = async (businessId: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_ORDER_STATS(businessId));

    return orderStatsResponseSchema.parse(data);
};

export const getOrderNotesService = async (businessId: string, orderId: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_ORDER_NOTES(businessId, orderId));

    return z.array(orderNoteResponseSchema).parse(data);
};

export const createOrderNoteService = async (businessId: string, orderId: string, content: string) => {
    const { data } = await authenticatedApi.post(apiRoutes.BUSINESS_DASHBOARD_ORDER_NOTES(businessId, orderId), {
        content,
    });

    return orderNoteResponseSchema.parse(data);
};

export const getOrderStatusHistoryService = async (businessId: string, orderId: string) => {
    const { data } = await authenticatedApi.get(
        apiRoutes.BUSINESS_DASHBOARD_ORDER_STATUS_HISTORY(businessId, orderId)
    );

    return z.array(orderStatusHistoryEntryResponseSchema).parse(data);
};

export const getOrderAnalyticsService = async (businessId: string, from: string, to: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_ORDER_ANALYTICS(businessId), {
        params: { from, to },
    });

    return orderAnalyticsResponseSchema.parse(data);
};

export const getCustomerSnapshotService = async (businessId: string, from: string, to: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_CUSTOMER_SNAPSHOT(businessId), {
        params: { from, to },
    });

    return customerSnapshotResponseSchema.parse(data);
};

export const updateOrderPaymentStatusService = async (
    businessId: string,
    orderId: string,
    paymentStatus: PaymentStatus
) => {
    const { data } = await authenticatedApi.put(
        apiRoutes.BUSINESS_DASHBOARD_ORDER_PAYMENT_STATUS(businessId, orderId),
        { paymentStatus }
    );

    return businessOrderDetailResponseSchema.parse(data);
};

export const uploadProductImageService = async (businessId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    // Content-Type is deliberately not set: the browser must generate it so the
    // multipart boundary is included, and setting it by hand omits that.
    const { data } = await authenticatedApi.post(
        apiRoutes.BUSINESS_DASHBOARD_PRODUCT_IMAGE(businessId),
        formData
    );

    return productImageUploadSchema.parse(data);
};

// ---- website customization ----

/** Mirrors the server's WebsiteCustomizationImageKind enum. */
export type WebsiteCustomizationImageKind = "Logo" | "Favicon" | "TemplateImage";

/**
 * A full replacement of the draft, matching the "always a complete snapshot, never a
 * partial diff" contract the backend's BusinessWebsiteDraft keeps — every field is
 * sent on every save. LogoUrl/FaviconUrl and any Image-typed template field are plain
 * URL strings, already uploaded via uploadWebsiteCustomizationImageService before
 * this is called.
 */
export type SaveWebsiteCustomizationDraftPayload = {
    tagline: string | null;
    description: string | null;
    logoUrl: string | null;
    faviconUrl: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    whatsAppNumber: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    country: string | null;
    socialLinks: SocialLinksDto;
    businessHours: BusinessHoursDto;
    primaryColor: string | null;
    templateFields: Record<string, unknown>;
};

export const getWebsiteCustomizationCatalogueService = async (businessId: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_WEBSITE_CUSTOMIZATION_CATALOGUE(businessId));

    return z.array(websiteTemplateCustomizableComponentSchema).parse(data);
};

export const getWebsiteCustomizationDraftService = async (businessId: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_WEBSITE_CUSTOMIZATION_DRAFT(businessId));

    return websiteCustomizationDraftResponseSchema.parse(data);
};

export const saveWebsiteCustomizationDraftService = async (
    businessId: string,
    payload: SaveWebsiteCustomizationDraftPayload
) => {
    const { data } = await authenticatedApi.put(
        apiRoutes.BUSINESS_DASHBOARD_WEBSITE_CUSTOMIZATION_DRAFT(businessId),
        payload
    );

    return websiteCustomizationDraftResponseSchema.parse(data);
};

export const publishWebsiteCustomizationService = async (businessId: string) => {
    const { data } = await authenticatedApi.post(apiRoutes.BUSINESS_DASHBOARD_WEBSITE_CUSTOMIZATION_PUBLISH(businessId));

    return publishWebsiteCustomizationResponseSchema.parse(data);
};

export const regenerateWebsiteCustomizationPreviewTokenService = async (businessId: string) => {
    const { data } = await authenticatedApi.post(
        apiRoutes.BUSINESS_DASHBOARD_WEBSITE_CUSTOMIZATION_PREVIEW_TOKEN_REGENERATE(businessId)
    );

    return regeneratePreviewTokenResponseSchema.parse(data);
};

export const uploadWebsiteCustomizationImageService = async (
    businessId: string,
    file: File,
    kind: WebsiteCustomizationImageKind
) => {
    const formData = new FormData();
    formData.append("file", file);

    // Content-Type is deliberately not set: the browser must generate it so the
    // multipart boundary is included, and setting it by hand omits that.
    const { data } = await authenticatedApi.post(
        apiRoutes.BUSINESS_DASHBOARD_WEBSITE_CUSTOMIZATION_IMAGE(businessId),
        formData,
        { params: { kind } }
    );

    return uploadWebsiteCustomizationImageResponseSchema.parse(data);
};

// ---- product reviews ----

/**
 * One page of a product's reviews for the owner. Unlike the storefront's list this
 * includes reviews the owner has hidden — hiding one must not hide it from the
 * person who hid it, or unhiding would be unreachable.
 */
export const getProductReviewsService = async (
    businessId: string,
    productId: string,
    query: PagedQuery
) => {
    const { data } = await authenticatedApi.get(
        apiRoutes.BUSINESS_DASHBOARD_PRODUCT_REVIEWS(businessId, productId),
        { params: query }
    );

    return productReviewsPageSchema.parse(data);
};

/**
 * Hides or unhides one review. Hidden reviews leave the storefront and stop counting
 * toward the product's average rating, but are never deleted.
 */
export const setProductReviewHiddenService = async (
    businessId: string,
    productId: string,
    reviewId: string,
    isHidden: boolean
) => {
    await authenticatedApi.put(
        apiRoutes.BUSINESS_DASHBOARD_PRODUCT_REVIEW_VISIBILITY(businessId, productId, reviewId),
        { isHidden }
    );
};
