import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type { BusinessSubscriptionResponse } from "../types";
import type { SubscriptionPlanDetailResponse } from "../../SuperAdminDashboard/types";
import type { YearlySavings } from "../utils/subscriptionPlanGroups";

const currencyFormatter = (currency: string) => new Intl.NumberFormat(undefined, { style: "currency", currency });

const STATUS_LABEL: Record<string, string> = {
    Active: "Active",
    Trialing: "Trial",
    PastDue: "Past due",
    Cancelled: "Cancelled",
    Expired: "Expired",
};

const STATUS_BADGE_CLASS: Record<string, string> = {
    Active: "business-dashboard-badge--status-active",
    Trialing: "business-dashboard-badge--status-trialing",
    PastDue: "business-dashboard-badge--status-pastdue",
    Cancelled: "business-dashboard-badge--status-cancelled",
    Expired: "business-dashboard-badge--status-expired",
};

type CurrentPlanHeroProps = {
    subscription?: BusinessSubscriptionResponse;
    isLoading: boolean;
    isError: boolean;
    /** Only ever the Yearly plan of the business's own tier — there's no honest savings to advertise going the other direction. */
    yearlyUpgradePlan?: SubscriptionPlanDetailResponse;
    switchSavings: YearlySavings | null;
    onViewPlans: () => void;
    onSwitchInterval: (plan: SubscriptionPlanDetailResponse) => void;
    onCancel: () => void;
};

/** The page's visual centerpiece — current plan, status, renewal, feature checklist, and the one-click yearly/monthly switch suggestion, all from the real subscription response. */
const CurrentPlanHero = ({
    subscription,
    isLoading,
    isError,
    yearlyUpgradePlan,
    switchSavings,
    onViewPlans,
    onSwitchInterval,
    onCancel,
}: CurrentPlanHeroProps) => {
    if (isLoading) {
        return (
            <section className="billing-hero billing-hero--loading">
                <Spinner size={28} />
            </section>
        );
    }

    if (isError) {
        return (
            <section className="billing-hero">
                <p className="business-dashboard-table-message business-dashboard-table-message--error">
                    Unable to load your subscription information.
                </p>
            </section>
        );
    }

    const isActive = subscription?.status === "Active";

    if (!subscription) {
        return (
            <section className="billing-hero billing-hero--empty">
                <span className="billing-hero__eyebrow">Current Plan</span>
                <h2 className="billing-hero__no-plan">No active plan</h2>
                <p className="billing-hero__no-plan-hint">
                    Choose a plan to unlock MerchForge features — your storefront, product tools, and everything below.
                </p>
                <button type="button" className="business-dashboard-button-primary" onClick={onViewPlans}>
                    Choose a plan
                </button>
            </section>
        );
    }

    const statusLabel = STATUS_LABEL[subscription.status] ?? subscription.status;
    const statusBadgeClass = STATUS_BADGE_CLASS[subscription.status] ?? "business-dashboard-badge--status-pastdue";

    return (
        <section className="billing-hero">
            <div className="billing-hero__main">
                <div className="billing-hero__top">
                    <span className="billing-hero__eyebrow">Current Plan</span>
                    <span className={`business-dashboard-badge ${statusBadgeClass}`}>● {statusLabel}</span>
                </div>

                <div className="billing-hero__plan-row">
                    <h2 className="billing-hero__plan-name">{subscription.planName}</h2>
                    <span className="billing-hero__interval-badge">{subscription.billingInterval}</span>
                </div>

                <div className="billing-hero__price">
                    {currencyFormatter(subscription.currency).format(subscription.price)}
                    <span className="billing-hero__price-cadence">
                        / {subscription.billingInterval === "Yearly" ? "year" : "month"}
                    </span>
                </div>

                {isActive && subscription.cancelAtPeriodEnd ? (
                    <p className="billing-hero__renewal billing-hero__renewal--ending">
                        Your plan won't renew — full access continues until{" "}
                        <strong>{new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, { dateStyle: "long" })}</strong>.
                    </p>
                ) : isActive ? (
                    <p className="billing-hero__renewal">
                        Renews on{" "}
                        <strong>{new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, { dateStyle: "long" })}</strong>
                    </p>
                ) : (
                    <p className="billing-hero__renewal billing-hero__renewal--ending">
                        {subscription.status === "Cancelled" ? "Ended" : "Current period ends"}{" "}
                        <strong>{new Date(subscription.currentPeriodEnd).toLocaleDateString(undefined, { dateStyle: "long" })}</strong>
                        {subscription.status !== "Active" && " — choose a plan below to reactivate."}
                    </p>
                )}

                {subscription.features.length > 0 && (
                    <ul className="billing-hero__features">
                        {subscription.features.map((feature) => (
                            <li key={feature.featureKey}>
                                <span className="billing-hero__feature-check" aria-hidden="true">
                                    ✓
                                </span>
                                {feature.featureName}
                                {feature.limit != null && (
                                    <span className="billing-hero__feature-limit"> ({feature.limit}/period)</span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="billing-hero__actions">
                    <button type="button" className="business-dashboard-button-secondary" onClick={onViewPlans}>
                        Manage Plan
                    </button>
                    {isActive && !subscription.cancelAtPeriodEnd && (
                        <button type="button" className="business-dashboard-button-ghost business-dashboard-button-ghost--danger" onClick={onCancel}>
                            Cancel Subscription
                        </button>
                    )}
                </div>
            </div>

            {isActive && !subscription.cancelAtPeriodEnd && yearlyUpgradePlan && switchSavings && (
                <div className="billing-hero__switch">
                    <span className="billing-hero__switch-label">Switch to yearly billing</span>
                    <span className="billing-hero__switch-savings">
                        Save {currencyFormatter(yearlyUpgradePlan.currency).format(switchSavings.amount)}/year (
                        {switchSavings.percent.toFixed(0)}%)
                    </span>
                    <button
                        type="button"
                        className="business-dashboard-button-primary"
                        onClick={() => onSwitchInterval(yearlyUpgradePlan)}
                    >
                        Switch to Yearly
                    </button>
                </div>
            )}
        </section>
    );
};

export default CurrentPlanHero;
