import type z from "zod";
import type { PagedQuery } from "../../../types/pagination";
import type {
    dashboardStatsResponseSchema,
    dashboardUserResponseSchema,
    dashboardBusinessResponseSchema,
    revokeUserSessionsResponseSchema,
} from "./validation";

export type DashboardStatsResponse = z.infer<typeof dashboardStatsResponseSchema>;
export type DashboardUserResponse = z.infer<typeof dashboardUserResponseSchema>;
export type DashboardBusinessResponse = z.infer<typeof dashboardBusinessResponseSchema>;
export type RevokeUserSessionsResponse = z.infer<typeof revokeUserSessionsResponseSchema>;

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
