import z from "zod";
import { pagedResultSchema } from "../../../types/pagination";
import {
    businessMemberResponseSchema,
    businessSubscriptionResponseSchema,
    planFeatureItemSchema,
    websiteTemplateRequestSchema,
} from "../BusinessOwnerDashboard/validation";

export const keyCountSchema = z.object({
    key: z.string(),
    count: z.number(),
});

export const timeSeriesPointSchema = z.object({
    period: z.string(),
    count: z.number(),
});

export const dashboardBusinessResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    ownerFullName: z.string(),
    ownerEmail: z.string(),
    memberCount: z.number(),
    productCount: z.number(),
    createdAt: z.iso.datetime(),
});

export const dashboardBusinessesPageSchema = pagedResultSchema(dashboardBusinessResponseSchema);

export const dashboardStatsResponseSchema = z.object({
    totalUsers: z.number(),
    totalBusinesses: z.number(),
    totalProducts: z.number(),
    totalProductDrafts: z.number(),
    pendingInvitations: z.number(),
    pendingWebsiteTemplateRequests: z.number(),
    completedWebsiteTemplateRequests: z.number(),
    activeSessionCount: z.number(),

    usersBySystemRole: z.array(keyCountSchema),
    businessUsersByRole: z.array(keyCountSchema),
    businessesByDomain: z.array(keyCountSchema),
    subscriptionsByStatus: z.array(keyCountSchema),

    recentBusinesses: z.array(dashboardBusinessResponseSchema),

    businessesOverTime: z.array(timeSeriesPointSchema),
    productsOverTime: z.array(timeSeriesPointSchema),
});

export const dashboardUserResponseSchema = z.object({
    id: z.string().uuid(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    systemRole: z.string(),
    businessName: z.string().nullable(),
    businessRole: z.string().nullable(),
    hasActiveSession: z.boolean(),
    createdAt: z.iso.datetime(),
});

export const dashboardUsersPageSchema = pagedResultSchema(dashboardUserResponseSchema);

export const revokeUserSessionsResponseSchema = z.object({
    revokedSessionsCount: z.number(),
});

/**
 * The API also returns an `id`, but the service never assigns it, so it is always
 * an empty Guid. Left out rather than parsed into something that looks meaningful.
 */
export const businessOwnerInvitationResponseSchema = z.object({
    email: z.string(),
    expiresAt: z.iso.datetime(),
});

/** Mirrors the server's CreateBusinessOwnerValidator so the form fails before the round trip. */
export const inviteBusinessOwnerFormSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Enter an email address.")
        .email("Enter a valid email address.")
        .max(255, "Email must be 255 characters or fewer."),
});

export const websiteTemplateResponseSchema = z.object({
    id: z.string().uuid(),
    businessDomainId: z.string().uuid(),
    domainName: z.string(),
    name: z.string(),
    label: z.string(),
    previewImageUrl: z.string(),
    previewWebsiteUrl: z.string().nullable(),
    isActive: z.boolean(),
    displayOrder: z.number(),
    businessesUsingIt: z.number(),
    createdAt: z.iso.datetime(),
});

export const websiteTemplatesResponseSchema = z.array(websiteTemplateResponseSchema);

// ---- subscription plans ----

export const subscriptionPlanResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().nullable(),
    price: z.number(),
    currency: z.string(),
    billingInterval: z.string(),
    isActive: z.boolean(),
    isCustom: z.boolean(),
});

export const subscriptionPlansResponseSchema = z.array(subscriptionPlanResponseSchema);

export const subscriptionPlanDetailResponseSchema = subscriptionPlanResponseSchema.extend({
    activeSubscriberCount: z.number(),
    features: z.array(planFeatureItemSchema),
});

export const featureResponseSchema = z.object({
    id: z.string().uuid(),
    key: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    isActive: z.boolean(),
});

export const featuresResponseSchema = z.array(featureResponseSchema);

