import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router';
import './Pricing.css';
import { routes, buildPlanDetailRoute } from '../../../../config/routes';
import useAuth from '../../../../context/Auth/useAuth';
import usePublicSubscriptionPlans from '../../../Plans/hooks/usePublicSubscriptionPlans';
import { resolvePrice, summarisePlans, type Interval } from './pricingIntervals';

function withDelay(seconds: number): CSSProperties {
  return { '--delay': `${seconds}s` } as CSSProperties;
}

const currencyFormatter = (currency: string) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 });

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [interval, setInterval] = useState<Interval>('Monthly');

  const { session } = useAuth();
  const isOwner = session?.business?.role === 'Owner';

  const { data: allPlans, isLoading, isError } = usePublicSubscriptionPlans();

  // Monthly is the canonical list: it sets the order and the tier names, and the
  // yearly equivalent is looked up against it. Deriving the columns from
  // whichever interval is selected would let the tiers reorder as you toggle.
  // The arithmetic lives in pricingIntervals.ts, where it is unit tested — a
  // wrong saving is a number a merchant plans against.
  const { monthlyPlans, yearlyByName, bestSaving } = useMemo(
    () => summarisePlans(allPlans),
    [allPlans],
  );

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

        {/* Was a footnote under every price. A control states the choice once and
            lets the whole table answer to it. */}
        {monthlyPlans.length > 0 && yearlyByName.size > 0 && (
          <div className="pricing__interval" role="group" aria-label="Billing interval">
            {(['Monthly', 'Yearly'] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={interval === option}
                className={`pricing__interval-option${interval === option ? ' is-active' : ''}`}
                onClick={() => setInterval(option)}
              >
                {option}
                {option === 'Yearly' && bestSaving > 0 && (
                  <span className="pricing__interval-saving">save up to {bestSaving}%</span>
                )}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <p className="pricing__note">Loading plans…</p>
        ) : isError || monthlyPlans.length === 0 ? (
          <p className="pricing__note">Couldn't load plans right now. Please try again shortly.</p>
        ) : (
          <div className="pricing__grid">
            {monthlyPlans.map((plan, i) => {
              const { source, perMonth, saving, showYearly } = resolvePrice(
                plan,
                yearlyByName.get(plan.name),
                interval,
              );

              const highlighted = plan.name === 'Growth';
              const ctaHref = isOwner
                ? `${routes.DASHBOARD_BILLING}?plan=${source.id}`
                : buildPlanDetailRoute(source.id);

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
                    <span className="pricing__price">
                      {currencyFormatter(source.currency).format(perMonth)}
                    </span>
                    <span className="pricing__cadence">/ month</span>
                  </div>

                  <p className="pricing__billed">
                    {showYearly
                      ? `Billed yearly${saving > 0 ? ` · save ${saving}%` : ''}`
                      : 'Billed monthly'}
                  </p>

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

        {/* The second half of the billing model, which the table alone implies is
            not there. Deliberately carries no prices: nothing public exposes what
            a credit costs, and inventing one here would be a number a merchant
            could plan against. */}
        <aside className="pricing__credits">
          <h3 className="pricing__credits-title">AI is bought separately, as credits</h3>
          <p className="pricing__credits-body">
            Product creation, image editing and generation run on credits rather than on your
            subscription — so a quiet month costs you nothing extra, and a busy one does not mean
            moving up a tier you do not otherwise need. Each plan's page lists what it comes with.
          </p>
        </aside>

        <p className="pricing__note">Need something bigger? Contact us about a custom plan.</p>
      </div>
    </section>
  );
}
