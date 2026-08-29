import StatCards from "../../../../components/DashboardWidgets/StatCards";
import { currencyFormatter, numberFormatter } from "../utils/chartMetrics";
import type { ProductCatalogOverview } from "../types";

type ProductCatalogOverviewCardsProps = {
    overview?: ProductCatalogOverview;
};

/**
 * Catalog-wide, all-time — deliberately not driven by the analytics range selector
 * below it (see the "Analytics" vs "Catalog" note in ProductAnalyticsSection). No
 * "Active/Published" card: Product has no such field in the current model.
 */
const ProductCatalogOverviewCards = ({ overview }: ProductCatalogOverviewCardsProps) => {
    return (
        <StatCards
            cards={[
                { label: "Total Products", value: numberFormatter.format(overview?.totalProducts ?? 0) },
                { label: "Total Units Sold", value: numberFormatter.format(overview?.totalUnitsSold ?? 0) },
                { label: "Product Revenue", value: currencyFormatter.format(overview?.productRevenue ?? 0) },
                {
                    label: "Average Product Price",
                    value:
                        overview?.averageProductPrice != null
                            ? currencyFormatter.format(overview.averageProductPrice)
                            : "—",
                },
            ]}
        />
    );
};

export default ProductCatalogOverviewCards;
