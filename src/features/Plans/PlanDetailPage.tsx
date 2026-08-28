import { Link, useParams } from "react-router";
import "../Home/Home.css";
import "./PlanDetailPage.css";
import Spinner from "../../components/LoadingSpinner/LoadingSpinner";
import useAuth from "../../context/Auth/useAuth";
import { routes } from "../../config/routes";
import usePublicSubscriptionPlans from "./hooks/usePublicSubscriptionPlans";

const currencyFormatter = (currency: string) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency });

const PlanDetailPage = () => {
    const { planId = "" } = useParams<{ planId: string }>();
    const { session } = useAuth();
    const { data: plans, isLoading, isError } = usePublicSubscriptionPlans();

    const plan = plans?.find((p) => p.id === planId);

    // Same plan, the other billing interval — shown as an aside so a visitor
    // comparing monthly vs. yearly doesn't have to go back to the pricing grid.
    const alternateIntervalPlan = plans?.find(
        (p) => p.name === plan?.name && p.billingInterval !== plan?.billingInterval
    );

    const isOwner = session?.business?.role === "Owner";
    const ctaHref = isOwner ? `${routes.DASHBOARD_BILLING}?plan=${planId}` : routes.SIGNUP;
    const ctaLabel = isOwner ? "Choose this plan" : "Get started";

    return (
        <main className="plan-detail mf-section">
            <div className="plan-detail__inner mf-section__inner">
                {isLoading ? (
                    <div className="plan-detail__loading">
                        <Spinner size={32} />
                    </div>
                ) : isError || !plan ? (
                    <div className="plan-detail__error">
                        <p>We couldn't find that plan.</p>
                        <Link to={`${routes.HOME}#pricing`} className="mf-btn mf-btn--secondary">
                            Back to pricing
                        </Link>
                    </div>
                ) : (
                    <>
                        <p className="mf-eyebrow">Pricing</p>
                        <h1 className="plan-detail__name mf-headline">{plan.name}</h1>
                        {plan.description && <p className="plan-detail__tagline mf-subtext">{plan.description}</p>}

                        <div className="plan-detail__price-row">
                            <span className="plan-detail__price">
                                {currencyFormatter(plan.currency).format(plan.price)}
                            </span>
                            <span className="plan-detail__cadence">/ {plan.billingInterval.toLowerCase()}</span>
                        </div>

                        {alternateIntervalPlan && (
                            <p className="plan-detail__alternate">
                                Also available {alternateIntervalPlan.billingInterval === "Yearly" ? "yearly" : "monthly"}
                                : {currencyFormatter(alternateIntervalPlan.currency).format(alternateIntervalPlan.price)}
                                {" "}/ {alternateIntervalPlan.billingInterval.toLowerCase()}
                            </p>
                        )}

                        <a href={ctaHref} className="mf-btn mf-btn--primary plan-detail__cta">
                            {ctaLabel}
                        </a>

                        <section className="plan-detail__features">
                            <h2 className="plan-detail__features-heading">What's included</h2>

                            {plan.features.length === 0 ? (
                                <p className="plan-detail__no-features">
                                    This plan doesn't include any gated features yet.
                                </p>
                            ) : (
                                <ul className="plan-detail__features-list">
                                    {plan.features.map((feature) => (
                                        <li key={feature.featureKey} className="plan-detail__feature">
                                            <span className="plan-detail__feature-check" aria-hidden="true">
                                                ✓
                                            </span>
                                            <span>
                                                <span className="plan-detail__feature-name">
                                                    {feature.featureName}
                                                    {feature.limit != null && ` — up to ${feature.limit}/period`}
                                                </span>
                                                {feature.featureDescription && (
                                                    <span className="plan-detail__feature-description">
                                                        {feature.featureDescription}
                                                    </span>
                                                )}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        <Link to={`${routes.HOME}#pricing`} className="plan-detail__back-link">
                            &larr; Compare all plans
                        </Link>
                    </>
                )}
            </div>
        </main>
    );
};

export default PlanDetailPage;
