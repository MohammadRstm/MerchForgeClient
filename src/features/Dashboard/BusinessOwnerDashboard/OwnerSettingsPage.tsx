import "./BusinessOwnerDashboard.css";
import useOwnerSettingsPage from "./hooks/useOwnerSettingsPage";
import MembersTable from "./components/MembersTable";
import SubscriptionCard from "./components/SubscriptionCard";
import FeaturesCard from "./components/FeaturesCard";
import FeatureCreditsModal from "./components/FeatureCreditsModal";
import MemberModal from "./components/MemberModal";
import MemberCredentialsModal from "./components/MemberCredentialsModal";

const OwnerSettingsPage = () => {
    const {
        members,
        membersLoading,
        membersError,
        memberModal,

        subscription,
        subscriptionLoading,
        subscriptionError,

        featureCreditsModal,

        confirmingCancel,
        requestCancel,
        cancelCancel,
        confirmCancel,
        isCancelling,
    } = useOwnerSettingsPage();

    return (
        <main className="business-dashboard-page">
            <div className="business-dashboard-page-header">
                <h1 className="business-dashboard-heading">Settings</h1>
            </div>

            <SubscriptionCard
                subscription={subscription}
                isLoading={subscriptionLoading}
                isError={subscriptionError}
            />

            {subscription?.status === "Active" && (
                <section className="business-dashboard-table-card">
                    <div className="business-dashboard-table-header">
                        <h3>Manage subscription</h3>
                    </div>

                    {subscription.cancelAtPeriodEnd ? (
                        <p className="business-dashboard-table-message">
                            Your plan won't renew — you'll keep full access until{" "}
                            {new Date(subscription.currentPeriodEnd).toLocaleDateString()}. Choose a plan on the
                            Billing page any time to resume.
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
                        <button type="button" className="business-dashboard-button-secondary" onClick={requestCancel}>
                            Cancel plan
                        </button>
                    )}
                </section>
            )}

            <FeaturesCard
                features={featureCreditsModal.features}
                isLoading={featureCreditsModal.isLoading}
                isError={featureCreditsModal.isError}
                onSelectFeature={featureCreditsModal.open}
            />

            <MembersTable
                members={members}
                isLoading={membersLoading}
                isError={membersError}
                onAddMember={memberModal.open}
            />

            <MemberModal modal={memberModal} />

            <FeatureCreditsModal modal={featureCreditsModal} />

            <MemberCredentialsModal
                member={memberModal.created}
                onDismiss={memberModal.dismissCreated}
            />
        </main>
    );
};

export default OwnerSettingsPage;
