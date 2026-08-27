import useDashboardUsers from "./data/useDashboardUsers";
import useUsersTableState from "./ui/useUsersTableState";
import useRevokeConfirmation from "./ui/useRevokeConfirmation";

const useAdminUsersPage = () => {
    const usersTable = useUsersTableState();

    const {
        data: usersPage,
        isLoading: usersLoading,
        isFetching: usersFetching,
        isError: usersError,
    } = useDashboardUsers(usersTable.query);

    const revokeConfirmation = useRevokeConfirmation();

    return {
        usersPage,
        usersLoading,
        usersFetching,
        usersError,
        usersTable,
        revokeConfirmation,
    };
};

export default useAdminUsersPage;
