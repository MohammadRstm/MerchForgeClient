import { useState } from "react";
import useTopCustomers from "../data/useTopCustomers";
import type { TopCustomersRankBy } from "../../types";

const useTopCustomersPanel = () => {
    const [rankBy, setRankBy] = useState<TopCustomersRankBy>("Spend");

    const { data, isLoading, isError } = useTopCustomers(rankBy, "USD", 10);

    return { rankBy, setRankBy, data, isLoading, isError };
};

export default useTopCustomersPanel;
