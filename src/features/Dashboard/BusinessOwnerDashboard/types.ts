import type z from "zod";

import type { PagedQuery } from "../../../types/pagination";
import type {
    businessDashboardStatsResponseSchema,
    businessMemberResponseSchema,
    assignableBusinessRoleSchema,
    createBusinessMemberResponseSchema,
    createBusinessMemberFormSchema,
    businessProductDetailSchema,
    businessProductResponseSchema,
    productImageSchema,
    productStockStatusSchema,
    stockMovementSchema,
    stockAdjustmentResponseSchema,
    inventorySummarySchema,
    orderStatusSchema,
    paymentStatusSchema,
    businessOrderResponseSchema,
    businessOrderItemResponseSchema,
    businessOrderDetailResponseSchema,
    orderStatsResponseSchema,
    orderNoteResponseSchema,
    orderStatusHistoryEntryResponseSchema,
    orderAnalyticsGranularitySchema,
    orderAnalyticsPointResponseSchema,
    orderAnalyticsPeriodTotalsResponseSchema,
    orderAnalyticsResponseSchema,
    productCatalogOverviewResponseSchema,
    productAnalyticsPointResponseSchema,
    productAnalyticsPeriodTotalsResponseSchema,
    productAllTimeTotalsResponseSchema,
    productAnalyticsResponseSchema,
    productPerformanceEntryResponseSchema,
    categoryPerformanceEntryResponseSchema,
    productPerformanceResponseSchema,
    inventoryAnalyticsPointResponseSchema,
    inventoryAnalyticsPeriodTotalsResponseSchema,
    inventoryAnalyticsResponseSchema,
    inventoryProductPerformanceEntryResponseSchema,
    inventoryCategoryPerformanceEntryResponseSchema,
    inventoryPerformanceResponseSchema,
    businessSubscriptionResponseSchema,
    subscriptionHistoryEntryResponseSchema,
    productDraftMessageSchema,
    productDraftProductSchema,
    productDraftSchema,
    productDraftStatusSchema,
    productFormFieldSchema,
    productFormSchema,
    productValueTypeSchema,
    websiteTemplateOptionSchema,
    websiteTemplateOptionsSchema,
    websiteTemplateRequestSchema,
    websiteTemplateRequestStatusSchema,
    featureCreditPackageSchema,
    featureCreditOverviewSchema,
    businessFeatureCreditSchema,
    imageEditJobSchema,
    socialLinksDtoSchema,
    businessHoursDtoSchema,
    websiteCustomizableValueTypeSchema,
    websiteTemplateCustomizableComponentSchema,
    websiteCustomizationDraftResponseSchema,
    publishWebsiteCustomizationResponseSchema,
} from "./validation";

export type BusinessDashboardStatsResponse = z.infer<typeof businessDashboardStatsResponseSchema>;
export type BusinessProductResponse = z.infer<typeof businessProductResponseSchema>;
export type BusinessMemberResponse = z.infer<typeof businessMemberResponseSchema>;
export type AssignableBusinessRole = z.infer<typeof assignableBusinessRoleSchema>;
export type CreateBusinessMemberResponse = z.infer<typeof createBusinessMemberResponseSchema>;
export type CreateBusinessMemberPayload = z.infer<typeof createBusinessMemberFormSchema>;
export type BusinessSubscriptionResponse = z.infer<typeof businessSubscriptionResponseSchema>;
export type SubscriptionHistoryEntry = z.infer<typeof subscriptionHistoryEntryResponseSchema>;

export type BusinessProductDetail = z.infer<typeof businessProductDetailSchema>;
export type BusinessProductImage = z.infer<typeof productImageSchema>;
export type ProductForm = z.infer<typeof productFormSchema>;
export type ProductFormField = z.infer<typeof productFormFieldSchema>;
export type ProductValueType = z.infer<typeof productValueTypeSchema>;

export type WebsiteTemplateOption = z.infer<typeof websiteTemplateOptionSchema>;
export type WebsiteTemplateOptions = z.infer<typeof websiteTemplateOptionsSchema>;
export type WebsiteTemplateRequest = z.infer<typeof websiteTemplateRequestSchema>;
export type WebsiteTemplateRequestStatus = z.infer<typeof websiteTemplateRequestStatusSchema>;