/** Mirrors the server's CreateSubscriptionPlanRequestValidator/UpdateSubscriptionPlanRequestValidator so the form fails before the round trip. */
export const subscriptionPlanFormSchema = z.object({
    name: z.string().trim().min(1, "Enter a plan name.").max(100, "Name must be 100 characters or fewer."),
    description: z.string().trim().max(500, "Description must be 500 characters or fewer.").optional(),
    price: z.coerce
        .number({ message: "Price must be a number." })
        .min(0, "Price can't be negative."),
    currency: z
        .string()
        .trim()
        .length(3, "Use a 3-letter currency code, e.g. USD.")
        .transform((value) => value.toUpperCase()),
    billingInterval: z.enum(["Monthly", "Yearly"], { message: "Select a billing interval." }),
    features: z.array(
        z.object({
            featureId: z.string().uuid(),
            limit: z.number().int("Limit must be a whole number.").positive("Limit must be greater than zero.").nullable(),
        })
    ),
});

/** Mirrors the server's CreateWebsiteTemplateRequestValidator so the form fails before the round trip. */
export const createWebsiteTemplateFormSchema = z.object({
    businessDomainId: z.string().trim().min(1, "Select a domain."),
    // Lowercase-hyphen-numeric on purpose: expected to match a physical template
    // project's own folder name, e.g. "fashion-template-02".
    name: z
        .string()
        .trim()
        .min(1, "Enter a template name.")
        .max(100, "Name must be 100 characters or fewer.")
        .regex(
            /^[a-z0-9]+(-[a-z0-9]+)*$/,
            "Use lowercase letters, numbers and hyphens only, e.g. 'fashion-template-02'."
        ),
    label: z.string().trim().min(1, "Enter a display label.").max(150, "Label must be 150 characters or fewer."),
    previewImageUrl: z
        .string()
        .trim()
        .min(1, "Upload a preview image.")
        .max(500, "URL must be 500 characters or fewer."),
    previewWebsiteUrl: z
        .string()
        .trim()
        .max(500, "URL must be 500 characters or fewer.")
        .optional(),
    displayOrder: z.coerce
        .number({ message: "Display order must be a number." })
        .int("Display order must be a whole number.")
        .min(0, "Display order must be zero or greater."),
});

/** Mirrors the server's UpdateWebsiteTemplateRequestValidator. Name/domain are immutable, so they're not part of this form. */
export const updateWebsiteTemplateFormSchema = z.object({
    label: z.string().trim().min(1, "Enter a display label.").max(150, "Label must be 150 characters or fewer."),
    previewImageUrl: z
        .string()
        .trim()
        .min(1, "Upload a preview image.")
        .max(500, "URL must be 500 characters or fewer."),
    previewWebsiteUrl: z
        .string()
        .trim()
        .max(500, "URL must be 500 characters or fewer.")
        .optional(),
    displayOrder: z.coerce
        .number({ message: "Display order must be a number." })
        .int("Display order must be a whole number.")
        .min(0, "Display order must be zero or greater."),
});

export const uploadWebsiteTemplateImageResponseSchema = z.object({
    imageUrl: z.string(),
});

export const websiteTemplateBusinessSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
});

export const websiteTemplateDetailSchema = z.object({
    id: z.string().uuid(),
    businessDomainId: z.string().uuid(),
    domainName: z.string(),
    name: z.string(),
    label: z.string(),
    previewImageUrl: z.string(),
    previewWebsiteUrl: z.string().nullable(),
    isActive: z.boolean(),
    displayOrder: z.number(),
    createdAt: z.iso.datetime(),
    businesses: z.array(websiteTemplateBusinessSchema),
});

// ---- website template requests ----

export const websiteTemplateRequestStatusSchema = z.enum(["Pending", "InProgress", "Closed"]);

export const websiteTemplateRequestSummarySchema = z.object({
    id: z.string().uuid(),
    businessId: z.string().uuid(),
    businessName: z.string(),
    ownerFullName: z.string(),
    ownerEmail: z.string(),
    templateLabel: z.string(),
    domainName: z.string(),
    status: websiteTemplateRequestStatusSchema,
    createdAt: z.iso.datetime(),
    finalWebsiteUrl: z.string().nullable(),
});

