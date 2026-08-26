import z from "zod";
import type {
    ProductsQueryParams,
    CreateBusinessMemberPayload,
} from "../../features/Dashboard/BusinessOwnerDashboard/types";
import {
    businessDashboardStatsResponseSchema,
    businessMemberResponseSchema,
    createBusinessMemberResponseSchema,
    businessProductDetailSchema,
    businessProductsPageSchema,
    businessSubscriptionResponseSchema,
    productFormSchema,
    productImageUploadSchema,
    websiteTemplateOptionsSchema,
    websiteTemplateRequestSchema,
    featureCreditOverviewSchema,
    businessFeatureCreditSchema,
} from "../../features/Dashboard/BusinessOwnerDashboard/validation";
import { authenticatedApi } from "./api";
import { apiRoutes } from "./apiRoutes";

/** One image in a save payload — already uploaded, referenced by the URL the upload endpoint returned. */
export type SaveProductImagePayload = {
    url: string;
    isMain: boolean;
    width?: number;
    height?: number;
    altText?: string;
};

/**
 * Wire shape for create/update. Metadata values are already converted to their real
 * JSON types (string / number / boolean / string[]) by the form before this point —
 * the backend validates each against the type its definition declares.
 *
 * A full replace, not a partial patch: every field is sent on every save, matching
 * the backend's own SaveProductRequest contract (one DTO for both create and update).
 */
export type SaveProductPayload = {
    title: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    categoryId: string;
    images: SaveProductImagePayload[];
    sku?: string;
    stockQuantity?: number;
    tags: string[];
    saleEndsAt?: string;
    metadata: Record<string, unknown> | null;
};

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

/**
 * Creates the account and attaches it to the business in one call. The businessId
 * goes in the path, not the body — the API derives the tenant from the route it has
 * already authorized.
 */
export const createBusinessMemberService = async (
    businessId: string,
    payload: CreateBusinessMemberPayload
) => {
    const { data } = await authenticatedApi.post(
        apiRoutes.BUSINESS_DASHBOARD_MEMBERS(businessId),
        payload
    );

    return createBusinessMemberResponseSchema.parse(data);
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

// ---- product CRUD ----

export const getProductFormService = async (businessId: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_PRODUCT_FORM(businessId));

    return productFormSchema.parse(data);
};

export const getBusinessProductService = async (businessId: string, productId: string) => {
    const { data } = await authenticatedApi.get(
        apiRoutes.BUSINESS_DASHBOARD_PRODUCT(businessId, productId)
    );

    return businessProductDetailSchema.parse(data);
};

export const createBusinessProductService = async (
    businessId: string,
    payload: SaveProductPayload
) => {
    const { data } = await authenticatedApi.post(
        apiRoutes.BUSINESS_DASHBOARD_PRODUCTS(businessId),
        payload
    );

    return businessProductDetailSchema.parse(data);
};

export const updateBusinessProductService = async (
    businessId: string,
    productId: string,
    payload: SaveProductPayload
) => {
    const { data } = await authenticatedApi.put(
        apiRoutes.BUSINESS_DASHBOARD_PRODUCT(businessId, productId),
        payload
    );

    return businessProductDetailSchema.parse(data);
};

export const deleteBusinessProductService = async (businessId: string, productId: string) => {
    await authenticatedApi.delete(apiRoutes.BUSINESS_DASHBOARD_PRODUCT(businessId, productId));
};

// ---- website template requests ----

export const getWebsiteTemplateOptionsService = async (businessId: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_WEBSITE_TEMPLATE_OPTIONS(businessId));

    return websiteTemplateOptionsSchema.parse(data);
};

export const getWebsiteTemplateRequestsService = async (businessId: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_WEBSITE_TEMPLATE_REQUESTS(businessId));

    return z.array(websiteTemplateRequestSchema).parse(data);
};

export const createWebsiteTemplateRequestService = async (
    businessId: string,
    websiteTemplateId: string,
    customizationNotes: string
) => {
    const { data } = await authenticatedApi.post(apiRoutes.BUSINESS_DASHBOARD_WEBSITE_TEMPLATE_REQUESTS(businessId), {
        websiteTemplateId,
        customizationNotes,
    });

    return websiteTemplateRequestSchema.parse(data);
};

// ---- feature credits ----

export const getBusinessFeaturesService = async (businessId: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.BUSINESS_DASHBOARD_FEATURES(businessId));

    return z.array(featureCreditOverviewSchema).parse(data);
};

export const purchaseFeatureCreditsService = async (businessId: string, packageId: string) => {
    const { data } = await authenticatedApi.post(apiRoutes.BUSINESS_DASHBOARD_FEATURE_PURCHASES(businessId), {
        packageId,
    });

    return businessFeatureCreditSchema.parse(data);
};

export const uploadProductImageService = async (businessId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    // Content-Type is deliberately not set: the browser must generate it so the
    // multipart boundary is included, and setting it by hand omits that.
    const { data } = await authenticatedApi.post(
        apiRoutes.BUSINESS_DASHBOARD_PRODUCT_IMAGE(businessId),
        formData
    );

    return productImageUploadSchema.parse(data);
};
