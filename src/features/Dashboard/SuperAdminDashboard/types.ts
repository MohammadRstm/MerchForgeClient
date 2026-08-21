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
} from "./validation";

export type DashboardStatsResponse = z.infer<typeof dashboardStatsResponseSchema>;
export type DashboardUserResponse = z.infer<typeof dashboardUserResponseSchema>;
export type DashboardBusinessResponse = z.infer<typeof dashboardBusinessResponseSchema>;
export type RevokeUserSessionsResponse = z.infer<typeof revokeUserSessionsResponseSchema>;
export type BusinessOwnerInvitationResponse = z.infer<typeof businessOwnerInvitationResponseSchema>;
export type WebsiteTemplateResponse = z.infer<typeof websiteTemplateResponseSchema>;

/** The coerced/validated shape submitted to the API — displayOrder is a real number here. */
export type CreateWebsiteTemplatePayload = z.infer<typeof createWebsiteTemplateFormSchema>;

/** The raw, string-backed shape the form's controlled inputs hold before validation. */
export type CreateWebsiteTemplateFormValues = {
    businessDomainId: string;
    name: string;
    label: string;
    videoPreviewUrl: string;
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
