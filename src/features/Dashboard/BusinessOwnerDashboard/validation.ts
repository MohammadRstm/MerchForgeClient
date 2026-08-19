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

export const businessDashboardStatsResponseSchema = z.object({
    businessId: z.string().uuid(),
    businessName: z.string(),
    createdAt: z.iso.datetime(),

    memberCount: z.number(),
    productCount: z.number(),
    productDraftCount: z.number(),

    averageProductPrice: z.number().nullable(),
    minProductPrice: z.number().nullable(),
    maxProductPrice: z.number().nullable(),

    productsByCategory: z.array(keyCountSchema),
    productDraftsByStatus: z.array(keyCountSchema),
    membersByRole: z.array(keyCountSchema),

    productsOverTime: z.array(timeSeriesPointSchema),
});

export const businessProductResponseSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    category: z.string(),
    price: z.number(),
    imageUrl: z.string().nullable(),
    createdAt: z.iso.datetime(),
});

export const businessProductsPageSchema = pagedResultSchema(businessProductResponseSchema);

export const businessMemberResponseSchema = z.object({
    userId: z.string().uuid(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    role: z.string(),
    joinedAt: z.iso.datetime(),
});

export const planFeatureItemSchema = z.object({
    featureKey: z.string(),
    featureName: z.string(),
    limit: z.number().nullable(),
});

export const businessSubscriptionResponseSchema = z
    .object({
        id: z.string().uuid(),
        planName: z.string(),
        price: z.number(),
        currency: z.string(),
        billingInterval: z.string(),
        status: z.string(),
        currentPeriodStart: z.iso.datetime(),
        currentPeriodEnd: z.iso.datetime(),
        features: z.array(planFeatureItemSchema),
    })
    .nullable();
