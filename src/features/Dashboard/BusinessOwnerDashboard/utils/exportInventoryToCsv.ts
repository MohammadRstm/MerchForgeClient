import type { BusinessProductResponse } from "../types";

const escapeCsvCell = (value: string) => {
    if (/[",\n]/.test(value)) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
};

const INVENTORY_EXPORT_COLUMNS = ["Title", "SKU", "Category", "Price", "Stock", "Tracking", "Updated"] as const;

export const buildInventoryCsv = (products: BusinessProductResponse[]): string => {
    const rows = products.map((product) => [
        product.title,
        product.sku ?? "",
        product.category,
        String(product.price),
        product.stockQuantity === null ? "" : String(product.stockQuantity),
        product.stockQuantity === null ? "Untracked" : "Tracked",
        new Date(product.updatedAt).toLocaleDateString(),
    ]);

    return [INVENTORY_EXPORT_COLUMNS, ...rows].map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
};

export const downloadInventoryCsv = (products: BusinessProductResponse[], filename: string) => {
    const csv = buildInventoryCsv(products);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};
