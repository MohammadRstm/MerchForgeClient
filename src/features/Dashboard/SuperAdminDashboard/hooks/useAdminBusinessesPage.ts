import useDashboardBusinesses from "./data/useDashboardBusinesses";
import useBusinessesTableState from "./ui/useBusinessesTableState";

const useAdminBusinessesPage = () => {
    const businessesTable = useBusinessesTableState();

    const {
        data: businessesPage,
        isLoading: businessesLoading,
        isFetching: businessesFetching,
        isError: businessesError,
    } = useDashboardBusinesses(businessesTable.query);

    return {
        businessesPage,
        businessesLoading,
        businessesFetching,
        businessesError,
        businessesTable,
    };
};

export default useAdminBusinessesPage;
