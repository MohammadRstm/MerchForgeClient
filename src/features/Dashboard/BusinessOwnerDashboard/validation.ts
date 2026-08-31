import z from "zod";
import { pagedResultSchema } from "../../../types/pagination";

export const keyCountSchema = z.object({
    key: z.string(),
    count: z.number(),
});

export const timeSeriesPointSchema = z.object({
    period: z.string(),
    count: z.number(),
});

export const businessProductResponseSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    category: z.string(),
    price: z.number(),
    compareAtPrice: z.number().nullable(),
    imageUrl: z.string().nullable(),
    stockQuantity: z.number().nullable(),
    sku: z.string().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
});

export const businessDashboardStatsResponseSchema = z.object({
    businessId: z.string().uuid(),
    businessName: z.string(),
    createdAt: z.iso.datetime(),
    websiteUrl: z.string().nullable(),

    memberCount: z.number(),
    productCount: z.number(),
    productDraftCount: z.number(),

    averageProductPrice: z.number().nullable(),
    minProductPrice: z.number().nullable(),
    maxProductPrice: z.number().nullable(),
    outOfStockProductCount: z.number(),
    orderCount: z.number(),
    pendingOrderCount: z.number(),
    recentProducts: z.array(businessProductResponseSchema),

    productsByCategory: z.array(keyCountSchema),
    productDraftsByStatus: z.array(keyCountSchema),
    membersByRole: z.array(keyCountSchema),

    productsOverTime: z.array(timeSeriesPointSchema),
});

export const businessProductsPageSchema = pagedResultSchema(businessProductResponseSchema);

// ---- inventory ----

/** Mirrors the server's ProductStockStatus enum. Query-only, never persisted. */
export const productStockStatusSchema = z.enum(["All", "Tracked", "Untracked", "InStock", "LowStock", "OutOfStock"]);

export const stockMovementSchema = z.object({
    id: z.string().uuid(),
    productId: z.string().uuid(),
    productTitle: z.string(),
    amount: z.number(),
    balanceAfter: z.number(),
    reason: z.string().nullable(),
    createdAt: z.iso.datetime(),
});

export const stockAdjustmentResponseSchema = z.object({
    product: businessProductResponseSchema,
    movement: stockMovementSchema,
});

// ---- orders ----

/** Mirrors the server's OrderStatus enum. Pending -> Confirmed | Cancelled; Confirmed -> Shipped | Cancelled; Shipped -> Delivered. Delivered/Cancelled are terminal. */
export const orderStatusSchema = z.enum(["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"]);

/** No payment gateway is connected yet — see UpdateOrderPaymentStatusRequest's server-side doc comment. */
export const paymentStatusSchema = z.enum(["Pending", "Paid", "Refunded"]);

export const businessOrderResponseSchema = z.object({
    id: z.string().uuid(),
    customerName: z.string(),
    customerEmail: z.string(),
    customerPhone: z.string().nullable(),
    status: orderStatusSchema,
    paymentStatus: paymentStatusSchema,
    total: z.number(),
    currency: z.string(),
    itemCount: z.number(),
    createdAt: z.iso.datetime(),
});

export const businessOrdersPageSchema = pagedResultSchema(businessOrderResponseSchema);

export const businessOrderItemResponseSchema = z.object({
    productId: z.string().uuid(),
    productTitle: z.string(),
    productImageUrl: z.string().nullable(),
    unitPrice: z.number(),
    quantity: z.number(),
    lineTotal: z.number(),
});

export const businessOrderDetailResponseSchema = z.object({
    id: z.string().uuid(),
    customerId: z.string().uuid().nullable(),
    customerName: z.string(),
    customerEmail: z.string(),
    customerPhone: z.string().nullable(),
    shippingAddressLine1: z.string(),
    shippingAddressLine2: z.string().nullable(),
    shippingCity: z.string(),
    shippingState: z.string().nullable(),
    shippingPostalCode: z.string(),
    shippingCountry: z.string(),
    customerNotes: z.string().nullable(),
    status: orderStatusSchema,
    paymentStatus: paymentStatusSchema,
    subtotal: z.number(),
    total: z.number(),
    currency: z.string(),
    items: z.array(businessOrderItemResponseSchema),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    customerOrderCount: z.number().nullable(),
    customerLastOrderAt: z.iso.datetime().nullable(),
});

