import type z from "zod";

import type { PagedQuery } from "../../../types/pagination";
import type {
    businessDashboardStatsResponseSchema,
    businessMemberResponseSchema,
    assignableBusinessRoleSchema,
    createBusinessMemberResponseSchema,
    createBusinessMemberFormSchema,
    businessProductDetailSchema,
    businessProductResponseSchema,
    productImageSchema,
    businessSubscriptionResponseSchema,
    productDraftMessageSchema,
    productDraftProductSchema,
    productDraftSchema,
    productDraftStatusSchema,
    productFormFieldSchema,
    productFormSchema,
    productValueTypeSchema,
    websiteTemplateOptionSchema,
    chosenWebsiteTemplateSchema,
    businessWebsiteTemplateStatusSchema,
    featureCreditPackageSchema,
    featureCreditOverviewSchema,
    businessFeatureCreditSchema,
    imageEditJobSchema,
} from "./validation";

export type BusinessDashboardStatsResponse = z.infer<typeof businessDashboardStatsResponseSchema>;
export type BusinessProductResponse = z.infer<typeof businessProductResponseSchema>;
export type BusinessMemberResponse = z.infer<typeof businessMemberResponseSchema>;
export type AssignableBusinessRole = z.infer<typeof assignableBusinessRoleSchema>;
export type CreateBusinessMemberResponse = z.infer<typeof createBusinessMemberResponseSchema>;
export type CreateBusinessMemberPayload = z.infer<typeof createBusinessMemberFormSchema>;
export type BusinessSubscriptionResponse = z.infer<typeof businessSubscriptionResponseSchema>;

export type BusinessProductDetail = z.infer<typeof businessProductDetailSchema>;
export type BusinessProductImage = z.infer<typeof productImageSchema>;
export type ProductForm = z.infer<typeof productFormSchema>;
export type ProductFormField = z.infer<typeof productFormFieldSchema>;
export type ProductValueType = z.infer<typeof productValueTypeSchema>;

export type WebsiteTemplateOption = z.infer<typeof websiteTemplateOptionSchema>;
export type ChosenWebsiteTemplate = z.infer<typeof chosenWebsiteTemplateSchema>;
export type BusinessWebsiteTemplateStatus = z.infer<typeof businessWebsiteTemplateStatusSchema>;

export type FeatureCreditPackage = z.infer<typeof featureCreditPackageSchema>;
export type FeatureCreditOverview = z.infer<typeof featureCreditOverviewSchema>;
export type BusinessFeatureCredit = z.infer<typeof businessFeatureCreditSchema>;

export type ImageEditJob = z.infer<typeof imageEditJobSchema>;

/**
 * One image in the form's in-progress gallery. Keyed by url (already uploaded, always
 * unique) rather than a synthetic id — there's nothing else to key it by until the
 * product itself is saved.
 */
export type ProductFormImage = {
    url: string;
    isMain: boolean;
    width?: number;
    height?: number;
};

/**
 * Product form state. Metadata values are kept as strings while editing — even
 * numbers — because that's what inputs produce; they're converted to their real JSON
 * types only on submit. TextList is held as one comma-separated string for the same
 * reason, and so is `tags`, which uses the identical convention. Booleans are the
 * exception, since a checkbox already gives a real boolean.
 */
export type ProductFormValues = {
    title: string;
    description: string;
    price: string;
    compareAtPrice: string;
    categoryId: string;
    images: ProductFormImage[];
    sku: string;
    stockQuantity: string;
    tags: string;
    /** yyyy-MM-dd, matching <input type="date">. Empty string means no deadline. */
    saleEndsAt: string;
    metadata: Record<string, string | boolean>;
};

export type ProductDraft = z.infer<typeof productDraftSchema>;
export type ProductDraftMessage = z.infer<typeof productDraftMessageSchema>;
export type ProductDraftStatus = z.infer<typeof productDraftStatusSchema>;
export type ProductDraftProduct = z.infer<typeof productDraftProductSchema>;

export type ProductSortField = "CreatedAt" | "Title" | "Price";

export type ProductsQueryParams = PagedQuery & {
    search?: string;
    category?: string;
    sortBy: ProductSortField;
    sortDescending: boolean;
};
