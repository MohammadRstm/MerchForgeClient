import useDashboardCustomers from "./data/useDashboardCustomers";
import useCustomersTableState from "./ui/useCustomersTableState";

const useAdminCustomersPage = () => {
    const customersTable = useCustomersTableState();

    const {
        data: customersPage,
        isLoading: customersLoading,
        isFetching: customersFetching,
        isError: customersError,
    } = useDashboardCustomers(customersTable.query);

    return {
        customersPage,
        customersLoading,
        customersFetching,
        customersError,
        customersTable,
    };
};

export default useAdminCustomersPage;