export const orderStatsResponseSchema = z.object({
    totalCount: z.number(),
    pendingCount: z.number(),
    confirmedCount: z.number(),
    shippedCount: z.number(),
    deliveredCount: z.number(),
    cancelledCount: z.number(),
    stalePendingCount: z.number(),
    oldestPendingOrderCreatedAt: z.iso.datetime().nullable(),
    recentlyCancelledCount: z.number(),
});

export const orderNoteResponseSchema = z.object({
    id: z.string().uuid(),
    content: z.string(),
    createdByUserName: z.string(),
    createdAt: z.iso.datetime(),
});

export const orderStatusHistoryEntryResponseSchema = z.object({
    status: orderStatusSchema,
    changedByUserName: z.string().nullable(),
    createdAt: z.iso.datetime(),
});

export const orderAnalyticsGranularitySchema = z.enum(["Daily", "Monthly"]);

export const orderAnalyticsPointResponseSchema = z.object({
    period: z.iso.datetime(),
    orderCount: z.number(),
    revenue: z.number(),
});

export const orderAnalyticsPeriodTotalsResponseSchema = z.object({
    orderCount: z.number(),
    revenue: z.number(),
});

export const orderAnalyticsResponseSchema = z.object({
    granularity: orderAnalyticsGranularitySchema,
    points: z.array(orderAnalyticsPointResponseSchema),
    currentPeriod: orderAnalyticsPeriodTotalsResponseSchema,
    previousPeriod: orderAnalyticsPeriodTotalsResponseSchema,
    revenueChangePercent: z.number().nullable(),
    orderCountChangePercent: z.number().nullable(),
});

export const customerSnapshotResponseSchema = z.object({
    totalCustomers: z.number(),
    newCustomersInPeriod: z.number(),
});

// ---- product analytics ----

export const productCatalogOverviewResponseSchema = z.object({
    totalProducts: z.number(),
    totalUnitsSold: z.number(),
    productRevenue: z.number(),
    averageProductPrice: z.number().nullable(),
});

export const productAnalyticsPointResponseSchema = z.object({
    period: z.iso.datetime(),
    revenue: z.number(),
    unitsSold: z.number(),
    orderCount: z.number(),
});

export const productAnalyticsPeriodTotalsResponseSchema = z.object({
    revenue: z.number(),
    unitsSold: z.number(),
    orderCount: z.number(),
});

export const productAllTimeTotalsResponseSchema = z.object({
    revenue: z.number(),
    unitsSold: z.number(),
    orderCount: z.number(),
    averageUnitsPerOrder: z.number().nullable(),
});

export const productAnalyticsResponseSchema = z.object({
    granularity: orderAnalyticsGranularitySchema,
    points: z.array(productAnalyticsPointResponseSchema),
    currentPeriod: productAnalyticsPeriodTotalsResponseSchema,
    previousPeriod: productAnalyticsPeriodTotalsResponseSchema,
    revenueChangePercent: z.number().nullable(),
    unitsSoldChangePercent: z.number().nullable(),
    orderCountChangePercent: z.number().nullable(),
    allTime: productAllTimeTotalsResponseSchema.nullable(),
});

export const productPerformanceEntryResponseSchema = z.object({
    productId: z.string().uuid(),
    title: z.string(),
    imageUrl: z.string().nullable(),
    categoryName: z.string(),
    price: z.number(),
    unitsSold: z.number(),
    revenue: z.number(),
    orderCount: z.number(),
    previousUnitsSold: z.number(),
    previousRevenue: z.number(),
    unitsSoldChangePercent: z.number().nullable(),
    revenueChangePercent: z.number().nullable(),
    createdAt: z.iso.datetime(),
});

export const categoryPerformanceEntryResponseSchema = z.object({
    categoryName: z.string(),
    productCount: z.number(),
    unitsSold: z.number(),
    revenue: z.number(),
});

export const productPerformanceResponseSchema = z.object({
    products: z.array(productPerformanceEntryResponseSchema),
    categories: z.array(categoryPerformanceEntryResponseSchema),
    totalRevenue: z.number(),
});

