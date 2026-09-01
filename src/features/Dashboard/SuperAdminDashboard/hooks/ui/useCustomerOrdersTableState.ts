import { useState } from "react";
import { DEFAULT_PAGE_SIZE } from "../../constants";
import type { CustomerOrdersQueryParams } from "../../types";

const useCustomerOrdersTableState = () => {
    const [businessId, setBusinessId] = useState<string | undefined>(undefined);
    const [page, setPage] = useState(1);

    const query: CustomerOrdersQueryParams = {
        page,
        pageSize: DEFAULT_PAGE_SIZE,
        businessId,
    };

    const handleBusinessChange = (value: string) => {
        setBusinessId(value || undefined);
        setPage(1);
    };

    return { query, businessId, handleBusinessChange, setPage };
};

export default useCustomerOrdersTableState;
