import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router';
import './Pricing.css';
import { routes, buildPlanDetailRoute } from '../../../../config/routes';
import useAuth from '../../../../context/Auth/useAuth';
import usePublicSubscriptionPlans from '../../../Plans/hooks/usePublicSubscriptionPlans';

function withDelay(seconds: number): CSSProperties {
  return { '--delay': `${seconds}s` } as CSSProperties;
}

const currencyFormatter = (currency: string) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 });

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  const { session } = useAuth();
  const isOwner = session?.business?.role === 'Owner';

  const { data: allPlans, isLoading, isError } = usePublicSubscriptionPlans();

  // The landing page shows one card per tier, priced monthly — the yearly
  // equivalent (and its savings) is surfaced as a note rather than a second
  // set of cards, keeping the grid to 3 columns like the design always had.
  const monthlyPlans = (allPlans ?? []).filter((p) => p.billingInterval === 'Monthly');
  const yearlyByName = new Map((allPlans ?? []).filter((p) => p.billingInterval === 'Yearly').map((p) => [p.name, p]));

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`pricing mf-section${visible ? ' pricing--visible' : ''}`}
      aria-label="Pricing"
      id="pricing"
    >
      <div className="pricing__inner mf-section__inner">
        <div className="pricing__intro">
          <p className="mf-eyebrow">Pricing</p>
          <h2 className="pricing__headline mf-headline">Plans that grow with your store.</h2>
          <p className="mf-subtext pricing__subtext">
            Start with a managed website, move to full self-service with AI when you're ready —
            every plan includes a real storefront, and every tier up unlocks more of what runs it.
          </p>
        </div>

        {isLoading ? (
          <p className="pricing__note">Loading plans…</p>
        ) : isError || monthlyPlans.length === 0 ? (
          <p className="pricing__note">Couldn't load plans right now. Please try again shortly.</p>
        ) : (
          <div className="pricing__grid">
            {monthlyPlans.map((plan, i) => {
              const yearlyPlan = yearlyByName.get(plan.name);
              const highlighted = plan.name === 'Growth';
              const ctaHref = isOwner
                ? `${routes.DASHBOARD_BILLING}?plan=${plan.id}`
                : buildPlanDetailRoute(plan.id);

              return (
                <article
                  key={plan.id}
                  className={`pricing__card${highlighted ? ' pricing__card--highlighted' : ''}`}
                  style={withDelay(i * 0.12)}
                >
                  {highlighted && <span className="pricing__ribbon">Most popular</span>}

                  <h3 className="pricing__name">{plan.name}</h3>
                  <p className="pricing__tagline">{plan.description}</p>

                  <div className="pricing__price-row">
                    <span className="pricing__price">{currencyFormatter(plan.currency).format(plan.price)}</span>
                    <span className="pricing__cadence">/ month</span>
                  </div>

                  {yearlyPlan && (
                    <p className="pricing__yearly-note">
                      Or {currencyFormatter(yearlyPlan.currency).format(yearlyPlan.price / 12)}/mo billed yearly
                    </p>
                  )}

                  <ul className="pricing__features">
                    {plan.features.map((feature) => (
                      <li key={feature.featureKey} className="pricing__feature">
                        <span className="pricing__feature-check" aria-hidden="true">
                          ✓
                        </span>
                        {feature.featureName}
                        {feature.limit != null && ` (up to ${feature.limit})`}
                      </li>
                    ))}
                  </ul>

                  {isOwner ? (
                    <a href={ctaHref} className={`mf-btn pricing__cta ${highlighted ? 'mf-btn--primary' : 'mf-btn--secondary'}`}>
                      Choose {plan.name}
                    </a>
                  ) : (
                    <Link to={ctaHref} className={`mf-btn pricing__cta ${highlighted ? 'mf-btn--primary' : 'mf-btn--secondary'}`}>
                      View plan
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
        )}

        <p className="pricing__note">Need something bigger? Contact us about a custom plan.</p>
      </div>
    </section>
  );
}
