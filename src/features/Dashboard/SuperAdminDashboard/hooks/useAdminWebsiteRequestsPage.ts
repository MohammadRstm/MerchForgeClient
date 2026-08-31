import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
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

    // Deep-link support for the Business Detail page's "clicking a request opens
    // its detail" cross-link (?requestId=...) - opens once per navigation, doesn't
    // fight the modal's own open/close state afterward.
    const [searchParams] = useSearchParams();
    const deepLinkedRequestId = searchParams.get("requestId");
    const hasOpenedDeepLink = useRef(false);

    useEffect(() => {
        if (deepLinkedRequestId && !hasOpenedDeepLink.current) {
            hasOpenedDeepLink.current = true;
            websiteTemplateRequestDetailModal.open(deepLinkedRequestId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- open once for the id present on arrival, not on every modal-state change
    }, [deepLinkedRequestId]);

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
