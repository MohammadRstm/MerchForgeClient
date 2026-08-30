import { useMemo, useState } from "react";
import useAuth from "../../../../context/Auth/useAuth";
import useBusinessDashboardStats from "./data/useBusinessDashboardStats";
import useOrderAnalytics from "./data/useOrderAnalytics";
import useProductAnalytics from "./data/useProductAnalytics";
import useProductPerformance from "./data/useProductPerformance";
import useInventorySummary from "./data/useInventorySummary";
import useBusinessProducts from "./data/useBusinessProducts";
import useBusinessOrders from "./data/useBusinessOrders";
import useCustomerSnapshot from "./data/useCustomerSnapshot";
import useBusinessSubscription from "./data/useBusinessSubscription";
import useBusinessFeatures from "./data/useBusinessFeatures";
import { resolveAnalyticsDateRange, ANALYTICS_RANGE_PRESETS } from "../utils/analyticsDateRange";
import { getUsageWarningLevel } from "../utils/subscriptionUsage";
import { buildOverviewInsights } from "../utils/overviewInsights";
import type { AnalyticsRangePreset } from "../types";

const AI_IMAGE_EDITING_KEY = "ai.image_editing";
const RENEWAL_NOTICE_WINDOW_DAYS = 7;

const timeBasedGreeting = (nowMs: number) => {
    const hour = new Date(nowMs).getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

const useOwnerOverviewPage = () => {
    const { session } = useAuth();
    const businessId = session?.business?.id ?? "";
    const ownerFirstName = session?.firstName ?? "";
    const businessName = session?.business?.name ?? "";

    const [rangePreset, setRangePreset] = useState<AnalyticsRangePreset>("30d");
    const [customFrom, setCustomFrom] = useState("");
    const [customTo, setCustomTo] = useState("");
    const [chartMetric, setChartMetric] = useState<"revenue" | "orders">("revenue");

    const { from, to } = useMemo(
        () => resolveAnalyticsDateRange(rangePreset, customFrom, customTo),
        [rangePreset, customFrom, customTo]
    );
    const hasResolvedRange = Boolean(from && to);
    const resolvedFrom = hasResolvedRange ? from! : "";
    const resolvedTo = hasResolvedRange ? to! : "";

    const changeRangePreset = (preset: AnalyticsRangePreset) => {
        setRangePreset(preset);
        if (preset !== "custom") {
            setCustomFrom("");
            setCustomTo("");
        }
    };

    const { data: stats, isLoading: statsLoading, isError: statsError } = useBusinessDashboardStats(businessId);

    const {
        data: orderAnalytics,
        isLoading: orderAnalyticsLoading,
        isFetching: orderAnalyticsFetching,
        isError: orderAnalyticsError,
    } = useOrderAnalytics(businessId, resolvedFrom, resolvedTo);

    const { data: productAnalytics, isLoading: productAnalyticsLoading } = useProductAnalytics(
        businessId,
        resolvedFrom,
        resolvedTo
    );

    const {
        data: productPerformance,
        isLoading: productPerformanceLoading,
        isError: productPerformanceError,
    } = useProductPerformance(businessId, resolvedFrom, resolvedTo);

    const {
        data: inventorySummary,
        isLoading: inventorySummaryLoading,
        isError: inventorySummaryError,
    } = useInventorySummary(businessId);

    // Two small, bounded queries (3 rows each) reusing the exact same paginated
    // products endpoint Inventory/Products already use — not a new aggregation.
    const { data: lowStockPage } = useBusinessProducts(businessId, {
        page: 1,
        pageSize: 3,
        stockStatus: "LowStock",
        sortBy: "StockQuantity",
        sortDescending: false,
    });
    const { data: outOfStockPage } = useBusinessProducts(businessId, {
        page: 1,
        pageSize: 3,
        stockStatus: "OutOfStock",
        sortBy: "UpdatedAt",
        sortDescending: true,
    });

    const {
        data: pendingOrdersPage,
        isLoading: pendingOrdersLoading,
        isError: pendingOrdersError,
    } = useBusinessOrders(businessId, { page: 1, pageSize: 3, status: "Pending" });

    const {
        data: recentOrdersPage,
        isLoading: recentOrdersLoading,
        isError: recentOrdersError,
    } = useBusinessOrders(businessId, { page: 1, pageSize: 5 });

    const {
        data: customerSnapshot,
        isLoading: customerSnapshotLoading,
        isError: customerSnapshotError,
    } = useCustomerSnapshot(businessId, resolvedFrom, resolvedTo);

    const { data: subscription } = useBusinessSubscription(businessId);
    const { data: businessFeatures } = useBusinessFeatures(businessId);

    // Read once per mount rather than calling Date.now() directly in render — the
    // "days until renewal" figure only needs to be roughly current, not re-derived
    // on every render (same pattern NeedsAttention.tsx uses for its "hours waiting" figure).
    const [now] = useState(() => Date.now());

    // ---- KPIs ----

    const revenue = orderAnalytics?.currentPeriod.revenue ?? 0;
    const orderCount = orderAnalytics?.currentPeriod.orderCount ?? 0;
    const previousRevenue = orderAnalytics?.previousPeriod.revenue ?? 0;
    const previousOrderCount = orderAnalytics?.previousPeriod.orderCount ?? 0;

    const aov = orderCount > 0 ? revenue / orderCount : null;
    const previousAov = previousOrderCount > 0 ? previousRevenue / previousOrderCount : null;
    const aovChangePercent =
        aov !== null && previousAov !== null && previousAov > 0 ? ((aov - previousAov) / previousAov) * 100 : null;

    const productsSold = productAnalytics?.currentPeriod.unitsSold ?? 0;
    const productsSoldChangePercent = productAnalytics?.unitsSoldChangePercent ?? null;

    // ---- top products / categories ----

    const topProducts = [...(productPerformance?.products ?? [])]
        .filter((p) => p.revenue > 0)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 3);

    const topCategories = [...(productPerformance?.categories ?? [])]
        .filter((c) => c.revenue > 0)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    // ---- inventory attention (low stock first, then out of stock, capped at 3) ----

    const attentionProducts = [...(lowStockPage?.items ?? []), ...(outOfStockPage?.items ?? [])].slice(0, 3);

    // ---- billing notice (contextual — null when there's nothing worth surfacing) ----

    const aiCreditsFeature = businessFeatures?.find((f) => f.featureKey === AI_IMAGE_EDITING_KEY);
    const aiCreditsLimit = subscription?.features.find((f) => f.featureKey === AI_IMAGE_EDITING_KEY)?.limit ?? null;
    const aiCreditsPercent =
        aiCreditsFeature && aiCreditsLimit && aiCreditsLimit > 0
            ? Math.min(100, ((aiCreditsLimit - aiCreditsFeature.creditsRemaining) / aiCreditsLimit) * 100)
            : null;
    const aiCreditsWarning = getUsageWarningLevel(aiCreditsPercent);

    const daysUntilPeriodEnd = subscription
        ? Math.ceil((new Date(subscription.currentPeriodEnd).getTime() - now) / (1000 * 60 * 60 * 24))
        : null;

    const billingNotice = (() => {
        if (aiCreditsWarning === "reached") {
            return "You've reached your AI Image Editing credit limit for this period.";
        }
        if (aiCreditsWarning === "approaching") {
            return `You're using ${aiCreditsPercent!.toFixed(0)}% of your AI Image Editing credits.`;
        }
        if (
            subscription?.status === "Active" &&
            subscription.cancelAtPeriodEnd &&
            daysUntilPeriodEnd !== null &&
            daysUntilPeriodEnd <= RENEWAL_NOTICE_WINDOW_DAYS
        ) {
            return daysUntilPeriodEnd <= 0
                ? "Your plan access ends today."
                : `Your plan won't renew — access ends in ${daysUntilPeriodEnd} day${daysUntilPeriodEnd === 1 ? "" : "s"}.`;
        }
        if (
            subscription?.status === "Active" &&
            !subscription.cancelAtPeriodEnd &&
            daysUntilPeriodEnd !== null &&
            daysUntilPeriodEnd <= RENEWAL_NOTICE_WINDOW_DAYS
        ) {
            return daysUntilPeriodEnd <= 0
                ? "Your subscription renews today."
                : `Your subscription renews in ${daysUntilPeriodEnd} day${daysUntilPeriodEnd === 1 ? "" : "s"}.`;
        }
        if (!subscription) {
            return "You don't have an active plan yet.";
        }
        return null;
    })();

    // ---- insights ----

    const insights = buildOverviewInsights({
        revenueChangePercent: orderAnalytics?.revenueChangePercent ?? null,
        orderCountChangePercent: orderAnalytics?.orderCountChangePercent ?? null,
        topProduct: topProducts[0],
        outOfStockCount: inventorySummary?.outOfStockCount ?? 0,
        newCustomersInPeriod: customerSnapshot?.newCustomersInPeriod ?? 0,
    });

    return {
        greeting: timeBasedGreeting(now),
        ownerFirstName,
        businessName,

        rangePreset,
        changeRangePreset,
        customFrom,
        customTo,
        setCustomFrom,
        setCustomTo,
        isWaitingForCustomRange: !hasResolvedRange,
        rangePresets: ANALYTICS_RANGE_PRESETS,

        stats,
        statsLoading,
        statsError,

        chartMetric,
        setChartMetric,
        orderAnalytics,
        orderAnalyticsLoading: orderAnalyticsLoading && hasResolvedRange,
        orderAnalyticsFetching,
        orderAnalyticsError,

        revenue,
        orderCount,
        aov,
        aovChangePercent,
        revenueChangePercent: orderAnalytics?.revenueChangePercent ?? null,
        orderCountChangePercent: orderAnalytics?.orderCountChangePercent ?? null,
        productsSold,
        productsSoldChangePercent,
        productAnalyticsLoading: productAnalyticsLoading && hasResolvedRange,

        topProducts,
        topCategories,
        productPerformanceLoading: productPerformanceLoading && hasResolvedRange,
        productPerformanceError,

        inventorySummary,
        inventorySummaryLoading,
        inventorySummaryError,
        attentionProducts,

        pendingOrders: pendingOrdersPage?.items ?? [],
        pendingOrdersTotal: pendingOrdersPage?.totalCount ?? 0,
        pendingOrdersLoading,
        pendingOrdersError,

        recentOrders: recentOrdersPage?.items ?? [],
        recentOrdersLoading,
        recentOrdersError,

        customerSnapshot,
        customerSnapshotLoading: customerSnapshotLoading && hasResolvedRange,
        customerSnapshotError,

        subscription,
        billingNotice,

        insights,

        hasWebsite: Boolean(stats?.websiteUrl),
        websiteUrl: stats?.websiteUrl,
    };
};

export default useOwnerOverviewPage;
