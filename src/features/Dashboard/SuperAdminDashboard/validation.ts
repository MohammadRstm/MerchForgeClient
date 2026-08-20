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
