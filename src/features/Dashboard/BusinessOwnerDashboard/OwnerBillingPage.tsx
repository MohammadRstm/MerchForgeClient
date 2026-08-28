import "./BusinessOwnerDashboard.css";
import Spinner from "../../../components/LoadingSpinner/LoadingSpinner";
import useOwnerBillingPage from "./hooks/useOwnerBillingPage";

const currencyFormatter = (currency: string) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency });

const OwnerBillingPage = () => {
    const {
        plans,
        plansLoading,
        plansError,
        subscription,
        subscriptionLoading,
        subscriptionError,
        preselectedPlanId,
        subscribe,
        isSubscribing,
        pendingPlanId,
        isCurrentPlan,
        confirmingCancel,
        requestCancel,
        cancelCancel,
        confirmCancel,
        isCancelling,
    } = useOwnerBillingPage();

    const isLoading = plansLoading || subscriptionLoading;
    const isError = plansError || subscriptionError;

    return (
        <main className="business-dashboard-page">
            <div className="business-dashboard-page-header">
                <h1 className="business-dashboard-heading">Billing</h1>
            </div>

            {subscription && subscription.status !== "Active" && (
                <p className="business-dashboard-table-message business-dashboard-table-message--error">
                    Your subscription is {subscription.status.toLowerCase()}. Choose a plan below to reactivate.
                </p>
            )}

            {subscription?.status === "Active" && (
                <section className="business-dashboard-table-card">
                    <div className="business-dashboard-table-header">
                        <h3>Manage subscription</h3>
                    </div>

                    {subscription.cancelAtPeriodEnd ? (
                        <p className="business-dashboard-table-message">
                            Your plan won't renew — you'll keep full access until{" "}
                            {new Date(subscription.currentPeriodEnd).toLocaleDateString()}. Choose a plan above any
                            time to resume.
                        </p>
                    ) : confirmingCancel ? (
                        <div className="business-dashboard-form">
                            <p className="business-dashboard-form-error">
                                Cancel your {subscription.planName} plan? You'll keep full access until{" "}
                                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}, then your website
                                will be taken down.
                            </p>
                            <div className="business-dashboard-header-actions">
                                <button
                                    type="button"
                                    className="business-dashboard-button-secondary"
                                    onClick={cancelCancel}
                                    disabled={isCancelling}
                                >
                                    Keep my plan
                                </button>
                                <button
                                    type="button"
                                    className="business-dashboard-button-primary"
                                    onClick={confirmCancel}
                                    disabled={isCancelling}
                                >
                                    {isCancelling ? "Cancelling..." : "Cancel plan"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="business-dashboard-form-hint">
                                You're on the {subscription.planName} plan, renewing{" "}
                                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
                            </p>
                            <button type="button" className="business-dashboard-button-secondary" onClick={requestCancel}>
                                Cancel plan
                            </button>
                        </>
                    )}
                </section>
            )}

            {isLoading ? (
                <div className="business-dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="business-dashboard-table-message business-dashboard-table-message--error">
                    Failed to load plans. Please try again.
                </p>
            ) : (
                <section className="business-dashboard-table-card">
                    <div className="business-dashboard-table-header">
                        <h3>Available plans</h3>
                    </div>

                    <div className="business-dashboard-plans-grid">
                        {plans?.map((plan) => {
                            const current = isCurrentPlan(plan.id);
                            const isThisPending = isSubscribing && pendingPlanId === plan.id;
                            const wasPreselected = preselectedPlanId === plan.id;

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

                                    {plan.description && (
                                        <p className="business-dashboard-form-hint">{plan.description}</p>
                                    )}

                                    {plan.features.length > 0 && (
                                        <ul className="business-dashboard-subscription-features">
                                            {plan.features.map((feature) => (
                                                <li key={feature.featureKey}>
                                                    {feature.featureName}
                                                    {feature.limit != null && (
                                                        <span className="business-dashboard-subscription-feature-limit">
                                                            {" "}
                                                            (up to {feature.limit})
                                                        </span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    <button
                                        type="button"
                                        className={
                                            current
                                                ? "business-dashboard-button-secondary"
                                                : "business-dashboard-button-primary"
                                        }
                                        onClick={() => subscribe(plan.id)}
                                        disabled={current || isSubscribing}
                                    >
                                        {current
                                            ? "Current plan"
                                            : isThisPending
                                              ? "Switching..."
                                              : subscription
                                                ? "Switch to this plan"
                                                : "Subscribe"}
                                    </button>
                                </article>
                            );
                        })}
                    </div>
                </section>
            )}
        </main>
    );
};

export default OwnerBillingPage;
