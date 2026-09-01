import "./SuperAdminDashboard.css";
import "../BusinessOwnerDashboard/BusinessOwnerDashboard.css";
import useAdminTemplatesPage from "./hooks/useAdminTemplatesPage";
import TemplatesGrid from "./components/TemplatesGrid";
import CreateWebsiteTemplateModal from "./components/CreateWebsiteTemplateModal";
import WebsiteTemplateDetailModal from "./components/WebsiteTemplateDetailModal";
import TemplateKpis from "./components/TemplateKpis";
import TemplateUsageChart from "./components/TemplateUsageChart";
import RequestedTemplatesPanel from "./components/RequestedTemplatesPanel";
import TemplateDomainSummary from "./components/TemplateDomainSummary";
import TemplateRequestTrendChart from "./components/TemplateRequestTrendChart";

const AdminTemplatesPage = () => {
    const {
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
    } = useAdminTemplatesPage();

    return (
        <main className="dashboard-page">
            <div className="dashboard-page-header">
                <div>
                    <h1 className="dashboard-heading">Templates</h1>
                    <p className="dashboard-subheading">
                        Manage storefront templates, preview designs, and monitor template usage across MerchForge.
                    </p>
                </div>
            </div>

            <TemplateKpis stats={stats} isLoading={statsLoading} isError={statsError} />

            <div className="business-detail-two-col">
                <TemplateUsageChart
                    templates={templatesPage?.items ?? []}
                    isLoading={templatesLoading}
                    isError={templatesError}
                    onSelectTemplate={websiteTemplateDetailModal.open}
                />
                <RequestedTemplatesPanel
                    data={requestedTemplates}
                    isLoading={requestedTemplatesLoading}
                    isError={requestedTemplatesError}
                />
            </div>

            <div className="business-detail-two-col">
                <TemplateRequestTrendChart
                    points={requestTrend}
                    isLoading={requestTrendLoading}
                    isError={requestTrendError}
                    days={trendDays}
                    onDaysChange={setTrendDays}
                />
                <TemplateDomainSummary
                    data={domainSummary}
                    isLoading={domainSummaryLoading}
                    isError={domainSummaryError}
                />
            </div>

            <TemplatesGrid
                templatesPage={templatesPage}
                isLoading={templatesLoading}
                isFetching={templatesFetching}
                isError={templatesError}
                gridState={gridState}
                onAdd={createTemplateForm.open}
                onOpenTemplate={websiteTemplateDetailModal.open}
            />

            <CreateWebsiteTemplateModal form={createTemplateForm} />

            <WebsiteTemplateDetailModal modal={websiteTemplateDetailModal} />
        </main>
    );
};

export default AdminTemplatesPage;
