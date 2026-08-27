import type z from "zod";
import type { PagedQuery } from "../../../types/pagination";
import type {
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
    businessDetailFeatureCreditSchema,
    metadataShapeFieldSchema,
    updateMetadataShapeFieldSchema,
} from "./validation";

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
    videoPreviewUrl: string;
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
    videoPreviewUrl: string;
    previewWebsiteUrl: string;
    displayOrder: string;
};

export type UsersSortField = "CreatedAt" | "Name" | "Email";
export type BusinessesSortField = "CreatedAt" | "Name" | "MemberCount" | "ProductCount";

export type SystemRoleFilter = "User" | "Admin" | "SuperAdmin";

export type UsersQueryParams = PagedQuery & {
    search?: string;
    systemRole?: SystemRoleFilter;
    sortBy: UsersSortField;
    sortDescending: boolean;
};

export type BusinessesQueryParams = PagedQuery & {
    search?: string;
    sortBy: BusinessesSortField;
    sortDescending: boolean;
};

export type WebsiteTemplateRequestsQueryParams = PagedQuery & {
    status?: WebsiteTemplateRequestStatus;
    sortDescending: boolean;
};

export type BusinessDetailResponse = z.infer<typeof businessDetailResponseSchema>;
export type BusinessDetailFeatureCredit = z.infer<typeof businessDetailFeatureCreditSchema>;
export type MetadataShapeField = z.infer<typeof metadataShapeFieldSchema>;
export type UpdateMetadataShapeFieldPayload = z.infer<typeof updateMetadataShapeFieldSchema>;
