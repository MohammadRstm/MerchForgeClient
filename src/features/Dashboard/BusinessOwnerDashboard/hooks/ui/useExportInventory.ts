import { useState } from "react";
import { getBusinessProductsService } from "../../../../../services/api/businessDashboard.api";
import { downloadInventoryCsv } from "../../utils/exportInventoryToCsv";
import type { ProductsQueryParams } from "../../types";

const EXPORT_PAGE_SIZE = 100;
// Same bound useExportOrders uses — export stays a client-side loop over the existing
// paginated products endpoint (no bulk export endpoint exists), capped rather than
// fetching an unbounded catalog.
const EXPORT_MAX_PAGES = 50;

/** Loops the existing paginated products endpoint to export every product matching the current inventory filters, not just the current page. */
const useExportInventory = (businessId: string) => {
    const [isExporting, setIsExporting] = useState(false);

    const exportFiltered = async (query: ProductsQueryParams, filenamePrefix: string) => {
        setIsExporting(true);

        try {
            const allProducts = [];
            let page = 1;

            while (page <= EXPORT_MAX_PAGES) {
                const result = await getBusinessProductsService(businessId, {
                    ...query,
                    page,
                    pageSize: EXPORT_PAGE_SIZE,
                });

                allProducts.push(...result.items);

                if (page >= result.totalPages) break;
                page += 1;
            }

            downloadInventoryCsv(allProducts, `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`);
        } finally {
            setIsExporting(false);
        }
    };

    return { exportFiltered, isExporting };
};

export default useExportInventory;
