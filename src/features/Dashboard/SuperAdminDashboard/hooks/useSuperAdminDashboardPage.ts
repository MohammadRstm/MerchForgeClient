import useDashboardStats from "./data/useDashboardStats";
import useDashboardUsers from "./data/useDashboardUsers";
import useDashboardBusinesses from "./data/useDashboardBusinesses";
import useUsersTableState from "./ui/useUsersTableState";
import useBusinessesTableState from "./ui/useBusinessesTableState";
import useRevokeConfirmation from "./ui/useRevokeConfirmation";

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

    const revokeConfirmation = useRevokeConfirmation();

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

        revokeConfirmation,
    };
};

export default useSuperAdminDashboardPage;
