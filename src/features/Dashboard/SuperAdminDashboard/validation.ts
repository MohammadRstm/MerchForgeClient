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

export const dashboardStatsResponseSchema = z.object({
    totalUsers: z.number(),
    totalBusinesses: z.number(),
    totalProducts: z.number(),
    totalProductDrafts: z.number(),
    pendingInvitations: z.number(),

    usersBySystemRole: z.array(keyCountSchema),
    businessUsersByRole: z.array(keyCountSchema),

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
    videoPreviewUrl: z.string(),
    isActive: z.boolean(),
    displayOrder: z.number(),
    businessesUsingIt: z.number(),
    createdAt: z.iso.datetime(),
});

export const websiteTemplatesResponseSchema = z.array(websiteTemplateResponseSchema);

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
    videoPreviewUrl: z
        .string()
        .trim()
        .min(1, "Enter a video preview URL.")
        .max(500, "URL must be 500 characters or fewer."),
    displayOrder: z.coerce
        .number({ message: "Display order must be a number." })
        .int("Display order must be a whole number.")
        .min(0, "Display order must be zero or greater."),
});
