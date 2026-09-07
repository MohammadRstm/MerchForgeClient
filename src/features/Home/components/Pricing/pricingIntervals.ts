/**
 * The arithmetic behind the pricing table's billing-interval switch.
 *
 * Pulled out of the component because it is the part that can be wrong without
 * looking wrong: a saving is a percentage a merchant will plan against, and the
 * inputs come from a catalogue an admin edits, so a tier can legitimately be
 * priced at zero or have no yearly counterpart at all.
 *
 * Structurally typed rather than tied to SubscriptionPlanDetailResponse, so a
 * test can express a case in four fields instead of reconstructing an API
 * payload, and so this says exactly which fields it depends on.
 */

export type Interval = 'Monthly' | 'Yearly';

export interface PricedPlan {
    id: string;
    name: string;
    price: number;
    currency: string;
    billingInterval: string;
}

export interface PlanIntervals<T extends PricedPlan> {
    /** Canonical order and tier names. */
    monthlyPlans: T[];
    yearlyByName: Map<string, T>;
    /** Largest genuine saving across the catalogue, already a whole percentage. */
    bestSaving: number;
}

export function summarisePlans<T extends PricedPlan>(all: readonly T[] | undefined): PlanIntervals<T> {
    const monthlyPlans = (all ?? []).filter((plan) => plan.billingInterval === 'Monthly');
    const yearlyByName = new Map(
        (all ?? []).filter((plan) => plan.billingInterval === 'Yearly').map((plan) => [plan.name, plan]),
    );

    let best = 0;

    for (const plan of monthlyPlans) {
        const counterpart = yearlyByName.get(plan.name);

        // A free tier has nothing to save against, and dividing by it would put
        // Infinity on the page.
        if (!counterpart || plan.price <= 0) continue;

        const saving = 1 - counterpart.price / (plan.price * 12);
        if (saving > best) best = saving;
    }

    return { monthlyPlans, yearlyByName, bestSaving: Math.round(best * 100) };
}

export interface ResolvedPrice<T extends PricedPlan> {
    /** The plan the call-to-action should point at. */
    source: T;
    perMonth: number;
    /** Whole percent, 0 when there is nothing honest to claim. */
    saving: number;
    /** False when yearly was asked for but this tier has no yearly price. */
    showYearly: boolean;
}

export function resolvePrice<T extends PricedPlan>(
    monthly: T,
    yearly: T | undefined,
    interval: Interval,
): ResolvedPrice<T> {
    // Falling back rather than blanking: a half-configured catalogue should still
    // show a real, payable price instead of an empty column.
    const showYearly = interval === 'Yearly' && Boolean(yearly);

    if (!showYearly || !yearly) {
        return { source: monthly, perMonth: monthly.price, saving: 0, showYearly: false };
    }

    const saving = monthly.price > 0 ? Math.round((1 - yearly.price / (monthly.price * 12)) * 100) : 0;

    return {
        source: yearly,
        perMonth: yearly.price / 12,
        // A yearly price above twelve monthlies is a catalogue mistake, not a
        // negative discount to advertise.
        saving: saving > 0 ? saving : 0,
        showYearly: true,
    };
}
