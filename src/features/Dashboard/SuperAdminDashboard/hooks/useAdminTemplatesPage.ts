import { useState } from "react";
import useDashboardWebsiteTemplates from "./data/useDashboardWebsiteTemplates";
import useTemplateStats from "./data/useTemplateStats";
import useDomainTemplateSummary from "./data/useDomainTemplateSummary";
import useRequestedTemplates from "./data/useRequestedTemplates";
import useTemplateRequestTrend from "./data/useTemplateRequestTrend";
import useTemplatesGridState from "./ui/useTemplatesGridState";
import useCreateWebsiteTemplateForm from "./ui/useCreateWebsiteTemplateForm";
import useWebsiteTemplateDetailModal from "./ui/useWebsiteTemplateDetailModal";

const useAdminTemplatesPage = () => {
    const gridState = useTemplatesGridState();
    const {
        data: templatesPage,
        isLoading: templatesLoading,
        isFetching: templatesFetching,
        isError: templatesError,
    } = useDashboardWebsiteTemplates(gridState.query);

    const { data: stats, isLoading: statsLoading, isError: statsError } = useTemplateStats();

    const {
        data: domainSummary,
        isLoading: domainSummaryLoading,
        isError: domainSummaryError,
    } = useDomainTemplateSummary();

    const {
        data: requestedTemplates,
        isLoading: requestedTemplatesLoading,
        isError: requestedTemplatesError,
    } = useRequestedTemplates();

    const [trendDays, setTrendDays] = useState(30);
    const {
        data: requestTrend,
        isLoading: requestTrendLoading,
        isError: requestTrendError,
    } = useTemplateRequestTrend(trendDays);

    const createTemplateForm = useCreateWebsiteTemplateForm();
    const websiteTemplateDetailModal = useWebsiteTemplateDetailModal();

    return {
        templatesPage,
        templatesLoading,
        templatesFetching,
        templatesError,
        gridState,

        stats,
        statsLoading,
        statsError,

        domainSummary,
        domainSummaryLoading,
        domainSummaryError,

        requestedTemplates,
        requestedTemplatesLoading,
        requestedTemplatesError,

        requestTrend,
        requestTrendLoading,
        requestTrendError,
        trendDays,
        setTrendDays,

        createTemplateForm,
        websiteTemplateDetailModal,
    };
};

export default useAdminTemplatesPage;
