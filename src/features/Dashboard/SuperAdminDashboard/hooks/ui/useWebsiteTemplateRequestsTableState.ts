import { useState } from "react";
import { INITIAL_WEBSITE_TEMPLATE_REQUESTS_QUERY } from "../../constants";
import type { WebsiteTemplateRequestsQueryParams, WebsiteTemplateRequestStatus } from "../../types";

const useWebsiteTemplateRequestsTableState = () => {
    const [status, setStatus] = useState<WebsiteTemplateRequestStatus | undefined>(undefined);
    const [page, setPage] = useState(INITIAL_WEBSITE_TEMPLATE_REQUESTS_QUERY.page);

    const query: WebsiteTemplateRequestsQueryParams = {
        page,
        pageSize: INITIAL_WEBSITE_TEMPLATE_REQUESTS_QUERY.pageSize,
        status,
        sortDescending: true,
    };

    const handleStatusChange = (value: WebsiteTemplateRequestStatus | "") => {
        setStatus(value === "" ? undefined : value);
        setPage(1);
    };

    return {
        query,
        status,

        handleStatusChange,
        setPage,
    };
};

export default useWebsiteTemplateRequestsTableState;
