import { useState } from "react";
import { getBusinessOrdersService } from "../../../../../services/api/businessDashboard.api";
import { downloadOrdersCsv } from "../../utils/exportOrdersToCsv";
import type { OrdersQueryParams } from "../../types";

const EXPORT_PAGE_SIZE = 100;
// A sane ceiling for a starter-scale store — export stays a client-side loop over the
// existing paginated endpoint (no bulk export endpoint exists), so this bounds how
// long a single export can run rather than fetching an unbounded number of orders.
const EXPORT_MAX_PAGES = 50;

/** Loops the existing paginated orders endpoint to export every order matching the current filters, not just the current page. */
const useExportOrders = (businessId: string) => {
    const [isExporting, setIsExporting] = useState(false);

    const exportFiltered = async (query: OrdersQueryParams, filenamePrefix: string) => {
        setIsExporting(true);

        try {
            const allOrders = [];
            let page = 1;

            while (page <= EXPORT_MAX_PAGES) {
                const result = await getBusinessOrdersService(businessId, {
                    ...query,
                    page,
                    pageSize: EXPORT_PAGE_SIZE,
                });

                allOrders.push(...result.items);

                if (page >= result.totalPages) break;
                page += 1;
            }

            downloadOrdersCsv(allOrders, `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`);
        } finally {
            setIsExporting(false);
        }
    };

    return { exportFiltered, isExporting };
};

export default useExportOrders;
