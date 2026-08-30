import { forwardRef } from "react";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { calculateYearlySavings, type PlanTierGroup } from "../utils/subscriptionPlanGroups";
import type { BusinessSubscriptionResponse } from "../types";
import type { SubscriptionPlanDetailResponse } from "../../SuperAdminDashboard/types";

const currencyFormatter = (currency: string) => new Intl.NumberFormat(undefined, { style: "currency", currency });

const actionLabel = (
    plan: SubscriptionPlanDetailResponse,
    subscription: BusinessSubscriptionResponse | null | undefined,
    isActive: boolean
) => {
    if (!isActive || !subscription) return "Subscribe";
    if (plan.billingInterval !== subscription.billingInterval) return "Switch to this plan";
    if (plan.price > subscription.price) return `Upgrade to ${plan.name}`;
    if (plan.price < subscription.price) return `Downgrade to ${plan.name}`;
    return "Switch to this plan";
};

type PlansSectionProps = {
    tierGroups: PlanTierGroup[];
    isLoading: boolean;
    isError: boolean;
    selectedInterval: "Monthly" | "Yearly";
    onSelectInterval: (interval: "Monthly" | "Yearly") => void;
    subscription?: BusinessSubscriptionResponse | null;
    isActive: boolean;
    isCurrentPlan: (planId: string) => boolean;
    preselectedPlanId?: string;
    onSelectPlan: (plan: SubscriptionPlanDetailResponse) => void;
};

/** Redesigned plan grid — a Monthly/Yearly toggle over 3 cards (one per tier) instead of 6 cards at once, with the real max yearly saving surfaced on the toggle itself. */
const PlansSection = forwardRef<HTMLDivElement, PlansSectionProps>(
    (
        {
            tierGroups,
            isLoading,
            isError,
            selectedInterval,
            onSelectInterval,
            subscription,
            isActive,
            isCurrentPlan,
            preselectedPlanId,
            onSelectPlan,
        },
        ref
    ) => {
        const maxSavingsPercent = tierGroups.reduce((max, group) => {
            if (!group.monthly || !group.yearly) return max;
            const savings = calculateYearlySavings(group.monthly.price, group.yearly.price);
            return savings ? Math.max(max, savings.percent) : max;
        }, 0);

        return (
            <section className="business-dashboard-table-card" ref={ref}>
                <div className="analytics-header">
                    <h3>Available Plans</h3>

                    <div className="analytics-range-selector">
                        <button
                            type="button"
                            className={`analytics-range-btn${selectedInterval === "Monthly" ? " analytics-range-btn--active" : ""}`}
                            onClick={() => onSelectInterval("Monthly")}
                        >
                            Monthly
                        </button>
                        <button
                            type="button"
                            className={`analytics-range-btn${selectedInterval === "Yearly" ? " analytics-range-btn--active" : ""}`}
                            onClick={() => onSelectInterval("Yearly")}
                        >
                            Yearly
                            {maxSavingsPercent > 0 && (
                                <span className="plan-toggle-savings"> · Save up to {maxSavingsPercent.toFixed(0)}%</span>
                            )}
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="business-dashboard-table-loading">
                        <Spinner size={28} />
                    </div>
                ) : isError ? (
                    <p className="business-dashboard-table-message business-dashboard-table-message--error">
                        Failed to load plans. Please try again.
                    </p>
                ) : (
                    <div className="business-dashboard-plans-grid">
                        {tierGroups.map((group) => {
                            const plan = selectedInterval === "Monthly" ? group.monthly : group.yearly;
                            if (!plan) return null;

                            const current = isCurrentPlan(plan.id);
                            const wasPreselected = preselectedPlanId === plan.id;
                            const yearlySavings =
                                selectedInterval === "Yearly" && group.monthly && group.yearly
                                    ? calculateYearlySavings(group.monthly.price, group.yearly.price)
                                    : null;

                            return (
                                <article
                                    key={plan.id}
                                    className={`business-dashboard-plan-card${current ? " business-dashboard-plan-card--current" : ""}${wasPreselected ? " business-dashboard-plan-card--preselected" : ""}`}
                                >
                                    <div className="business-dashboard-subscription-header">
                                        <div>
                                            <span className="business-dashboard-subscription-plan">{plan.name}</span>
                                            <span className="business-dashboard-subscription-price">
                                                {currencyFormatter(plan.currency).format(plan.price)} /{" "}
                                                {plan.billingInterval.toLowerCase()}
                                            </span>
                                        </div>
                                        {current && (
                                            <span className="business-dashboard-badge business-dashboard-badge--status-active">
                                                Current plan
                                            </span>
                                        )}
                                    </div>

                                    {plan.description && <p className="business-dashboard-form-hint">{plan.description}</p>}

                                    {yearlySavings && (
                                        <span className="plan-card-savings">
                                            Save {currencyFormatter(plan.currency).format(yearlySavings.amount)}/year vs. monthly
                                        </span>
                                    )}

                                    {plan.features.length > 0 && (
                                        <ul className="business-dashboard-subscription-features">
                                            {plan.features.map((feature) => (
                                                <li key={feature.featureKey}>
                                                    {feature.featureName}
                                                    <span className="business-dashboard-subscription-feature-limit">
                                                        {" "}
                                                        ({feature.limit != null ? `up to ${feature.limit}/period` : "unlimited"})
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {current ? (
                                        <button type="button" className="business-dashboard-button-secondary" disabled>
                                            Current Plan
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="business-dashboard-button-primary"
                                            onClick={() => onSelectPlan(plan)}
                                        >
                                            {actionLabel(plan, subscription, isActive)}
                                        </button>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        );
    }
);

PlansSection.displayName = "PlansSection";

export default PlansSection;
