import useDashboardStats from "./data/useDashboardStats";
import useDashboardUsers from "./data/useDashboardUsers";
import useDashboardBusinesses from "./data/useDashboardBusinesses";
import useDashboardWebsiteTemplates from "./data/useDashboardWebsiteTemplates";
import useDashboardWebsiteTemplateRequests from "./data/useDashboardWebsiteTemplateRequests";
import useUsersTableState from "./ui/useUsersTableState";
import useBusinessesTableState from "./ui/useBusinessesTableState";
import useWebsiteTemplateRequestsTableState from "./ui/useWebsiteTemplateRequestsTableState";
import useRevokeConfirmation from "./ui/useRevokeConfirmation";
import useInviteBusinessOwnerForm from "./ui/useInviteBusinessOwnerForm";
import useCreateWebsiteTemplateForm from "./ui/useCreateWebsiteTemplateForm";
import useWebsiteTemplateRequestDetailModal from "./ui/useWebsiteTemplateRequestDetailModal";

const useSuperAdminDashboardPage = () => {
    const {
        data: stats,
        isLoading: statsLoading,
        isError: statsError,
    } = useDashboardStats();

    const usersTable = useUsersTableState();
    const businessesTable = useBusinessesTableState();

    const {
        data: usersPage,
        isLoading: usersLoading,
        isFetching: usersFetching,
        isError: usersError,
    } = useDashboardUsers(usersTable.query);

    const {
        data: businessesPage,
        isLoading: businessesLoading,
        isFetching: businessesFetching,
        isError: businessesError,
    } = useDashboardBusinesses(businessesTable.query);

    const {
        data: websiteTemplates,
        isLoading: websiteTemplatesLoading,
        isError: websiteTemplatesError,
    } = useDashboardWebsiteTemplates();

    const websiteTemplateRequestsTable = useWebsiteTemplateRequestsTableState();

    const {
        data: websiteTemplateRequestsPage,
        isLoading: websiteTemplateRequestsLoading,
        isFetching: websiteTemplateRequestsFetching,
        isError: websiteTemplateRequestsError,
    } = useDashboardWebsiteTemplateRequests(websiteTemplateRequestsTable.query);

    const revokeConfirmation = useRevokeConfirmation();
    const inviteForm = useInviteBusinessOwnerForm();
    const createTemplateForm = useCreateWebsiteTemplateForm();
    const websiteTemplateRequestDetailModal = useWebsiteTemplateRequestDetailModal();

    return {
        stats,
        statsLoading,
        statsError,

        usersPage,
        usersLoading,
        usersFetching,
        usersError,
        usersTable,

        businessesPage,
        businessesLoading,
        businessesFetching,
        businessesError,
        businessesTable,

        websiteTemplates,
        websiteTemplatesLoading,
        websiteTemplatesError,

        websiteTemplateRequestsPage,
        websiteTemplateRequestsLoading,
        websiteTemplateRequestsFetching,
        websiteTemplateRequestsError,
        websiteTemplateRequestsTable,

        revokeConfirmation,
        inviteForm,
        createTemplateForm,
        websiteTemplateRequestDetailModal,
    };
};

export default useSuperAdminDashboardPage;
