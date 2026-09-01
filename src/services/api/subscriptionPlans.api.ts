import z from "zod";
import type { SubscriptionPlanPayload } from "../../features/Dashboard/SuperAdminDashboard/types";
import {
    subscriptionPlanResponseSchema,
    subscriptionPlansResponseSchema,
    subscriptionPlanDetailResponseSchema,
    featuresResponseSchema,
    subscriptionPlanGroupsSchema,
    keyCountSchema,
    planSubscriptionStatsSchema,
} from "../../features/Dashboard/SuperAdminDashboard/validation";
import { authenticatedApi, unAuthenticatedApi } from "./api";
import { apiRoutes } from "./apiRoutes";

export const getSubscriptionPlansService = async () => {
    const { data } = await authenticatedApi.get(apiRoutes.SUBSCRIPTION_PLANS);

    return subscriptionPlansResponseSchema.parse(data);
};

const publicSubscriptionPlansResponseSchema = z.array(subscriptionPlanDetailResponseSchema);

/** No auth — includes each plan's features, for the public landing/billing pages. */
export const getPublicSubscriptionPlansService = async () => {
    const { data } = await unAuthenticatedApi.get(apiRoutes.SUBSCRIPTION_PLANS_PUBLIC);

    return publicSubscriptionPlansResponseSchema.parse(data);
};

export const getSubscriptionPlanFeaturesService = async () => {
    const { data } = await authenticatedApi.get(apiRoutes.SUBSCRIPTION_PLAN_FEATURES);

    return featuresResponseSchema.parse(data);
};

export const getSubscriptionPlanDetailService = async (id: string) => {
    const { data } = await authenticatedApi.get(apiRoutes.SUBSCRIPTION_PLAN(id));

    return subscriptionPlanDetailResponseSchema.parse(data);
};

export const createSubscriptionPlanService = async (payload: SubscriptionPlanPayload) => {
    const { data } = await authenticatedApi.post(apiRoutes.SUBSCRIPTION_PLANS, payload);

    return subscriptionPlanResponseSchema.parse(data);
};

export const updateSubscriptionPlanService = async (id: string, payload: SubscriptionPlanPayload & { isActive: boolean }) => {
    const { data } = await authenticatedApi.put(apiRoutes.SUBSCRIPTION_PLAN(id), payload);

    return subscriptionPlanResponseSchema.parse(data);
};

export const deactivateSubscriptionPlanService = async (id: string) => {
    const { data } = await authenticatedApi.post(apiRoutes.SUBSCRIPTION_PLAN_DEACTIVATE(id));

    return subscriptionPlanResponseSchema.parse(data);
};

export const reactivateSubscriptionPlanService = async (id: string) => {
    const { data } = await authenticatedApi.post(apiRoutes.SUBSCRIPTION_PLAN_REACTIVATE(id));

    return subscriptionPlanResponseSchema.parse(data);
};

export const getSubscriptionPlanGroupsService = async () => {
    const { data } = await authenticatedApi.get(apiRoutes.SUBSCRIPTION_PLAN_GROUPS);

    return subscriptionPlanGroupsSchema.parse(data);
};

const distributionResponseSchema = z.array(keyCountSchema);

export const getSubscriptionPlanDistributionService = async () => {
    const { data } = await authenticatedApi.get(apiRoutes.SUBSCRIPTION_PLAN_DISTRIBUTION);

    return distributionResponseSchema.parse(data);
};

export const getPlanSubscriptionStatsService = async () => {
    const { data } = await authenticatedApi.get(apiRoutes.SUBSCRIPTION_PLAN_STATS);

    return planSubscriptionStatsSchema.parse(data);
};
