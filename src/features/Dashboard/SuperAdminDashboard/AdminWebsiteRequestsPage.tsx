import "./SuperAdminDashboard.css";
import useAdminWebsiteRequestsPage from "./hooks/useAdminWebsiteRequestsPage";
import WebsiteTemplateRequestsTable from "./components/WebsiteTemplateRequestsTable";
import WebsiteTemplateRequestDetailModal from "./components/WebsiteTemplateRequestDetailModal";

const AdminWebsiteRequestsPage = () => {
    const {
        websiteTemplateRequestsPage,
        websiteTemplateRequestsLoading,
        websiteTemplateRequestsFetching,
        websiteTemplateRequestsError,
        websiteTemplateRequestsTable,
        websiteTemplateRequestDetailModal,
    } = useAdminWebsiteRequestsPage();

    return (
        <main className="dashboard-page">
            <div className="dashboard-page-header">
                <h1 className="dashboard-heading">Website Requests</h1>
            </div>

            <WebsiteTemplateRequestsTable
                requestsPage={websiteTemplateRequestsPage}
                isLoading={websiteTemplateRequestsLoading}
                isFetching={websiteTemplateRequestsFetching}
                isError={websiteTemplateRequestsError}
                tableState={websiteTemplateRequestsTable}
                onOpen={websiteTemplateRequestDetailModal.open}
            />

            <WebsiteTemplateRequestDetailModal modal={websiteTemplateRequestDetailModal} />
        </main>
    );
};

export default AdminWebsiteRequestsPage;
