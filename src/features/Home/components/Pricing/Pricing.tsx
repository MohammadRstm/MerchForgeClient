import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './Pricing.css';

interface Plan {
  id: 'standard' | 'premium' | 'custom';
  name: string;
  price?: string;
  cadence?: string;
  tagline: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  inert?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'standard',
    name: 'Standard',
    price: '$100',
    cadence: '/ year',
    tagline: 'A responsive website, managed for you.',
    features: [
      'Responsive website',
      'Free NFC card for Google reviews',
      'Website managed by MerchForge — contact us to add or edit products',
    ],
    cta: 'Get Started',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$500',
    cadence: '/ year',
    tagline: 'A fully self-managed store with AI built in.',
    features: [
      'Fully responsive website, self-managed',
      'Owner dashboard & central management system',
      '200 image credits',
      '300 voice-to-text credits',
      'Free NFC card for Google reviews',
    ],
    cta: 'Get Started',
    highlighted: true,
  },
  {
    id: 'custom',
    name: 'Custom',
    tagline: 'Higher volume and features built around your business.',
    features: ['Custom limits', 'Custom feature set', 'Priority support'],
    cta: 'Contact us',
    inert: true,
  },
];

function withDelay(seconds: number): CSSProperties {
  return { '--delay': `${seconds}s` } as CSSProperties;
}

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

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
            or talk to us about a plan built around what you actually need.
          </p>
        </div>

        <div className="pricing__grid">
          {PLANS.map((plan, i) => (
            <article
              key={plan.id}
              className={`pricing__card${plan.highlighted ? ' pricing__card--highlighted' : ''}`}
              style={withDelay(i * 0.12)}
            >
              {plan.highlighted && <span className="pricing__ribbon">Most popular</span>}

              <h3 className="pricing__name">{plan.name}</h3>
              <p className="pricing__tagline">{plan.tagline}</p>

              <div className="pricing__price-row">
                {plan.price ? (
                  <>
                    <span className="pricing__price">{plan.price}</span>
                    <span className="pricing__cadence">{plan.cadence}</span>
                  </>
                ) : (
                  <span className="pricing__price pricing__price--custom">Custom</span>
                )}
              </div>

              <ul className="pricing__features">
                {plan.features.map((feature) => (
                  <li key={feature} className="pricing__feature">
                    <span className="pricing__feature-check" aria-hidden="true">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.inert ? (
                <button
                  type="button"
                  className="mf-btn mf-btn--secondary pricing__cta pricing__cta--inert"
                  disabled
                  title="Contact channel coming soon"
                >
                  {plan.cta}
                </button>
              ) : (
                <a
                  href="#get-started"
                  className={`mf-btn pricing__cta ${plan.highlighted ? 'mf-btn--primary' : 'mf-btn--secondary'}`}
                >
                  {plan.cta}
                </a>
              )}
            </article>
          ))}
        </div>

        <p className="pricing__note">Custom plans are available for growing businesses.</p>
      </div>
    </section>
  );
}
