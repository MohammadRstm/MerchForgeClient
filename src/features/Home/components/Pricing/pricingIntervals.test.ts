import { describe, expect, it } from 'vitest';
import { resolvePrice, summarisePlans, type PricedPlan } from './pricingIntervals';

const plan = (name: string, billingInterval: string, price: number): PricedPlan => ({
    id: `${name}-${billingInterval}`.toLowerCase(),
    name,
    price,
    currency: 'USD',
    billingInterval,
});

describe('summarisePlans', () => {
    it('keeps monthly as the canonical list and indexes yearly by tier name', () => {
        const result = summarisePlans([
            plan('Growth', 'Monthly', 40),
            plan('Starter', 'Monthly', 10),
            plan('Growth', 'Yearly', 400),
        ]);

        expect(result.monthlyPlans.map((p) => p.name)).toEqual(['Growth', 'Starter']);
        expect(result.yearlyByName.get('Growth')?.price).toBe(400);
        expect(result.yearlyByName.has('Starter')).toBe(false);
    });

    it('reports the largest genuine saving across the catalogue', () => {
        // Starter saves 2/120; Growth saves 80/480, which is the one to advertise.
        const result = summarisePlans([
            plan('Starter', 'Monthly', 10),
            plan('Starter', 'Yearly', 118),
            plan('Growth', 'Monthly', 40),
            plan('Growth', 'Yearly', 400),
        ]);

        expect(result.bestSaving).toBe(17);
    });

    /**
     * A free tier is a real thing an admin can create, and dividing by its price
     * would put Infinity on a public page.
     */
    it('ignores a tier priced at zero rather than dividing by it', () => {
        const result = summarisePlans([
            plan('Free', 'Monthly', 0),
            plan('Free', 'Yearly', 0),
        ]);

        expect(result.bestSaving).toBe(0);
        expect(Number.isFinite(result.bestSaving)).toBe(true);
    });

    it('survives an empty or absent catalogue', () => {
        expect(summarisePlans(undefined).monthlyPlans).toEqual([]);
        expect(summarisePlans([]).bestSaving).toBe(0);
    });
});

describe('resolvePrice', () => {
    it('shows the monthly price and no saving on the monthly interval', () => {
        const monthly = plan('Growth', 'Monthly', 40);
        const result = resolvePrice(monthly, plan('Growth', 'Yearly', 400), 'Monthly');

        expect(result.perMonth).toBe(40);
        expect(result.saving).toBe(0);
        expect(result.showYearly).toBe(false);
        expect(result.source).toBe(monthly);
    });

    it('divides the yearly price across twelve months and reports the saving', () => {
        const yearly = plan('Growth', 'Yearly', 400);
        const result = resolvePrice(plan('Growth', 'Monthly', 40), yearly, 'Yearly');

        expect(result.perMonth).toBeCloseTo(33.33, 1);
        expect(result.saving).toBe(17);
        expect(result.showYearly).toBe(true);
        // The call to action has to point at the plan actually being bought.
        expect(result.source).toBe(yearly);
    });

    /**
     * A partially configured catalogue is the normal state while an admin is
     * still filling it in. That tier should keep showing a payable price.
     */
    it('falls back to monthly when a tier has no yearly counterpart', () => {
        const monthly = plan('Starter', 'Monthly', 10);
        const result = resolvePrice(monthly, undefined, 'Yearly');

        expect(result.perMonth).toBe(10);
        expect(result.showYearly).toBe(false);
        expect(result.source).toBe(monthly);
    });

    it('never advertises a negative saving when yearly costs more than twelve monthlies', () => {
        const result = resolvePrice(plan('Odd', 'Monthly', 10), plan('Odd', 'Yearly', 200), 'Yearly');

        expect(result.saving).toBe(0);
        expect(result.perMonth).toBeCloseTo(16.67, 1);
    });

    it('reports no saving for a free tier instead of dividing by zero', () => {
        const result = resolvePrice(plan('Free', 'Monthly', 0), plan('Free', 'Yearly', 0), 'Yearly');

        expect(result.saving).toBe(0);
        expect(Number.isFinite(result.perMonth)).toBe(true);
    });
});
