import { useMemo, useState } from "react";
import { useParams } from "react-router";
import useDashboardBusinessDetail from "./data/useDashboardBusinessDetail";
import useRevokeBusinessSessions from "./data/useRevokeBusinessSessions";
import useBusinessMetadataShape from "./data/useBusinessMetadataShape";
import useUpdateBusinessMetadataShape from "./data/useUpdateBusinessMetadataShape";
import useDashboardProductAttributes from "./data/useDashboardProductAttributes";
import useBusinessOrderAnalytics from "./data/useBusinessOrderAnalytics";
import useBusinessRecentOrders from "./data/useBusinessRecentOrders";
import useBusinessInventorySummary from "./data/useBusinessInventorySummary";
import useBusinessProductPerformance from "./data/useBusinessProductPerformance";
import useBusinessCustomerSnapshot from "./data/useBusinessCustomerSnapshot";
import { resolveAnalyticsDateRange, ANALYTICS_RANGE_PRESETS } from "../../BusinessOwnerDashboard/utils/analyticsDateRange";
import type { AnalyticsRangePreset } from "../../BusinessOwnerDashboard/types";
import type { UpdateMetadataShapeFieldPayload } from "../types";

/** The plan calls for 7 Days | 30 Days | 3 Months | 1 Year only - no 6-month or custom range for this view. */
const SALES_RANGE_PRESETS = ANALYTICS_RANGE_PRESETS.filter((p) =>
    (["7d", "30d", "3m", "1y"] as AnalyticsRangePreset[]).includes(p.value)
);

type FieldOverride = {
    label: string;
    isRequired: boolean;
    allowedValuesInput: string;
};

const parseAllowedValues = (input: string) =>
    input
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v.length > 0);

