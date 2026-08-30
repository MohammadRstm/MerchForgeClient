import "./BusinessOwnerDashboard.css";
import useOwnerSettingsPage from "./hooks/useOwnerSettingsPage";
import MembersTable from "./components/MembersTable";
import SubscriptionCard from "./components/SubscriptionCard";
import FeaturesCard from "./components/FeaturesCard";
import FeatureCreditsModal from "./components/FeatureCreditsModal";
import MemberModal from "./components/MemberModal";
import MemberCredentialsModal from "./components/MemberCredentialsModal";
import ThemeToggle from "./components/ThemeToggle";

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
    } = useOwnerSettingsPage();

    return (
        <main className="business-dashboard-page">
            <div className="business-dashboard-page-header">
                <h1 className="business-dashboard-heading">Settings</h1>
            </div>

            <ThemeToggle />

            <SubscriptionCard
                subscription={subscription}
                isLoading={subscriptionLoading}
                isError={subscriptionError}
            />

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