export type FeatureCreditPackage = z.infer<typeof featureCreditPackageSchema>;
export type FeatureCreditOverview = z.infer<typeof featureCreditOverviewSchema>;
export type BusinessFeatureCredit = z.infer<typeof businessFeatureCreditSchema>;

export type ImageEditJob = z.infer<typeof imageEditJobSchema>;

/**
 * One image in the form's in-progress gallery. Keyed by url (already uploaded, always
 * unique) rather than a synthetic id — there's nothing else to key it by until the
 * product itself is saved.
 */
export type ProductFormImage = {
    url: string;
    isMain: boolean;
    width?: number;
    height?: number;
};

/**
 * Product form state. Metadata values are kept as strings while editing — even
 * numbers — because that's what inputs produce; they're converted to their real JSON
 * types only on submit. TextList is held as one comma-separated string for the same
 * reason, and so is `tags`, which uses the identical convention. Booleans are the
 * exception, since a checkbox already gives a real boolean.
 */
export type ProductFormValues = {
    title: string;
    description: string;
    price: string;
    compareAtPrice: string;
    categoryId: string;
    images: ProductFormImage[];
    sku: string;
    stockQuantity: string;
    tags: string;
    /** yyyy-MM-dd, matching <input type="date">. Empty string means no deadline. */
    saleEndsAt: string;
    metadata: Record<string, string | boolean>;
};

export type ProductDraft = z.infer<typeof productDraftSchema>;
export type ProductDraftMessage = z.infer<typeof productDraftMessageSchema>;
export type ProductDraftStatus = z.infer<typeof productDraftStatusSchema>;
export type ProductDraftProduct = z.infer<typeof productDraftProductSchema>;

export type ProductSortField = "CreatedAt" | "Title" | "Price" | "StockQuantity" | "UpdatedAt";

export type ProductStockStatus = z.infer<typeof productStockStatusSchema>;

export type ProductsQueryParams = PagedQuery & {
    search?: string;
    category?: string;
    stockStatus?: ProductStockStatus;
    sortBy: ProductSortField;
    sortDescending: boolean;
};

/** The minimal shape StockAdjustmentModal actually needs — lets any inventory-intelligence list (low stock, dead stock, fast movers…) trigger an adjustment without carrying the full BusinessProductResponse. */
export type StockAdjustmentProductRef = { id: string; title: string; stockQuantity: number | null };

export type StockMovement = z.infer<typeof stockMovementSchema>;
export type StockAdjustmentResponse = z.infer<typeof stockAdjustmentResponseSchema>;
export type InventorySummary = z.infer<typeof inventorySummarySchema>;

export type InventoryAnalyticsPoint = z.infer<typeof inventoryAnalyticsPointResponseSchema>;
export type InventoryAnalyticsPeriodTotals = z.infer<typeof inventoryAnalyticsPeriodTotalsResponseSchema>;
export type InventoryAnalytics = z.infer<typeof inventoryAnalyticsResponseSchema>;
export type InventoryProductPerformanceEntry = z.infer<typeof inventoryProductPerformanceEntryResponseSchema>;
export type InventoryCategoryPerformanceEntry = z.infer<typeof inventoryCategoryPerformanceEntryResponseSchema>;
export type InventoryPerformance = z.infer<typeof inventoryPerformanceResponseSchema>;

/** Which figure the Inventory Performance chart currently plots. */
export type InventoryAnalyticsMetric = "unitsSold" | "stockAdded" | "stockRemoved";

/** Deterministic restock-urgency bucket, derived client-side from stock/threshold/velocity — never AI-generated. */
export type InventoryRiskLevel = "OutOfStock" | "Critical" | "Watch" | "Healthy";

export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type BusinessOrderResponse = z.infer<typeof businessOrderResponseSchema>;
export type BusinessOrderItem = z.infer<typeof businessOrderItemResponseSchema>;
export type BusinessOrderDetail = z.infer<typeof businessOrderDetailResponseSchema>;

export type OrdersQueryParams = PagedQuery & {
    status?: OrderStatus;
    search?: string;
    /** Inclusive, ISO datetime (UTC), start of the range. */
    from?: string;
    /** Inclusive, ISO datetime (UTC), end of the range. */
    to?: string;
};