export const inventorySummarySchema = z.object({
    trackedProductCount: z.number(),
    untrackedProductCount: z.number(),
    totalUnitsInStock: z.number(),
    outOfStockCount: z.number(),
    lowStockCount: z.number(),
    lowStockThreshold: z.number(),
});

// ---- inventory analytics/performance ----

export const inventoryAnalyticsPointResponseSchema = z.object({
    period: z.iso.datetime(),
    unitsSold: z.number(),
    stockAdded: z.number(),
    stockRemoved: z.number(),
});

export const inventoryAnalyticsPeriodTotalsResponseSchema = z.object({
    unitsSold: z.number(),
    stockAdded: z.number(),
    stockRemoved: z.number(),
});

export const inventoryAnalyticsResponseSchema = z.object({
    granularity: orderAnalyticsGranularitySchema,
    points: z.array(inventoryAnalyticsPointResponseSchema),
    currentPeriod: inventoryAnalyticsPeriodTotalsResponseSchema,
    previousPeriod: inventoryAnalyticsPeriodTotalsResponseSchema,
    unitsSoldChangePercent: z.number().nullable(),
});

export const inventoryProductPerformanceEntryResponseSchema = z.object({
    productId: z.string().uuid(),
    title: z.string(),
    imageUrl: z.string().nullable(),
    categoryName: z.string(),
    stockQuantity: z.number().nullable(),
    unitsSold: z.number(),
    revenue: z.number(),
    lastSaleAt: z.iso.datetime().nullable(),
    createdAt: z.iso.datetime(),
});

export const inventoryCategoryPerformanceEntryResponseSchema = z.object({
    categoryName: z.string(),
    trackedProductCount: z.number(),
    untrackedProductCount: z.number(),
    unitsInStock: z.number(),
    unitsSold: z.number(),
    revenue: z.number(),
    lowStockCount: z.number(),
    outOfStockCount: z.number(),
});

export const inventoryPerformanceResponseSchema = z.object({
    products: z.array(inventoryProductPerformanceEntryResponseSchema),
    categories: z.array(inventoryCategoryPerformanceEntryResponseSchema),
});

export const productImageSchema = z.object({
    id: z.string().uuid(),
    url: z.string(),
    isMain: z.boolean(),
    width: z.number().nullable(),
    height: z.number().nullable(),
    altText: z.string().nullable(),
    displayOrder: z.number(),
});

export const productValueTypeSchema = z.enum(["Text", "Number", "Boolean", "TextList", "ColorList"]);

export const productFormFieldSchema = z.object({
    key: z.string(),
    label: z.string(),
    valueType: productValueTypeSchema,
});

export const productFormSchema = z.object({
    categories: z.array(z.object({ id: z.string().uuid(), name: z.string() })),
    metadataFields: z.array(productFormFieldSchema),
});

// Metadata is schemaless by design — its keys differ per business — so it's
// validated as "an object" rather than against fixed fields.
export const businessProductDetailSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    price: z.number(),
    compareAtPrice: z.number().nullable(),
    categoryId: z.string().uuid(),
    categoryName: z.string(),
    imageUrl: z.string().nullable(),
    images: z.array(productImageSchema),
    sku: z.string().nullable(),
    stockQuantity: z.number().nullable(),
    tags: z.array(z.string()),
    saleEndsAt: z.iso.datetime().nullable(),
    metadata: z.record(z.string(), z.unknown()).nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
});

export const productImageUploadSchema = z.object({
    imageUrl: z.string(),
});

/**
 * Mirrors ProductDraftStatus on the backend. A closed union rather than z.string()
 * so an unexpected state fails validation loudly here instead of silently falling
 * through every branch of the UI and rendering nothing.
 */
export const productDraftStatusSchema = z.enum([
    "CollectingInformation",
    "WaitingForMissingInformation",
    "ProcessingImage",
    "WaitingForImageApproval",
    "WaitingForProductApproval",
    "Completed",
    "Cancelled",
    "Failed",
]);

export const productDraftMessageSchema = z.object({
    role: z.enum(["user", "assistant"]),
    text: z.string(),
    kind: z.enum(["text", "voice", "image"]),
    at: z.iso.datetime(),
});

