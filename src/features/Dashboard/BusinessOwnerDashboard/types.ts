import type z from "zod";
import type { PagedQuery } from "../../../types/pagination";
import type {
    businessDashboardStatsResponseSchema,
    businessMemberResponseSchema,
    businessProductResponseSchema,
    businessSubscriptionResponseSchema,
} from "./validation";

export type BusinessDashboardStatsResponse = z.infer<typeof businessDashboardStatsResponseSchema>;
export type BusinessProductResponse = z.infer<typeof businessProductResponseSchema>;
export type BusinessMemberResponse = z.infer<typeof businessMemberResponseSchema>;
export type BusinessSubscriptionResponse = z.infer<typeof businessSubscriptionResponseSchema>;

export type ProductSortField = "CreatedAt" | "Title" | "Price";

export type ProductsQueryParams = PagedQuery & {
    search?: string;
    category?: string;
    sortBy: ProductSortField;
    sortDescending: boolean;
};
