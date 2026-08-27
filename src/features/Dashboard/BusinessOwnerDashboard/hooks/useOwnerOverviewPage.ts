import useAuth from "../../../../context/Auth/useAuth";
import useBusinessDashboardStats from "./data/useBusinessDashboardStats";
import useWebsiteTemplateOptions from "./data/useWebsiteTemplateOptions";

const TERMINAL_DRAFT_STATUSES = new Set(["Completed", "Cancelled", "Failed"]);

const useOwnerOverviewPage = () => {
    const { session } = useAuth();
    const businessId = session?.business?.id ?? "";

    const {
        data: stats,
        isLoading: statsLoading,
        isError: statsError,
    } = useBusinessDashboardStats(businessId);

    const {
        data: websiteTemplateOptions,
        isLoading: websiteTemplateOptionsLoading,
    } = useWebsiteTemplateOptions(businessId);

    // In-progress AI product drafts are the closest thing to a "needs attention"
    // signal the current data model offers for products (see plan §2: real
    // Product rows have no draft/published status at all).
    const inProgressDraftCount = stats
        ? stats.productDraftsByStatus
              .filter((entry) => !TERMINAL_DRAFT_STATUSES.has(entry.key))
              .reduce((sum, entry) => sum + entry.count, 0)
        : 0;

    return {
        businessName: session?.business?.name ?? "",

        stats,
        statsLoading,
        statsError,

        websiteTemplateOptions,
        websiteTemplateOptionsLoading,

        inProgressDraftCount,
    };
};

export default useOwnerOverviewPage;
