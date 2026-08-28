import { useParams } from "react-router";
import useDashboardCustomerDetail from "./data/useDashboardCustomerDetail";

const useAdminCustomerDetailPage = () => {
    const { customerId = "" } = useParams<{ customerId: string }>();

    const { data: customer, isLoading, isError } = useDashboardCustomerDetail(customerId);

    return {
        customerId,
        customer,
        isLoading,
        isError,
    };
};

export default useAdminCustomerDetailPage;
