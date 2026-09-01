import { useParams } from "react-router";
import useDashboardCustomerDetail from "./data/useDashboardCustomerDetail";
import useCustomerOrders from "./data/useCustomerOrders";
import useCustomerSpendOverTime from "./data/useCustomerSpendOverTime";
import useCustomerOrdersTableState from "./ui/useCustomerOrdersTableState";
import useEditCustomerModal from "./ui/useEditCustomerModal";
import useRevokeCustomerSessionsModal from "./ui/useRevokeCustomerSessionsModal";

const useAdminCustomerDetailPage = () => {
    const { customerId = "" } = useParams<{ customerId: string }>();

    const { data: customer, isLoading, isError } = useDashboardCustomerDetail(customerId);

    const ordersTable = useCustomerOrdersTableState();
    const {
        data: ordersPage,
        isLoading: ordersLoading,
        isFetching: ordersFetching,
        isError: ordersError,
    } = useCustomerOrders(customerId, ordersTable.query);

    const {
        data: spendOverTime,
        isLoading: spendOverTimeLoading,
        isError: spendOverTimeError,
    } = useCustomerSpendOverTime(customerId);

    const editModal = useEditCustomerModal(customer);
    const revokeSessionsModal = useRevokeCustomerSessionsModal(customerId);

    return {
        customerId,
        customer,
        isLoading,
        isError,

        ordersTable,
        ordersPage,
        ordersLoading,
        ordersFetching,
        ordersError,

        spendOverTime,
        spendOverTimeLoading,
        spendOverTimeError,

        editModal,
        revokeSessionsModal,
    };
};

export default useAdminCustomerDetailPage;
