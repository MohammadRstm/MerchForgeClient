import type z from "zod";
import type { PagedQuery } from "../../../types/pagination";
import type { FeatureCreditOverview } from "../BusinessOwnerDashboard/types";
import type {
    keyCountSchema,
    dashboardStatsResponseSchema,
    dashboardUserResponseSchema,
    dashboardBusinessResponseSchema,
    revokeUserSessionsResponseSchema,
    businessOwnerInvitationResponseSchema,
    websiteTemplateResponseSchema,
    createWebsiteTemplateFormSchema,
    updateWebsiteTemplateFormSchema,
    websiteTemplateDetailSchema,
    websiteTemplateBusinessSchema,
    websiteTemplateRequestStatusSchema,
    websiteTemplateRequestSummarySchema,
    websiteTemplateRequestDetailSchema,
    closeWebsiteTemplateRequestFormSchema,
    businessDetailResponseSchema,
    metadataShapeFieldSchema,
    updateMetadataShapeFieldSchema,
    productAttributeValueTypeSchema,
    productAttributeDefinitionResponseSchema,
    createProductAttributeDefinitionFormSchema,
    updateProductAttributeDefinitionFormSchema,
    websiteCustomizableValueTypeSchema,
    websiteTemplateCustomizableComponentResponseSchema,
    createWebsiteTemplateCustomizableComponentFormSchema,
    dashboardCustomerResponseSchema,
    dashboardCustomerDetailResponseSchema,
    customerBusinessOrderSummarySchema,
    subscriptionPlanResponseSchema,
    subscriptionPlanDetailResponseSchema,
    featureResponseSchema,
    subscriptionPlanFormSchema,
    subscriptionPlanGroupSchema,
    subscriptionPlanGroupIntervalSchema,
    planSubscriptionStatsSchema,
    subscriptionStatusSchema,
    adminSubscriptionListItemSchema,
    recentSubscriptionActivityEntrySchema,
    changeSubscriptionFormSchema,
    userMembershipResponseSchema,
    auditEventTypeSchema,
    auditLogResponseSchema,
    dashboardUserDetailResponseSchema,
    authActivityPointSchema,
    securityOverviewResponseSchema,
    recentFailedLoginResponseSchema,
    failedLoginStatsResponseSchema,
    securityAlertResponseSchema,
    customerCurrencyTotalSchema,
    customerStatsResponseSchema,
    topCustomerResponseSchema,
    businessOptionResponseSchema,
    revokeCustomerSessionsResponseSchema,
    customerOrderResponseSchema,
    customerSpendPointSchema,
    timeSeriesPointSchema,
    updateCustomerFormSchema,
    domainTemplateSummarySchema,
    templateStatsResponseSchema,
} from "./validation";

export type KeyCount = z.infer<typeof keyCountSchema>;
export type DashboardStatsResponse = z.infer<typeof dashboardStatsResponseSchema>;
export type DashboardUserResponse = z.infer<typeof dashboardUserResponseSchema>;
export type DashboardBusinessResponse = z.infer<typeof dashboardBusinessResponseSchema>;
export type RevokeUserSessionsResponse = z.infer<typeof revokeUserSessionsResponseSchema>;
export type BusinessOwnerInvitationResponse = z.infer<typeof businessOwnerInvitationResponseSchema>;
export type WebsiteTemplateResponse = z.infer<typeof websiteTemplateResponseSchema>;
export type WebsiteTemplateBusiness = z.infer<typeof websiteTemplateBusinessSchema>;
export type WebsiteTemplateDetail = z.infer<typeof websiteTemplateDetailSchema>;

/** The coerced/validated shape submitted to the API for an edit — displayOrder is a real number here. */
export type UpdateWebsiteTemplatePayload = z.infer<typeof updateWebsiteTemplateFormSchema>;

/** The raw, string-backed shape the edit form's controlled inputs hold before validation. */
export type UpdateWebsiteTemplateFormValues = {
    label: string;
    previewImageUrl: string;
    previewWebsiteUrl: string;
    displayOrder: string;
};
export type WebsiteTemplateRequestStatus = z.infer<typeof websiteTemplateRequestStatusSchema>;
export type WebsiteTemplateRequestSummaryResponse = z.infer<typeof websiteTemplateRequestSummarySchema>;
export type WebsiteTemplateRequestDetailResponse = z.infer<typeof websiteTemplateRequestDetailSchema>;
export type CloseWebsiteTemplateRequestPayload = z.infer<typeof closeWebsiteTemplateRequestFormSchema>;

/** The coerced/validated shape submitted to the API — displayOrder is a real number here. */
export type CreateWebsiteTemplatePayload = z.infer<typeof createWebsiteTemplateFormSchema>;

