import { useRef } from "react";
import "./BusinessOwnerDashboard.css";
import useOwnerBillingPage from "./hooks/useOwnerBillingPage";
import CurrentPlanHero from "./components/CurrentPlanHero";
import UsageLimitsSection from "./components/UsageLimitsSection";
import PlansSection from "./components/PlansSection";
import FeatureComparisonTable from "./components/FeatureComparisonTable";
import PaymentBillingSection from "./components/PaymentBillingSection";
import SubscriptionActivitySection from "./components/SubscriptionActivitySection";
import PlanChangeConfirmModal from "./components/PlanChangeConfirmModal";
import CancelSubscriptionModal from "./components/CancelSubscriptionModal";

const OwnerBillingPage = () => {
    const {
        preselectedPlanId,

        plansLoading,
        plansError,
        tierGroups,

        subscription,
        subscriptionLoading,
        subscriptionError,
        isActive,
        yearlyUpgradePlan,
        switchSavings,

        selectedInterval,
        setSelectedInterval,
        isCurrentPlan,

        stats,

        aiCreditsUsage,
        aiCreditsWarning,
        featuresLoading,
        featuresError,

        history,
        historyLoading,
        historyError,

        pendingPlan,
        requestPlanChange,
        cancelPlanChange,
        confirmPlanChange,
        isSubscribing,

        confirmingCancel,
        requestCancel,
        cancelCancel,
        confirmCancel,
        isCancelling,
    } = useOwnerBillingPage();

    const plansRef = useRef<HTMLDivElement>(null);
    const scrollToPlans = () => plansRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    return (
        <main className="business-dashboard-page">
            <div className="business-dashboard-page-header">
                <div>
                    <h1 className="business-dashboard-heading">Billing &amp; Subscription</h1>
                    <p className="business-dashboard-page-subtitle">Manage your MerchForge plan, usage, and subscription.</p>
                </div>
            </div>

            <CurrentPlanHero
                subscription={subscription}
                isLoading={subscriptionLoading}
                isError={subscriptionError}
                yearlyUpgradePlan={yearlyUpgradePlan}
                switchSavings={switchSavings}
                onViewPlans={scrollToPlans}
                onSwitchInterval={requestPlanChange}
                onCancel={requestCancel}
            />

            <UsageLimitsSection
                aiCreditsUsage={aiCreditsUsage}
                aiCreditsWarning={aiCreditsWarning}
                isLoading={featuresLoading}
                isError={featuresError}
                hasSubscription={isActive}
                productCount={stats?.productCount}
                orderCount={stats?.orderCount}
                onUpgrade={scrollToPlans}
            />

            <PlansSection
                ref={plansRef}
                tierGroups={tierGroups}
                isLoading={plansLoading}
                isError={plansError}
                selectedInterval={selectedInterval}
                onSelectInterval={setSelectedInterval}
                subscription={subscription}
                isActive={isActive}
                isCurrentPlan={isCurrentPlan}
                preselectedPlanId={preselectedPlanId}
                onSelectPlan={requestPlanChange}
            />

            <FeatureComparisonTable tierGroups={tierGroups} selectedInterval={selectedInterval} />

            <PaymentBillingSection />

            <SubscriptionActivitySection history={history} isLoading={historyLoading} isError={historyError} />

            <PlanChangeConfirmModal
                plan={pendingPlan}
                currentSubscription={subscription}
                isSubmitting={isSubscribing}
                onConfirm={confirmPlanChange}
                onCancel={cancelPlanChange}
            />

            <CancelSubscriptionModal
                isOpen={confirmingCancel}
                subscription={subscription}
                isSubmitting={isCancelling}
                onConfirm={confirmCancel}
                onCancel={cancelCancel}
            />
        </main>
    );
};

export default OwnerBillingPage;
