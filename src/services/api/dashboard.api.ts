import type {
    BusinessesQueryParams,
    CustomersQueryParams,
    UsersQueryParams,
    CreateWebsiteTemplatePayload,
    UpdateWebsiteTemplatePayload,
    WebsiteTemplateRequestsQueryParams,
    CloseWebsiteTemplateRequestPayload,
    UpdateMetadataShapeFieldPayload,
    CreateProductAttributeDefinitionPayload,
    UpdateProductAttributeDefinitionPayload,
} from "../../features/Dashboard/SuperAdminDashboard/types";
import {
    dashboardBusinessesPageSchema,
    dashboardStatsResponseSchema,
    dashboardUsersPageSchema,
    revokeUserSessionsResponseSchema,
    websiteTemplateResponseSchema,
    websiteTemplatesResponseSchema,
    websiteTemplateDetailSchema,
    uploadWebsiteTemplateImageResponseSchema,
    websiteTemplateRequestsPageSchema,
    websiteTemplateRequestDetailSchema,
    businessDetailResponseSchema,
    metadataShapeSchema,
    productAttributeDefinitionResponseSchema,
    productAttributeDefinitionsSchema,
    dashboardCustomersPageSchema,
    dashboardCustomerDetailResponseSchema,
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

export const getDashboardCustomersService = async (query: CustomersQueryParams) => {
    const { data } = await authenticatedApi.get(apiRoutes.DASHBOARD_CUSTOMERS, {
        params: query,
    });

    return dashboardCustomersPageSchema.parse(data);
};

export const getDashboardCustomerDetailService = async (customerId: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.DASHBOARD_CUSTOMER_DETAIL(customerId));

    return dashboardCustomerDetailResponseSchema.parse(data);
};

export const revokeUserSessionsService = async (userId: string) => {
    const { data } = await authenticatedApi.post(
        apiRoutes.DASHBOARD_REVOKE_USER_SESSIONS(userId)
    );

    return revokeUserSessionsResponseSchema.parse(data);
};

export const getDashboardBusinessDetailService = async (businessId: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.DASHBOARD_BUSINESS_DETAIL(businessId));

    return businessDetailResponseSchema.parse(data);
};

export const revokeBusinessSessionsService = async (businessId: string) => {
    const { data } = await authenticatedApi.post(
        apiRoutes.DASHBOARD_BUSINESS_REVOKE_SESSIONS(businessId)
    );

    return revokeUserSessionsResponseSchema.parse(data);
};

export const getBusinessMetadataShapeService = async (businessId: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.DASHBOARD_BUSINESS_METADATA_SHAPE(businessId));

    return metadataShapeSchema.parse(data);
};

export const updateBusinessMetadataShapeService = async (
    businessId: string,
    fields: UpdateMetadataShapeFieldPayload[]
) => {
    const { data } = await authenticatedApi.put(apiRoutes.DASHBOARD_BUSINESS_METADATA_SHAPE(businessId), {
        fields,
    });

    return metadataShapeSchema.parse(data);
};

// ---- product attribute definitions (domain field catalogue) ----

export const getDashboardProductAttributesService = async (businessDomainId?: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.DASHBOARD_PRODUCT_ATTRIBUTES, {
        params: businessDomainId ? { businessDomainId } : undefined,
    });

    return productAttributeDefinitionsSchema.parse(data);
};

export const createProductAttributeDefinitionService = async (payload: CreateProductAttributeDefinitionPayload) => {
    const { data } = await authenticatedApi.post(apiRoutes.DASHBOARD_PRODUCT_ATTRIBUTES, payload);

    return productAttributeDefinitionResponseSchema.parse(data);
};

export const updateProductAttributeDefinitionService = async (
    id: string,
    payload: UpdateProductAttributeDefinitionPayload
) => {
    const { data } = await authenticatedApi.put(apiRoutes.DASHBOARD_PRODUCT_ATTRIBUTE(id), payload);

    return productAttributeDefinitionResponseSchema.parse(data);
};

export const deactivateProductAttributeDefinitionService = async (id: string) => {
    const { data } = await authenticatedApi.post(apiRoutes.DASHBOARD_PRODUCT_ATTRIBUTE_DEACTIVATE(id));

    return productAttributeDefinitionResponseSchema.parse(data);
};

export const reactivateProductAttributeDefinitionService = async (id: string) => {
    const { data } = await authenticatedApi.post(apiRoutes.DASHBOARD_PRODUCT_ATTRIBUTE_REACTIVATE(id));

    return productAttributeDefinitionResponseSchema.parse(data);
};

export const getDashboardWebsiteTemplatesService = async () => {
    const { data } = await authenticatedApi.get(apiRoutes.DASHBOARD_WEBSITE_TEMPLATES);

    return websiteTemplatesResponseSchema.parse(data);
};

export const createWebsiteTemplateService = async (payload: CreateWebsiteTemplatePayload) => {
    const { data } = await authenticatedApi.post(apiRoutes.DASHBOARD_WEBSITE_TEMPLATES, payload);

    return websiteTemplateResponseSchema.parse(data);
};

export const uploadWebsiteTemplateImageService = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    // Content-Type is deliberately not set: the browser must generate it so the
    // multipart boundary is included, and setting it by hand omits that.
    const { data } = await authenticatedApi.post(apiRoutes.DASHBOARD_WEBSITE_TEMPLATE_IMAGE, formData);

    return uploadWebsiteTemplateImageResponseSchema.parse(data);
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