export const productDraftProductSchema = z.object({
    title: z.string().nullable(),
    description: z.string().nullable(),
    price: z.number().nullable(),
    compareAtPrice: z.number().nullable(),
    categoryId: z.string().uuid().nullable(),
    categoryName: z.string().nullable(),
    sku: z.string().nullable(),
    stockQuantity: z.number().nullable(),
    tags: z.array(z.string()),
    saleEndsAt: z.iso.datetime().nullable(),
    // Schemaless by design - the keys differ per business - so validated as an
    // object rather than against fixed fields.
    metadata: z.record(z.string(), z.unknown()).nullable(),
});

export const productDraftSchema = z.object({
    id: z.string().uuid(),
    status: productDraftStatusSchema,
    messages: z.array(productDraftMessageSchema),
    draft: productDraftProductSchema.nullable(),
    missingFields: z.array(z.string()),
    originalImageUrl: z.string().nullable(),
    processedImageUrl: z.string().nullable(),
    imageModificationPrompt: z.string().nullable(),
    canConfirm: z.boolean(),
    productId: z.string().uuid().nullable(),
});

export const businessMemberResponseSchema = z.object({
    userId: z.string().uuid(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    role: z.string(),
    joinedAt: z.iso.datetime(),
});

/** The roles an owner may assign. Owner is deliberately absent — a business has one. */
export const assignableBusinessRoleSchema = z.enum(["Admin", "Member"]);

/**
 * Creation echoes the member back. No password: the new member sets their own via
 * an emailed invitation (see AcceptMemberInvitation), so there's nothing here that
 * could ever be used to sign in on their behalf.
 */
export const createBusinessMemberResponseSchema = businessMemberResponseSchema;

/** Mirrors the server's CreateBusinessMemberRequestValidator. */
export const createBusinessMemberFormSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, "First name is required.")
        .max(100, "First name must be 100 characters or fewer."),
    lastName: z
        .string()
        .trim()
        .min(1, "Last name is required.")
        .max(100, "Last name must be 100 characters or fewer."),
    email: z
        .string()
        .trim()
        .min(1, "Email is required.")
        .email("Enter a valid email address.")
        .max(255, "Email must be 255 characters or fewer."),
    role: assignableBusinessRoleSchema,
});

export const planFeatureItemSchema = z.object({
    featureKey: z.string(),
    featureName: z.string(),
    featureDescription: z.string().nullable(),
    limit: z.number().nullable(),
});

export const businessSubscriptionResponseSchema = z
    .object({
        id: z.string().uuid(),
        planName: z.string(),
        price: z.number(),
        currency: z.string(),
        billingInterval: z.string(),
        status: z.string(),
        currentPeriodStart: z.iso.datetime(),
        currentPeriodEnd: z.iso.datetime(),
        cancelAtPeriodEnd: z.boolean(),
        features: z.array(planFeatureItemSchema),
    })
    .nullable();

export const subscriptionHistoryEntryResponseSchema = z.object({
    id: z.string().uuid(),
    planName: z.string(),
    price: z.number(),
    currency: z.string(),
    billingInterval: z.string(),
    status: z.string(),
    currentPeriodStart: z.iso.datetime(),
    currentPeriodEnd: z.iso.datetime(),
    cancelAtPeriodEnd: z.boolean(),
    createdAt: z.iso.datetime(),
});

// ---- website template requests ----

export const websiteTemplateOptionSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    label: z.string(),
    previewImageUrl: z.string(),
    previewWebsiteUrl: z.string().nullable(),
});

export const websiteTemplateOptionsSchema = z.object({
    businessDomainId: z.string().uuid(),
    domainName: z.string(),
    hasOpenRequest: z.boolean(),
    templates: z.array(websiteTemplateOptionSchema),
});

export const websiteTemplateRequestStatusSchema = z.enum(["Pending", "InProgress", "Closed"]);

export const websiteTemplateRequestSchema = z.object({
    id: z.string().uuid(),
    websiteTemplateId: z.string().uuid(),
    templateName: z.string(),
    templateLabel: z.string(),
    domainName: z.string(),
    customizationNotes: z.string(),
    status: websiteTemplateRequestStatusSchema,
    createdAt: z.iso.datetime(),
    buildStartedAt: z.iso.datetime().nullable(),
    closedAt: z.iso.datetime().nullable(),
    finalWebsiteUrl: z.string().nullable(),
});

