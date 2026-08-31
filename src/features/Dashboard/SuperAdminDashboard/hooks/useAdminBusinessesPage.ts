import useDashboardBusinesses from "./data/useDashboardBusinesses";
import useDashboardStats from "./data/useDashboardStats";
import useBusinessesTableState from "./ui/useBusinessesTableState";

const useAdminBusinessesPage = () => {
    const businessesTable = useBusinessesTableState();

    const {
        data: businessesPage,
        isLoading: businessesLoading,
        isFetching: businessesFetching,
        isError: businessesError,
    } = useDashboardBusinesses(businessesTable.query);

    const {
        data: stats,
        isLoading: statsLoading,
        isError: statsError,
    } = useDashboardStats();

    return {
        businessesPage,
        businessesLoading,
        businessesFetching,
        businessesError,
        businessesTable,
        stats,
        statsLoading,
        statsError,
    };
};

export default useAdminBusinessesPage;