/** The raw, string-backed shape the form's controlled inputs hold before validation. */
export type CreateWebsiteTemplateFormValues = {
    businessDomainId: string;
    name: string;
    label: string;
    previewImageUrl: string;
    previewWebsiteUrl: string;
    displayOrder: string;
};

// ---- subscription plans ----

export type SubscriptionPlanResponse = z.infer<typeof subscriptionPlanResponseSchema>;
export type SubscriptionPlanDetailResponse = z.infer<typeof subscriptionPlanDetailResponseSchema>;
export type FeatureResponse = z.infer<typeof featureResponseSchema>;

/** The coerced/validated shape submitted to the API — price is a real number, features carry real numeric/null limits. */
export type SubscriptionPlanPayload = z.infer<typeof subscriptionPlanFormSchema>;

/**
 * The raw, string-backed shape the create/edit form's controlled inputs hold
 * before validation. selectedFeatures maps a Feature's id to its limit input
 * value ("" means unlimited) — a feature only appears here at all once its
 * checkbox is checked, so Object.keys(selectedFeatures) is the checked set.
 */
export type SubscriptionPlanFormValues = {
    name: string;
    description: string;
    price: string;
    currency: string;
    billingInterval: "Monthly" | "Yearly";
    selectedFeatures: Record<string, string>;
};

export type SubscriptionPlanGroup = z.infer<typeof subscriptionPlanGroupSchema>;
export type SubscriptionPlanGroupInterval = z.infer<typeof subscriptionPlanGroupIntervalSchema>;
export type PlanSubscriptionStats = z.infer<typeof planSubscriptionStatsSchema>;

// ---- subscriptions (platform-wide Subscriptions tab) ----

export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;
export type AdminSubscriptionListItem = z.infer<typeof adminSubscriptionListItemSchema>;
export type RecentSubscriptionActivityEntry = z.infer<typeof recentSubscriptionActivityEntrySchema>;
export type ChangeSubscriptionPayload = z.infer<typeof changeSubscriptionFormSchema>;

export type SubscriptionsSortField = "CreatedAt" | "BusinessName" | "PlanName" | "CurrentPeriodEnd";

export type SubscriptionsQueryParams = PagedQuery & {
    search?: string;
    planId?: string;
    planName?: string;
    billingInterval?: "Monthly" | "Yearly";
    status?: SubscriptionStatus;
    sortBy: SubscriptionsSortField;
    sortDescending: boolean;
};

export type UsersSortField = "CreatedAt" | "Name" | "Email" | "SystemRole" | "HasActiveSession";
export type BusinessesSortField = "CreatedAt" | "Name" | "MemberCount" | "ProductCount";

export type SystemRoleFilter = "User" | "Admin" | "SuperAdmin";
export type BusinessRoleFilter = "Owner" | "Admin" | "Member";

export type UsersQueryParams = PagedQuery & {
    search?: string;
    systemRole?: SystemRoleFilter;
    businessRole?: BusinessRoleFilter;
    hasActiveSession?: boolean;
    isDisabled?: boolean;
    sortBy: UsersSortField;
    sortDescending: boolean;
};

// ---- user detail / account status ----

export type UserMembershipResponse = z.infer<typeof userMembershipResponseSchema>;
export type DashboardUserDetailResponse = z.infer<typeof dashboardUserDetailResponseSchema>;

// ---- audit / security ----

export type AuditEventType = z.infer<typeof auditEventTypeSchema>;
export type AuditLogResponse = z.infer<typeof auditLogResponseSchema>;
export type AuthActivityPoint = z.infer<typeof authActivityPointSchema>;
export type SecurityOverviewResponse = z.infer<typeof securityOverviewResponseSchema>;
export type RecentFailedLoginResponse = z.infer<typeof recentFailedLoginResponseSchema>;
export type FailedLoginStatsResponse = z.infer<typeof failedLoginStatsResponseSchema>;
export type SecurityAlertResponse = z.infer<typeof securityAlertResponseSchema>;

export type AuditLogQueryParams = PagedQuery & {
    eventType?: AuditEventType;
    actor?: string;
    success?: boolean;
    from?: string;
    to?: string;
    businessId?: string;
    entityId?: string;
};

export type BusinessesQueryParams = PagedQuery & {
    search?: string;
    sortBy: BusinessesSortField;
    sortDescending: boolean;
};

export type WebsiteTemplateRequestsQueryParams = PagedQuery & {
    status?: WebsiteTemplateRequestStatus;
    websiteTemplateId?: string;
    sortDescending: boolean;
};

