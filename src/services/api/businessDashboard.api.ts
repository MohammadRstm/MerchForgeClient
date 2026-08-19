import z from "zod";
import type { ProductsQueryParams } from "../../features/Dashboard/BusinessOwnerDashboard/types";
import {
    businessDashboardStatsResponseSchema,
    businessMemberResponseSchema,
    businessProductsPageSchema,
    businessSubscriptionResponseSchema,
} from "../../features/Dashboard/BusinessOwnerDashboard/validation";
import { authenticatedApi } from "./api";
import { apiRoutes } from "./apiRoutes";

export const getBusinessDashboardStatsService = async (businessId: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_STATS(businessId));

    return businessDashboardStatsResponseSchema.parse(data);
};

export const getBusinessProductsService = async (businessId: string, query: ProductsQueryParams) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_PRODUCTS(businessId), {
        params: query,
    });

    return businessProductsPageSchema.parse(data);
};

export const getBusinessMembersService = async (businessId: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_MEMBERS(businessId));

    return z.array(businessMemberResponseSchema).parse(data);
};

export const getBusinessSubscriptionService = async (businessId: string) => {
    const response = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_SUBSCRIPTION(businessId));

    // A business with no subscription yet comes back as 204 No Content
    // (ASP.NET Core's default behavior for an Ok(null) action result).
    if (response.status === 204 || !response.data) {
        return null;
    }

    return businessSubscriptionResponseSchema.parse(response.data);
};
