import z from "zod";
import { pagedResultSchema } from "../../../types/pagination";

export const roleCountSchema = z.object({
    role: z.string(),
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

    usersBySystemRole: z.array(roleCountSchema),
    businessUsersByRole: z.array(roleCountSchema),

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
