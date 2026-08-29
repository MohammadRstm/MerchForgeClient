import useAuth from "../../../../context/Auth/useAuth";
import useBusinessDashboardStats from "./data/useBusinessDashboardStats";
import useBusinessSubscription from "./data/useBusinessSubscription";
import useWebsiteTemplateOptions from "./data/useWebsiteTemplateOptions";
import useWebsiteTemplateRequests from "./data/useWebsiteTemplateRequests";

const useOwnerWebsitePage = () => {
    const { session } = useAuth();
    const businessId = session?.business?.id ?? "";

    const { data: stats } = useBusinessDashboardStats(businessId);
    const { data: subscription } = useBusinessSubscription(businessId);
    const hasActiveSubscription = subscription?.status === "Active";

    const {
        data: websiteTemplateOptions,
        isLoading: websiteTemplateOptionsLoading,
        isError: websiteTemplateOptionsError,
    } = useWebsiteTemplateOptions(businessId);

    const {
        data: requests,
        isLoading: requestsLoading,
        isError: requestsError,
    } = useWebsiteTemplateRequests(businessId);

    return {
        websiteUrl: stats?.websiteUrl ?? null,
        hasActiveSubscription,

        websiteTemplateOptions,
        websiteTemplateOptionsLoading,
        websiteTemplateOptionsError,

        requests,
        requestsLoading,
        requestsError,
    };
};

export default useOwnerWebsitePage;