export const websiteTemplateRequestsPageSchema = pagedResultSchema(websiteTemplateRequestSummarySchema);

export const websiteTemplateRequestDetailSchema = z.object({
    id: z.string().uuid(),
    businessId: z.string().uuid(),
    businessName: z.string(),
    ownerFullName: z.string(),
    ownerEmail: z.string(),
    websiteTemplateId: z.string().uuid(),
    templateName: z.string(),
    templateLabel: z.string(),
    domainName: z.string(),
    customizationNotes: z.string(),
    status: websiteTemplateRequestStatusSchema,
    createdAt: z.iso.datetime(),
    buildStartedAt: z.iso.datetime().nullable(),
    closedAt: z.iso.datetime().nullable(),
    closedByFullName: z.string().nullable(),
    finalWebsiteUrl: z.string().nullable(),
});

/** Mirrors the server's CloseWebsiteTemplateRequestRequestValidator so the form fails before the round trip. */
export const closeWebsiteTemplateRequestFormSchema = z.object({
    finalWebsiteUrl: z
        .string()
        .trim()
        .min(1, "Enter the final website URL.")
        .url("Enter a valid URL, including https://."),
});

// ---- business detail ----

export const businessDetailFeatureCreditSchema = z.object({
    featureKey: z.string(),
    featureName: z.string(),
    creditsRemaining: z.number(),
    creditsGrantedTotal: z.number(),
});

export const businessDetailResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().nullable(),
    logoUrl: z.string().nullable(),
    currency: z.string(),
    locale: z.string(),
    contactEmail: z.string().nullable(),
    contactPhone: z.string().nullable(),
    businessDomainId: z.string().uuid().nullable(),
    domainName: z.string().nullable(),
    createdAt: z.iso.datetime(),

    ownerUserId: z.string().uuid(),
    ownerFullName: z.string(),
    ownerEmail: z.string(),

    members: z.array(businessMemberResponseSchema),

    productCount: z.number(),
    averageProductPrice: z.number().nullable(),
    minProductPrice: z.number().nullable(),
    maxProductPrice: z.number().nullable(),
    productsByCategory: z.array(keyCountSchema),

    productDraftCount: z.number(),
    productDraftsByStatus: z.array(keyCountSchema),

    websiteUrl: z.string().nullable(),
    websiteTemplateId: z.string().uuid().nullable(),
    websiteTemplateName: z.string().nullable(),
    websiteTemplateLabel: z.string().nullable(),
    websiteTemplateChosenAt: z.iso.datetime().nullable(),
    websiteTemplateRequests: z.array(websiteTemplateRequestSchema),

    subscription: businessSubscriptionResponseSchema,

    featureCredits: z.array(businessDetailFeatureCreditSchema),
});

// ---- metadata shape ----

export const metadataShapeFieldSchema = z.object({
    key: z.string(),
    label: z.string(),
    valueType: z.string(),
    isRequired: z.boolean(),
    allowedValues: z.array(z.string()),
});

export const metadataShapeSchema = z.array(metadataShapeFieldSchema);

/** The shape PUT /metadata-shape expects per field — adds displayOrder, which the GET response doesn't return. */
export const updateMetadataShapeFieldSchema = metadataShapeFieldSchema.extend({
    displayOrder: z.number(),
});

// ---- product attribute definitions (domain field catalogue) ----

export const productAttributeValueTypeSchema = z.enum(["Text", "Number", "Boolean", "TextList", "ColorList"]);

export const productAttributeDefinitionResponseSchema = z.object({
    id: z.string().uuid(),
    businessDomainId: z.string().uuid(),
    domainName: z.string(),
    key: z.string(),
    label: z.string(),
    valueType: productAttributeValueTypeSchema,
    isRequired: z.boolean(),
    allowedValues: z.array(z.string()),
    displayOrder: z.number(),
    isActive: z.boolean(),
    createdAt: z.iso.datetime(),
});

