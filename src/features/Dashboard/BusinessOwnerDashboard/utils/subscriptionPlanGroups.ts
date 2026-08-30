import type { SubscriptionPlanDetailResponse } from "../../SuperAdminDashboard/types";

export type PlanTierGroup = {
    name: string;
    monthly?: SubscriptionPlanDetailResponse;
    yearly?: SubscriptionPlanDetailResponse;
};

/** Pairs the flat 6-plan list (3 tiers x Monthly/Yearly) into one group per tier, in first-seen order — matches the seed data's Starter/Growth/Pro ordering without hardcoding names. */
export const groupPlansByTier = (plans: SubscriptionPlanDetailResponse[]): PlanTierGroup[] => {
    const order: string[] = [];
    const byName = new Map<string, PlanTierGroup>();

    for (const plan of plans) {
        if (!byName.has(plan.name)) {
            byName.set(plan.name, { name: plan.name });
            order.push(plan.name);
        }

        const group = byName.get(plan.name)!;
        if (plan.billingInterval === "Monthly") {
            group.monthly = plan;
        } else if (plan.billingInterval === "Yearly") {
            group.yearly = plan;
        }
    }

    return order.map((name) => byName.get(name)!);
};

export type YearlySavings = { amount: number; percent: number };

/** Only returns a result when the yearly price is actually cheaper than 12 months at the monthly rate — never a fabricated or assumed discount. */
export const calculateYearlySavings = (monthlyPrice: number, yearlyPrice: number): YearlySavings | null => {
    const monthlyTotal = monthlyPrice * 12;
    const amount = monthlyTotal - yearlyPrice;

    if (monthlyTotal <= 0 || amount <= 0) {
        return null;
    }

    return { amount, percent: (amount / monthlyTotal) * 100 };
};
