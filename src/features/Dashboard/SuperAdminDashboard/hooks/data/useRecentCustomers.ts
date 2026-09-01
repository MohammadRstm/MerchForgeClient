import { useQuery } from "@tanstack/react-query";
import { getRecentCustomersService } from "../../../../../services/api/dashboard.api";

const useRecentCustomers = (take = 8) => {
    return useQuery({
        queryKey: ["dashboard", "recent-customers", take],
        queryFn: () => getRecentCustomersService(take),
    });
};

export default useRecentCustomers;
