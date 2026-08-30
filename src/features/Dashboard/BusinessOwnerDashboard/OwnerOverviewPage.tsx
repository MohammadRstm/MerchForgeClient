import "./BusinessOwnerDashboard.css";
import useOwnerOverviewPage from "./hooks/useOwnerOverviewPage";
import OverviewHeader from "./components/OverviewHeader";
import OverviewEmptyState from "./components/OverviewEmptyState";
import BillingNotice from "./components/BillingNotice";
import OverviewKpiCards from "./components/OverviewKpiCards";
import RevenueOverviewChart from "./components/RevenueOverviewChart";
import OrdersRequiringAttention from "./components/OrdersRequiringAttention";
import InventorySnapshot from "./components/InventorySnapshot";
import QuickActions from "./components/QuickActions";
import TopProductsSnapshot from "./components/TopProductsSnapshot";
import RecentOrdersSnapshot from "./components/RecentOrdersSnapshot";
import CategorySalesSnapshot from "./components/CategorySalesSnapshot";
import StoreInsights from "./components/StoreInsights";
import CustomerSnapshotCard from "./components/CustomerSnapshotCard";
import StoreStatusCard from "./components/StoreStatusCard";
import Spinner from "../../../components/LoadingSpinner/LoadingSpinner";

const OwnerOverviewPage = () => {
    const {
        greeting,
        ownerFirstName,
        businessName,

        rangePreset,
        changeRangePreset,
        customFrom,
        customTo,
        setCustomFrom,
        setCustomTo,
        isWaitingForCustomRange,
        rangePresets,

        stats,
        statsLoading,
        statsError,

        chartMetric,
        setChartMetric,
        orderAnalytics,
        orderAnalyticsLoading,
        orderAnalyticsFetching,
        orderAnalyticsError,

        revenue,
        orderCount,
        aov,
        aovChangePercent,
        revenueChangePercent,
        orderCountChangePercent,
        productsSold,
        productsSoldChangePercent,

        topProducts,
        topCategories,
        productPerformanceLoading,
        productPerformanceError,

        inventorySummary,
        inventorySummaryLoading,
        inventorySummaryError,
        attentionProducts,

        pendingOrders,
        pendingOrdersTotal,
        pendingOrdersLoading,
        pendingOrdersError,

        recentOrders,
        recentOrdersLoading,
        recentOrdersError,

        customerSnapshot,
        customerSnapshotLoading,
        customerSnapshotError,

        billingNotice,
        insights,

        hasWebsite,
        websiteUrl,
    } = useOwnerOverviewPage();

    const isNewStore = !statsLoading && !statsError && (stats?.productCount ?? 0) === 0;

    return (
        <main className="business-dashboard-page overview-page">
            <OverviewHeader
                greeting={greeting}
                ownerFirstName={ownerFirstName}
                businessName={businessName}
                rangePreset={rangePreset}
                rangePresets={rangePresets}
                onChangeRangePreset={changeRangePreset}
                customFrom={customFrom}
                customTo={customTo}
                onCustomFromChange={setCustomFrom}
                onCustomToChange={setCustomTo}
            />

            {statsLoading ? (
                <div className="business-dashboard-stats-loading">
                    <Spinner size={32} />
                </div>
            ) : statsError ? (
                <p className="business-dashboard-table-message business-dashboard-table-message--error">
                    Unable to load your store overview. Please try again.
                </p>
            ) : isNewStore ? (
                <OverviewEmptyState />
            ) : (
                <>
                    <BillingNotice message={billingNotice} />

                    <OverviewKpiCards
                        revenue={revenue}
                        revenueChangePercent={revenueChangePercent}
                        orderCount={orderCount}
                        orderCountChangePercent={orderCountChangePercent}
                        aov={aov}
                        aovChangePercent={aovChangePercent}
                        productsSold={productsSold}
                        productsSoldChangePercent={productsSoldChangePercent}
                    />

                    <RevenueOverviewChart
                        analytics={orderAnalytics}
                        isLoading={orderAnalyticsLoading}
                        isFetching={orderAnalyticsFetching}
                        isError={orderAnalyticsError}
                        isWaitingForCustomRange={isWaitingForCustomRange}
                        metric={chartMetric}
                        onChangeMetric={setChartMetric}
                    />

                    <div className="product-performance-row">
                        <OrdersRequiringAttention
                            orders={pendingOrders}
                            totalPending={pendingOrdersTotal}
                            isLoading={pendingOrdersLoading}
                            isError={pendingOrdersError}
                        />
                        <InventorySnapshot
                            summary={inventorySummary}
                            isLoading={inventorySummaryLoading}
                            isError={inventorySummaryError}
                            attentionProducts={attentionProducts}
                        />
                    </div>

                    <QuickActions />

                    <div className="product-performance-row">
                        <TopProductsSnapshot
                            products={topProducts}
                            isLoading={productPerformanceLoading}
                            isError={productPerformanceError}
                        />
                        <RecentOrdersSnapshot orders={recentOrders} isLoading={recentOrdersLoading} isError={recentOrdersError} />
                    </div>

                    <div className="product-performance-row">
                        <CategorySalesSnapshot categories={topCategories} isLoading={productPerformanceLoading} />
                        <StoreInsights insights={insights} />
                    </div>

                    <div className="overview-compact-row">
                        <CustomerSnapshotCard
                            snapshot={customerSnapshot}
                            isLoading={customerSnapshotLoading}
                            isError={customerSnapshotError}
                        />
                        <StoreStatusCard hasWebsite={hasWebsite} websiteUrl={websiteUrl} />
                    </div>
                </>
            )}
        </main>
    );
};

export default OwnerOverviewPage;