// ---- website templates (catalogue) ----

export type DomainTemplateSummary = z.infer<typeof domainTemplateSummarySchema>;
export type TemplateStatsResponse = z.infer<typeof templateStatsResponseSchema>;

export type WebsiteTemplateSortField = "DisplayOrder" | "Name" | "CreatedAt" | "BusinessesUsingIt" | "RequestCount";

export type WebsiteTemplatesQueryParams = PagedQuery & {
    search?: string;
    businessDomainId?: string;
    isActive?: boolean;
    hasBusinesses?: boolean;
    isCustomizable?: boolean;
    sortBy: WebsiteTemplateSortField;
    sortDescending: boolean;
};

export type BusinessDetailResponse = z.infer<typeof businessDetailResponseSchema>;
export type BusinessDetailFeatureCredit = FeatureCreditOverview;
export type MetadataShapeField = z.infer<typeof metadataShapeFieldSchema>;
export type UpdateMetadataShapeFieldPayload = z.infer<typeof updateMetadataShapeFieldSchema>;

export type ProductAttributeValueType = z.infer<typeof productAttributeValueTypeSchema>;
export type ProductAttributeDefinition = z.infer<typeof productAttributeDefinitionResponseSchema>;

/** The coerced/validated shape submitted to the API for a new field — displayOrder is a real number here. */
export type CreateProductAttributeDefinitionPayload = z.infer<typeof createProductAttributeDefinitionFormSchema>;

/** The raw, string-backed shape the create form's controlled inputs hold before validation. */
export type CreateProductAttributeDefinitionFormValues = {
    businessDomainId: string;
    key: string;
    label: string;
    valueType: ProductAttributeValueType;
    isRequired: boolean;
    allowedValuesInput: string;
    displayOrder: string;
};

export type UpdateProductAttributeDefinitionPayload = z.infer<typeof updateProductAttributeDefinitionFormSchema>;

export type UpdateProductAttributeDefinitionFormValues = {
    label: string;
    valueType: ProductAttributeValueType;
    isRequired: boolean;
    allowedValuesInput: string;
    displayOrder: string;
};

// ---- website template customizable components ----

export type WebsiteCustomizableValueType = z.infer<typeof websiteCustomizableValueTypeSchema>;
export type WebsiteTemplateCustomizableComponent = z.infer<typeof websiteTemplateCustomizableComponentResponseSchema>;

/**
 * The shape submitted to the API when a catalogue checkbox is checked —
 * key/label/valueType/helpText come straight from the catalogue entry (see
 * websiteCustomizableFieldCatalogue.ts), never typed by an admin, so there's no
 * separate string-backed form-values type to convert from the way other admin forms
 * have one.
 */
export type CreateWebsiteTemplateCustomizableComponentPayload = z.infer<
    typeof createWebsiteTemplateCustomizableComponentFormSchema
>;

// ---- customers ----

export type DashboardCustomerResponse = z.infer<typeof dashboardCustomerResponseSchema>;
export type CustomerBusinessOrderSummary = z.infer<typeof customerBusinessOrderSummarySchema>;
export type DashboardCustomerDetailResponse = z.infer<typeof dashboardCustomerDetailResponseSchema>;

export type CustomersSortField = "CreatedAt" | "Name" | "Email" | "OrderCount" | "TotalSpent" | "LastOrderAt";

export type CustomersQueryParams = PagedQuery & {
    search?: string;
    businessId?: string;
    hasOrders?: boolean;
    registeredFrom?: string;
    registeredTo?: string;
    sortBy: CustomersSortField;
    sortDescending: boolean;
};

export type TimeSeriesPoint = z.infer<typeof timeSeriesPointSchema>;
export type CustomerCurrencyTotal = z.infer<typeof customerCurrencyTotalSchema>;
export type CustomerStatsResponse = z.infer<typeof customerStatsResponseSchema>;
export type TopCustomerResponse = z.infer<typeof topCustomerResponseSchema>;
export type TopCustomersRankBy = "Spend" | "Orders";
export type BusinessOption = z.infer<typeof businessOptionResponseSchema>;
export type RevokeCustomerSessionsResponse = z.infer<typeof revokeCustomerSessionsResponseSchema>;
export type CustomerOrderResponse = z.infer<typeof customerOrderResponseSchema>;
export type CustomerSpendPoint = z.infer<typeof customerSpendPointSchema>;

export type UpdateCustomerPayload = z.infer<typeof updateCustomerFormSchema>;

export type UpdateCustomerFormValues = {
    firstName: string;
    lastName: string;
    phone: string;
};

export type CustomerOrdersQueryParams = PagedQuery & {
    businessId?: string;
};
