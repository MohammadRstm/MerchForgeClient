import { useQuery } from "@tanstack/react-query";
import { getTopCustomersService } from "../../../../../services/api/dashboard.api";
import type { TopCustomersRankBy } from "../../types";

const useTopCustomers = (rankBy: TopCustomersRankBy, currency: string | undefined, take = 10) => {
    return useQuery({
        queryKey: ["dashboard", "top-customers", rankBy, currency, take],
        queryFn: () => getTopCustomersService(rankBy, currency, take),
    });
};

export default useTopCustomers;