const useAdminBusinessDetailPage = () => {
    const { businessId = "" } = useParams<{ businessId: string }>();

    const { data: business, isLoading, isError } = useDashboardBusinessDetail(businessId);

    // Stable for the page's lifetime rather than re-evaluated every render, so the
    // all-time KPI queries below don't refetch on every keystroke/state change
    // elsewhere on the page.
    const [now] = useState(() => new Date().toISOString());
    const allTimeFrom = business?.createdAt ?? "";
    const allTimeTo = now;

    const [salesPreset, setSalesPreset] = useState<AnalyticsRangePreset>("30d");
    const [salesMetric, setSalesMetric] = useState<"revenue" | "orders">("revenue");
    const { from: salesFrom, to: salesTo } = useMemo(
        () => resolveAnalyticsDateRange(salesPreset, "", ""),
        [salesPreset]
    );

    const {
        data: kpiOrderAnalytics,
        isLoading: kpiOrderAnalyticsLoading,
        isError: kpiOrderAnalyticsError,
    } = useBusinessOrderAnalytics(businessId, allTimeFrom, allTimeTo);

    const {
        data: salesAnalytics,
        isLoading: salesAnalyticsLoading,
        isFetching: salesAnalyticsFetching,
        isError: salesAnalyticsError,
    } = useBusinessOrderAnalytics(businessId, salesFrom ?? "", salesTo ?? "");

    const {
        data: recentOrders,
        isLoading: recentOrdersLoading,
        isError: recentOrdersError,
    } = useBusinessRecentOrders(businessId, 10);

    const {
        data: inventorySummary,
        isLoading: inventorySummaryLoading,
        isError: inventorySummaryError,
    } = useBusinessInventorySummary(businessId);

    const {
        data: productPerformance,
        isLoading: productPerformanceLoading,
        isError: productPerformanceError,
    } = useBusinessProductPerformance(businessId, allTimeFrom, allTimeTo);

    const {
        data: customerSnapshot,
        isLoading: customerSnapshotLoading,
        isError: customerSnapshotError,
    } = useBusinessCustomerSnapshot(businessId, allTimeFrom, allTimeTo);

    const topProducts = [...(productPerformance?.products ?? [])]
        .filter((p) => p.revenue > 0)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    const [revokeConfirmOpen, setRevokeConfirmOpen] = useState(false);
    const {
        mutate: revokeSessions,
        isPending: isRevoking,
        data: revokeResult,
        reset: resetRevoke,
    } = useRevokeBusinessSessions(businessId);

    const businessDomainId = business?.businessDomainId ?? undefined;

    const { data: currentShape, isLoading: shapeLoading } = useBusinessMetadataShape(businessId, !!business);

    const {
        data: allDefinitions,
        isLoading: catalogueLoading,
        isError: catalogueError,
    } = useDashboardProductAttributes(businessDomainId);

    // Retired fields aren't offered for new selection, but a business that already
    // has one snapshotted still needs to see it (and be able to remove it) --
    // otherwise an admin could never un-check a field whose definition was retired
    // after this business picked it.
    const catalogue = allDefinitions?.filter(
        (d) => d.isActive || currentShape?.some((f) => f.key === d.key)
    );

    // Per included field's editable overrides, keyed by field key. Starts empty so
    // it can be seeded from the business's already-saved shape exactly once.
    const [fieldOverrides, setFieldOverrides] = useState<Map<string, FieldOverride> | null>(null);

    // Seeded from the business's already-saved shape exactly once, guarded by
    // fieldOverrides still being null. Adjusting state during render, per
    // https://react.dev/reference/react/useState#storing-information-from-previous-renders,
    // rather than in an effect, so this doesn't trigger an extra cascading render.
    if (currentShape && fieldOverrides === null) {
        const seeded = new Map<string, FieldOverride>();

        for (const field of currentShape) {
            seeded.set(field.key, {
                label: field.label,
                isRequired: field.isRequired,
                allowedValuesInput: field.allowedValues.join(", "),
            });
        }

        setFieldOverrides(seeded);
    }

    const toggleKey = (key: string) => {
        setFieldOverrides((current) => {
            const next = new Map(current ?? []);

            if (next.has(key)) {
                next.delete(key);
                return next;
            }

            // Newly-included: default from the catalogue's own definition rather
            // than guessing at customization the admin hasn't specified yet.
            const definition = catalogue?.find((d) => d.key === key);

            next.set(key, {
                label: definition?.label ?? key,
                isRequired: definition?.isRequired ?? false,
                allowedValuesInput: definition?.allowedValues.join(", ") ?? "",
            });

            return next;
        });
    };

    const updateFieldOverride = <K extends keyof FieldOverride>(key: string, field: K, value: FieldOverride[K]) => {
        setFieldOverrides((current) => {
            const next = new Map(current ?? []);
            const existing = next.get(key);

            if (!existing) {
                return next;
            }

            next.set(key, { ...existing, [field]: value });
            return next;
        });
    };

    const {
        mutate: saveShape,
        isPending: isSavingShape,
        isSuccess: shapeSaved,
    } = useUpdateBusinessMetadataShape(businessId);

    const saveMetadataShape = () => {
        if (!catalogue || !fieldOverrides) {
            return;
        }

        const fields: UpdateMetadataShapeFieldPayload[] = catalogue
            .filter((attribute) => fieldOverrides.has(attribute.key))
            .map((attribute, index) => {
                const override = fieldOverrides.get(attribute.key)!;

                return {
                    key: attribute.key,
                    label: override.label.trim() || attribute.label,
                    valueType: attribute.valueType,
                    isRequired: override.isRequired,
                    allowedValues: parseAllowedValues(override.allowedValuesInput),
                    displayOrder: index,
                };
            });

        saveShape(fields);
    };

    return {
        businessId,
        business,
        isLoading,
        isError,

        kpiOrderAnalytics,
        kpiOrderAnalyticsLoading,
        kpiOrderAnalyticsError,

        salesPreset,
        setSalesPreset,
        salesPresets: SALES_RANGE_PRESETS,
        salesMetric,
        setSalesMetric,
        salesAnalytics,
        salesAnalyticsLoading,
        salesAnalyticsFetching,
        salesAnalyticsError,

        recentOrders: recentOrders ?? [],
        recentOrdersLoading,
        recentOrdersError,

        inventorySummary,
        inventorySummaryLoading,
        inventorySummaryError,

        productPerformance,
        topProducts,
        productPerformanceLoading,
        productPerformanceError,

        customerSnapshot,
        customerSnapshotLoading,
        customerSnapshotError,

        revokeConfirmOpen,
        openRevokeConfirm: () => {
            resetRevoke();
            setRevokeConfirmOpen(true);
        },
        closeRevokeConfirm: () => setRevokeConfirmOpen(false),
        confirmRevoke: () => revokeSessions(),
        isRevoking,
        revokeResult,

        catalogue,
        catalogueLoading,
        catalogueError,
        shapeLoading,
        fieldOverrides,
        toggleKey,
        updateFieldOverride,
        saveMetadataShape,
        isSavingShape,
        shapeSaved,
    };
};

export default useAdminBusinessDetailPage;