// ---- feature credits ----

export const featureCreditPackageSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    credits: z.number(),
    price: z.number(),
    currency: z.string(),
});

export const featureCreditOverviewSchema = z.object({
    featureKey: z.string(),
    featureName: z.string(),
    featureDescription: z.string().nullable(),
    includedInPlan: z.boolean(),
    creditsRemaining: z.number(),
    creditsGrantedTotal: z.number(),
    packages: z.array(featureCreditPackageSchema),
});

export const businessFeatureCreditSchema = z.object({
    featureKey: z.string(),
    creditsRemaining: z.number(),
    creditsGrantedTotal: z.number(),
});

// ---- website customization ----

export const socialLinksDtoSchema = z.object({
    facebook: z.string().nullable(),
    instagram: z.string().nullable(),
    twitter: z.string().nullable(),
    tikTok: z.string().nullable(),
    youTube: z.string().nullable(),
    linkedIn: z.string().nullable(),
});

const businessHoursDayDtoSchema = z
    .object({
        closed: z.boolean(),
        open: z.string().nullable(),
        close: z.string().nullable(),
    })
    .nullable();

export const businessHoursDtoSchema = z.object({
    monday: businessHoursDayDtoSchema,
    tuesday: businessHoursDayDtoSchema,
    wednesday: businessHoursDayDtoSchema,
    thursday: businessHoursDayDtoSchema,
    friday: businessHoursDayDtoSchema,
    saturday: businessHoursDayDtoSchema,
    sunday: businessHoursDayDtoSchema,
});

/** Mirrors the server's WebsiteCustomizableValueType enum. */
export const websiteCustomizableValueTypeSchema = z.enum([
    "Text",
    "Textarea",
    "Image",
    "Color",
    "Url",
    "Boolean",
    "Number",
    "Select",
    "Link",
]);

export const websiteTemplateCustomizableComponentSchema = z.object({
    id: z.string().uuid(),
    websiteTemplateId: z.string().uuid(),
    key: z.string(),
    label: z.string(),
    valueType: websiteCustomizableValueTypeSchema,
    isRequired: z.boolean(),
    allowedValues: z.array(z.string()),
    helpText: z.string().nullable(),
    displayOrder: z.number(),
    isActive: z.boolean(),
});

export const websiteCustomizationDraftResponseSchema = z.object({
    tagline: z.string().nullable(),
    description: z.string().nullable(),
    logoUrl: z.string().nullable(),
    faviconUrl: z.string().nullable(),
    contactEmail: z.string().nullable(),
    contactPhone: z.string().nullable(),
    whatsAppNumber: z.string().nullable(),
    addressLine1: z.string().nullable(),
    addressLine2: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    postalCode: z.string().nullable(),
    country: z.string().nullable(),
    socialLinks: socialLinksDtoSchema,
    businessHours: businessHoursDtoSchema,
    primaryColor: z.string().nullable(),
    // Opaque per-template values, keyed by that template's own catalogue keys —
    // validated server-side against the current template's catalogue, not here.
    templateFields: z.record(z.string(), z.unknown()),
    updatedAt: z.iso.datetime(),
    lastPublishedAt: z.iso.datetime().nullable(),
    previewToken: z.string(),
});

export const publishWebsiteCustomizationResponseSchema = z.object({
    droppedTemplateFieldKeys: z.array(z.string()),
    publishedAt: z.iso.datetime(),
});

export const regeneratePreviewTokenResponseSchema = z.object({
    previewToken: z.string(),
});

export const uploadWebsiteCustomizationImageResponseSchema = z.object({
    imageUrl: z.string(),
});

// ---- AI image editing ----

export const imageEditJobSchema = z.object({
    id: z.string().uuid(),
    status: z.enum(["Completed", "Failed"]),
    prompt: z.string(),
    inputImageUrls: z.array(z.string()),
    outputImageUrl: z.string().nullable(),
    errorMessage: z.string().nullable(),
    createdAt: z.iso.datetime(),
});
