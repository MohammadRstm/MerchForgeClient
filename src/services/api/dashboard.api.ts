import type {
    BusinessesQueryParams,
    UsersQueryParams,
    CreateWebsiteTemplatePayload,
    UpdateWebsiteTemplatePayload,
    WebsiteTemplateRequestsQueryParams,
    CloseWebsiteTemplateRequestPayload,
} from "../../features/Dashboard/SuperAdminDashboard/types";
import {
    dashboardBusinessesPageSchema,
    dashboardStatsResponseSchema,
    dashboardUsersPageSchema,
    revokeUserSessionsResponseSchema,
    websiteTemplateResponseSchema,
    websiteTemplatesResponseSchema,
    websiteTemplateDetailSchema,
    uploadWebsiteTemplateVideoResponseSchema,
    websiteTemplateRequestsPageSchema,
    websiteTemplateRequestDetailSchema,
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

export const uploadWebsiteTemplateVideoService = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    // Content-Type is deliberately not set: the browser must generate it so the
    // multipart boundary is included, and setting it by hand omits that.
    const { data } = await authenticatedApi.post(apiRoutes.DASHBOARD_WEBSITE_TEMPLATE_VIDEO, formData);

    return uploadWebsiteTemplateVideoResponseSchema.parse(data);
};

export const getWebsiteTemplateDetailService = async (templateId: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.DASHBOARD_WEBSITE_TEMPLATE(templateId));

    return websiteTemplateDetailSchema.parse(data);
};

export const updateWebsiteTemplateService = async (templateId: string, payload: UpdateWebsiteTemplatePayload) => {
    const { data } = await authenticatedApi.put(apiRoutes.DASHBOARD_WEBSITE_TEMPLATE(templateId), payload);

    return websiteTemplateResponseSchema.parse(data);
};

export const deactivateWebsiteTemplateService = async (templateId: string) => {
    const { data } = await authenticatedApi.post(apiRoutes.DASHBOARD_WEBSITE_TEMPLATE_DEACTIVATE(templateId));

    return websiteTemplateResponseSchema.parse(data);
};

// ---- website template requests ----

export const getDashboardWebsiteTemplateRequestsService = async (query: WebsiteTemplateRequestsQueryParams) => {
    const { data } = await authenticatedApi.get(apiRoutes.DASHBOARD_WEBSITE_TEMPLATE_REQUESTS, {
        params: query,
    });

    return websiteTemplateRequestsPageSchema.parse(data);
};

export const getDashboardWebsiteTemplateRequestService = async (requestId: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.DASHBOARD_WEBSITE_TEMPLATE_REQUEST(requestId));

    return websiteTemplateRequestDetailSchema.parse(data);
};

export const startWebsiteTemplateRequestBuildService = async (requestId: string) => {
    const { data } = await authenticatedApi.post(apiRoutes.DASHBOARD_WEBSITE_TEMPLATE_REQUEST_START_BUILD(requestId));

    return websiteTemplateRequestDetailSchema.parse(data);
};

export const closeWebsiteTemplateRequestService = async (
    requestId: string,
    payload: CloseWebsiteTemplateRequestPayload
) => {
    const { data } = await authenticatedApi.post(apiRoutes.DASHBOARD_WEBSITE_TEMPLATE_REQUEST_CLOSE(requestId), payload);

    return websiteTemplateRequestDetailSchema.parse(data);
};
