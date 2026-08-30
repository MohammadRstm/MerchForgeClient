import type { PlanTierGroup } from "../utils/subscriptionPlanGroups";

// Never gated by plan — confirmed against the real authorization/feature config
// (core commerce endpoints carry no [Authorize(Policy = Feature...)] anywhere).
// Listed as their own row group rather than invented per-plan "features" so this
// table never implies a limit that doesn't exist.
const CORE_CAPABILITIES = ["Custom storefront", "Product management", "Order management", "Inventory management"];

type FeatureComparisonTableProps = {
    tierGroups: PlanTierGroup[];
    selectedInterval: "Monthly" | "Yearly";
};

/** Scannable side-by-side of what each tier actually includes, built entirely from the real plan/feature configuration — never a second, hand-maintained feature list. */
const FeatureComparisonTable = ({ tierGroups, selectedInterval }: FeatureComparisonTableProps) => {
    const plans = tierGroups
        .map((g) => (selectedInterval === "Monthly" ? g.monthly : g.yearly))
        .filter((p): p is NonNullable<typeof p> => Boolean(p));

    if (plans.length === 0) return null;

    // Union of every feature key across the compared plans, in first-seen order —
    // so a feature exclusive to the top tier still gets its own row.
    const featureKeys: string[] = [];
    const featureNames = new Map<string, string>();
    for (const plan of plans) {
        for (const feature of plan.features) {
            if (!featureNames.has(feature.featureKey)) {
                featureKeys.push(feature.featureKey);
                featureNames.set(feature.featureKey, feature.featureName);
            }
        }
    }

    return (
        <section className="business-dashboard-table-card">
            <div className="business-dashboard-table-header">
                <h3>Compare Plans</h3>
            </div>

            <div className="business-dashboard-table-wrapper">
                <table className="business-dashboard-table plan-comparison-table">
                    <thead>
                        <tr>
                            <th></th>
                            {plans.map((plan) => (
                                <th key={plan.id}>{plan.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {CORE_CAPABILITIES.map((capability) => (
                            <tr key={capability}>
                                <td>{capability}</td>
                                {plans.map((plan) => (
                                    <td key={plan.id} className="plan-comparison-table__check">
                                        ✓
                                    </td>
                                ))}
                            </tr>
                        ))}

                        {featureKeys.map((key) => (
                            <tr key={key}>
                                <td>{featureNames.get(key)}</td>
                                {plans.map((plan) => {
                                    const feature = plan.features.find((f) => f.featureKey === key);

                                    return (
                                        <td key={plan.id} className="plan-comparison-table__check">
                                            {!feature ? (
                                                "—"
                                            ) : feature.limit != null ? (
                                                feature.limit
                                            ) : (
                                                "✓"
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default FeatureComparisonTable;
