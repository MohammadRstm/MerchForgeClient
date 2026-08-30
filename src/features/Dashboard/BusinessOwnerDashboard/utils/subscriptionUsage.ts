/** A metered feature's usage against its current plan limit — null limit/percent means unlimited, not "no data". */
export type FeatureUsage = {
    featureKey: string;
    featureName: string;
    limit: number | null;
    remaining: number | null;
    used: number | null;
    percent: number | null;
};

export type UsageWarningLevel = "none" | "approaching" | "reached";

const APPROACHING_THRESHOLD_PERCENT = 80;

/** Deterministic, not AI — matches the thresholds used throughout the rest of the dashboard (e.g. InventoryRiskSection). */
export const getUsageWarningLevel = (percent: number | null): UsageWarningLevel => {
    if (percent === null) return "none";
    if (percent >= 100) return "reached";
    if (percent >= APPROACHING_THRESHOLD_PERCENT) return "approaching";
    return "none";
};
