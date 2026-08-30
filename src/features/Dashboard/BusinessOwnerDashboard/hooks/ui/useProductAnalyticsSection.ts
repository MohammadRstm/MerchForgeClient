import { useMemo, useState } from "react";
import useProductAnalytics from "../data/useProductAnalytics";
import useProductPerformance from "../data/useProductPerformance";
import { resolveAnalyticsDateRange } from "../../utils/analyticsDateRange";
import type { AnalyticsRangePreset, ProductAnalyticsMetric } from "../../types";

const useProductAnalyticsSection = (businessId: string) => {
    const [rangePreset, setRangePreset] = useState<AnalyticsRangePreset>("30d");
    const [customFrom, setCustomFrom] = useState("");
    const [customTo, setCustomTo] = useState("");
    const [metric, setMetric] = useState<ProductAnalyticsMetric>("revenue");

    const { from, to } = useMemo(
        () => resolveAnalyticsDateRange(rangePreset, customFrom, customTo),
        [rangePreset, customFrom, customTo]
    );

    const hasResolvedRange = Boolean(from && to);
    const resolvedFrom = hasResolvedRange ? from! : "";
    const resolvedTo = hasResolvedRange ? to! : "";

    const {
        data: analytics,
        isLoading: analyticsLoading,
        isFetching: analyticsFetching,
        isError: analyticsError,
    } = useProductAnalytics(businessId, resolvedFrom, resolvedTo);

    const {
        data: performance,
        isLoading: performanceLoading,
        isFetching: performanceFetching,
        isError: performanceError,
    } = useProductPerformance(businessId, resolvedFrom, resolvedTo);

    const changeRangePreset = (preset: AnalyticsRangePreset) => {
        setRangePreset(preset);
        if (preset !== "custom") {
            setCustomFrom("");
            setCustomTo("");
        }
    };

    return {
        rangePreset,
        changeRangePreset,
        customFrom,
        customTo,
        setCustomFrom,
        setCustomTo,
        isWaitingForCustomRange: !hasResolvedRange,

        metric,
        setMetric,

        from: resolvedFrom,
        to: resolvedTo,

        analytics,
        analyticsLoading: analyticsLoading && hasResolvedRange,
        analyticsFetching,
        analyticsError,

        performance,
        performanceLoading: performanceLoading && hasResolvedRange,
        performanceFetching,
        performanceError,
    };
};

export default useProductAnalyticsSection;
