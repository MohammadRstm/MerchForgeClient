import useDashboardWebsiteTemplateRequests from "./data/useDashboardWebsiteTemplateRequests";
import useWebsiteTemplateRequestsTableState from "./ui/useWebsiteTemplateRequestsTableState";
import useWebsiteTemplateRequestDetailModal from "./ui/useWebsiteTemplateRequestDetailModal";

const useAdminWebsiteRequestsPage = () => {
    const websiteTemplateRequestsTable = useWebsiteTemplateRequestsTableState();

    const {
        data: websiteTemplateRequestsPage,
        isLoading: websiteTemplateRequestsLoading,
        isFetching: websiteTemplateRequestsFetching,
        isError: websiteTemplateRequestsError,
    } = useDashboardWebsiteTemplateRequests(websiteTemplateRequestsTable.query);

    const websiteTemplateRequestDetailModal = useWebsiteTemplateRequestDetailModal();

    return {
        websiteTemplateRequestsPage,
        websiteTemplateRequestsLoading,
        websiteTemplateRequestsFetching,
        websiteTemplateRequestsError,
        websiteTemplateRequestsTable,
        websiteTemplateRequestDetailModal,
    };
};

export default useAdminWebsiteRequestsPage;