export type OrderStats = z.infer<typeof orderStatsResponseSchema>;
export type OrderNote = z.infer<typeof orderNoteResponseSchema>;
export type OrderStatusHistoryEntry = z.infer<typeof orderStatusHistoryEntryResponseSchema>;

/** A named date-range preset for the orders toolbar's date filter. "custom" pairs with an explicit from/to picked by the owner. */
export type OrderDateFilterPreset = "all" | "today" | "yesterday" | "last7" | "last30" | "custom";

export type OrderAnalyticsGranularity = z.infer<typeof orderAnalyticsGranularitySchema>;
export type OrderAnalyticsPoint = z.infer<typeof orderAnalyticsPointResponseSchema>;
export type OrderAnalyticsPeriodTotals = z.infer<typeof orderAnalyticsPeriodTotalsResponseSchema>;
export type OrderAnalytics = z.infer<typeof orderAnalyticsResponseSchema>;

/** A named range preset for the analytics chart. Distinct from OrderDateFilterPreset — the chart's presets are wider (up to 1 year) and drive chart aggregation, not the orders table filter. */
export type AnalyticsRangePreset = "7d" | "30d" | "3m" | "6m" | "1y" | "custom";

export type AnalyticsMetric = "revenue" | "orders";

export type ProductCatalogOverview = z.infer<typeof productCatalogOverviewResponseSchema>;
export type ProductAnalyticsPoint = z.infer<typeof productAnalyticsPointResponseSchema>;
export type ProductAnalyticsPeriodTotals = z.infer<typeof productAnalyticsPeriodTotalsResponseSchema>;
export type ProductAllTimeTotals = z.infer<typeof productAllTimeTotalsResponseSchema>;
export type ProductAnalytics = z.infer<typeof productAnalyticsResponseSchema>;
export type ProductPerformanceEntry = z.infer<typeof productPerformanceEntryResponseSchema>;
export type CategoryPerformanceEntry = z.infer<typeof categoryPerformanceEntryResponseSchema>;
export type ProductPerformance = z.infer<typeof productPerformanceResponseSchema>;

export type ProductAnalyticsMetric = "revenue" | "unitsSold" | "orders";

// ---- website customization ----

export type SocialLinksDto = z.infer<typeof socialLinksDtoSchema>;
export type BusinessHoursDto = z.infer<typeof businessHoursDtoSchema>;
export type WebsiteCustomizableValueType = z.infer<typeof websiteCustomizableValueTypeSchema>;
export type WebsiteTemplateCustomizableComponent = z.infer<typeof websiteTemplateCustomizableComponentSchema>;
export type WebsiteCustomizationDraft = z.infer<typeof websiteCustomizationDraftResponseSchema>;
export type PublishWebsiteCustomizationResponse = z.infer<typeof publishWebsiteCustomizationResponseSchema>;

export type WeekDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export const WEEK_DAYS: WeekDay[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

/** Form representation of one day. `open`/`close` both blank and `closed` false means "not set" — distinct from explicitly closed — and is sent to the server as null. */
export type WebsiteCustomizationHoursDayFormValue = {
    closed: boolean;
    open: string;
    close: string;
};

/** A template field's edited value. Link is the one structured type (a labeled CTA button); every other type edits as a plain string or boolean. */
export type WebsiteCustomizationTemplateFieldValue = string | boolean | { text: string; url: string };

/**
 * Customization form state. Every field is edited as a string/boolean the way inputs
 * naturally produce them, converted to the draft save payload's real shape only on
 * submit — same convention ProductFormValues already uses for product metadata.
 */
export type WebsiteCustomizationFormValues = {
    tagline: string;
    description: string;
    logoUrl: string;
    faviconUrl: string;
    contactEmail: string;
    contactPhone: string;
    whatsAppNumber: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    socialLinks: {
        facebook: string;
        instagram: string;
        twitter: string;
        tikTok: string;
        youTube: string;
        linkedIn: string;
    };
    businessHours: Record<WeekDay, WebsiteCustomizationHoursDayFormValue>;
    primaryColor: string;
    templateFields: Record<string, WebsiteCustomizationTemplateFieldValue>;
};
