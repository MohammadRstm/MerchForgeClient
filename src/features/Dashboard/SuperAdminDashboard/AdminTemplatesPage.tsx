import "./SuperAdminDashboard.css";
import useAdminTemplatesPage from "./hooks/useAdminTemplatesPage";
import WebsiteTemplatesTable from "./components/WebsiteTemplatesTable";
import CreateWebsiteTemplateModal from "./components/CreateWebsiteTemplateModal";
import WebsiteTemplateDetailModal from "./components/WebsiteTemplateDetailModal";

const AdminTemplatesPage = () => {
    const {
        websiteTemplates,
        websiteTemplatesLoading,
        websiteTemplatesError,
        createTemplateForm,
        websiteTemplateDetailModal,
    } = useAdminTemplatesPage();

    return (
        <main className="dashboard-page">
            <div className="dashboard-page-header">
                <h1 className="dashboard-heading">Website Templates</h1>
            </div>

            <WebsiteTemplatesTable
                templates={websiteTemplates}
                isLoading={websiteTemplatesLoading}
                isError={websiteTemplatesError}
                onAdd={createTemplateForm.open}
                onOpen={websiteTemplateDetailModal.open}
            />

            <CreateWebsiteTemplateModal form={createTemplateForm} />

            <WebsiteTemplateDetailModal modal={websiteTemplateDetailModal} />
        </main>
    );
};

export default AdminTemplatesPage;
