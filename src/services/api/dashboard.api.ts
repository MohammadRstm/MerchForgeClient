import type {
    BusinessesQueryParams,
    UsersQueryParams,
    CreateWebsiteTemplatePayload,
} from "../../features/Dashboard/SuperAdminDashboard/types";
import {
    dashboardBusinessesPageSchema,
    dashboardStatsResponseSchema,
    dashboardUsersPageSchema,
    revokeUserSessionsResponseSchema,
    websiteTemplateResponseSchema,
    websiteTemplatesResponseSchema,
} from "../../features/Dashboard/SuperAdminDashboard/validation";
import { authenticatedApi } from "./api";
import { apiRoutes } from "./apiRoutes";

export const getDashboardStatsService = async () => {
    const { data } = await authenticatedApi.get(apiRoutes.DASHBOARD_STATS);

    return dashboardStatsResponseSchema.parse(data);
};

export const getDashboardUsersService = async (query: UsersQueryParams) => {
    const { data } = await authenticatedApi.get(apiRoutes.DASHBOARD_USERS, {
        params: query,
    });

    return dashboardUsersPageSchema.parse(data);
};

export const getDashboardBusinessesService = async (query: BusinessesQueryParams) => {
    const { data } = await authenticatedApi.get(apiRoutes.DASHBOARD_BUSINESSES, {
        params: query,
    });

    return dashboardBusinessesPageSchema.parse(data);
};

export const revokeUserSessionsService = async (userId: string) => {
    const { data } = await authenticatedApi.post(
        apiRoutes.DASHBOARD_REVOKE_USER_SESSIONS(userId)
    );

    return revokeUserSessionsResponseSchema.parse(data);
};

export const getDashboardWebsiteTemplatesService = async () => {
    const { data } = await authenticatedApi.get(apiRoutes.DASHBOARD_WEBSITE_TEMPLATES);

    return websiteTemplatesResponseSchema.parse(data);
};

export const createWebsiteTemplateService = async (payload: CreateWebsiteTemplatePayload) => {
    const { data } = await authenticatedApi.post(apiRoutes.DASHBOARD_WEBSITE_TEMPLATES, payload);

    return websiteTemplateResponseSchema.parse(data);
};
