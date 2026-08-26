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

    productsByCategory: z.array(keyCountSchema),
    productDraftsByStatus: z.array(keyCountSchema),
    membersByRole: z.array(keyCountSchema),

    productsOverTime: z.array(timeSeriesPointSchema),
});

export const businessProductResponseSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    category: z.string(),
    price: z.number(),
    compareAtPrice: z.number().nullable(),
    imageUrl: z.string().nullable(),
    stockQuantity: z.number().nullable(),
    createdAt: z.iso.datetime(),
});

export const businessProductsPageSchema = pagedResultSchema(businessProductResponseSchema);

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

/** Creation echoes the member back, plus the one-time generated password. */
export const createBusinessMemberResponseSchema = businessMemberResponseSchema.extend({
    rawPassword: z.string(),
});

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
        features: z.array(planFeatureItemSchema),
    })
    .nullable();

// ---- website template requests ----

export const websiteTemplateOptionSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    label: z.string(),
    videoPreviewUrl: z.string(),
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
