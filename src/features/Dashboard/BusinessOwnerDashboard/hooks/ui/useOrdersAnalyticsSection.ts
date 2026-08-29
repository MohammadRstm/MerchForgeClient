import { useMemo, useState } from "react";
import useOrderAnalytics from "../data/useOrderAnalytics";
import { resolveAnalyticsDateRange } from "../../utils/analyticsDateRange";
import type { AnalyticsMetric, AnalyticsRangePreset } from "../../types";

const useOrdersAnalyticsSection = (businessId: string) => {
    const [rangePreset, setRangePreset] = useState<AnalyticsRangePreset>("30d");
    const [customFrom, setCustomFrom] = useState("");
    const [customTo, setCustomTo] = useState("");
    const [metric, setMetric] = useState<AnalyticsMetric>("revenue");

    const { from, to } = useMemo(
        () => resolveAnalyticsDateRange(rangePreset, customFrom, customTo),
        [rangePreset, customFrom, customTo]
    );

    // Only a real, complete range actually queries — "Custom" with one or both dates
    // still blank just waits rather than firing a request with a missing bound.
    const hasResolvedRange = Boolean(from && to);

    const { data, isLoading, isFetching, isError } = useOrderAnalytics(
        businessId,
        hasResolvedRange ? from! : "",
        hasResolvedRange ? to! : ""
    );

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

        metric,
        setMetric,

        analytics: data,
        isLoading: isLoading && hasResolvedRange,
        isFetching,
        isError,
        isWaitingForCustomRange: !hasResolvedRange,
    };
};

export default useOrdersAnalyticsSection;