export const productAttributeDefinitionsSchema = z.array(productAttributeDefinitionResponseSchema);

/** Mirrors the server's CreateProductAttributeDefinitionRequestValidator. */
export const createProductAttributeDefinitionFormSchema = z.object({
    businessDomainId: z.string().trim().min(1, "Select a domain."),
    key: z
        .string()
        .trim()
        .min(1, "Enter a key.")
        .max(100, "Key must be 100 characters or fewer.")
        .regex(/^[a-z][a-zA-Z0-9]*$/, "Start lowercase, letters and numbers only, e.g. 'countryOfOrigin'."),
    label: z.string().trim().min(1, "Enter a label.").max(100, "Label must be 100 characters or fewer."),
    valueType: productAttributeValueTypeSchema,
    isRequired: z.boolean(),
    // Comma-separated in the form; split/trimmed before this parses.
    allowedValues: z.array(z.string().trim().min(1)),
    displayOrder: z.coerce
        .number({ message: "Display order must be a number." })
        .int("Display order must be a whole number.")
        .min(0, "Display order must be zero or greater."),
});

/** Mirrors the server's UpdateProductAttributeDefinitionRequestValidator. Domain/key are immutable, so not part of this form. */
export const updateProductAttributeDefinitionFormSchema = createProductAttributeDefinitionFormSchema.omit({
    businessDomainId: true,
    key: true,
});

// ---- website template customizable components (per-template capability catalogue) ----

/** Mirrors the server's WebsiteCustomizableValueType enum. Link is a labeled {text,url} pair (a CTA button); Url is a bare string — deliberately distinct types. */
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

export const websiteTemplateCustomizableComponentResponseSchema = z.object({
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
    createdAt: z.iso.datetime(),
});

export const websiteTemplateCustomizableComponentsSchema = z.array(websiteTemplateCustomizableComponentResponseSchema);

/** Mirrors the server's CreateWebsiteTemplateCustomizableComponentRequestValidator. WebsiteTemplateId isn't part of this form — it's the template the detail modal is already scoped to, threaded through as a route param, not user input. */
export const createWebsiteTemplateCustomizableComponentFormSchema = z.object({
    key: z
        .string()
        .trim()
        .min(1, "Enter a key.")
        .max(100, "Key must be 100 characters or fewer.")
        .regex(/^[a-z][a-zA-Z0-9]*$/, "Start lowercase, letters and numbers only, e.g. 'heroImage'."),
    label: z.string().trim().min(1, "Enter a label.").max(100, "Label must be 100 characters or fewer."),
    valueType: websiteCustomizableValueTypeSchema,
    isRequired: z.boolean(),
    // Comma-separated in the form; split/trimmed before this parses. Only meaningful for Select.
    allowedValues: z.array(z.string().trim().min(1)),
    helpText: z.string().trim().max(255, "Help text must be 255 characters or fewer.").optional(),
    displayOrder: z.coerce
        .number({ message: "Display order must be a number." })
        .int("Display order must be a whole number.")
        .min(0, "Display order must be zero or greater."),
});


// ---- customers ----

export const dashboardCustomerResponseSchema = z.object({
    id: z.string().uuid(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    orderCount: z.number(),
    createdAt: z.iso.datetime(),
});

export const dashboardCustomersPageSchema = pagedResultSchema(dashboardCustomerResponseSchema);

export const customerBusinessOrderSummarySchema = z.object({
    businessId: z.string().uuid(),
    businessName: z.string(),
    orderCount: z.number(),
    totalSpent: z.number(),
    currency: z.string(),
});

export const dashboardCustomerDetailResponseSchema = z.object({
    id: z.string().uuid(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string().nullable(),
    addressLine1: z.string().nullable(),
    addressLine2: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    postalCode: z.string().nullable(),
    country: z.string().nullable(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    businesses: z.array(customerBusinessOrderSummarySchema),
});
