import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './Pricing.css';

interface Plan {
  id: 'starter' | 'growth' | 'business';
  name: string;
  price?: string;
  cadence?: string;
  tagline: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  comingSoon?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$50',
    cadence: '/ year',
    tagline: 'Core tools to manage your catalog.',
    features: ['Up to 50 products', 'Central product catalog', 'Core product management'],
    cta: 'Get Started',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$200',
    cadence: '/ year',
    tagline: 'AI product creation and customer conversations.',
    features: [
      'Up to 200 products',
      'Telegram product creation',
      'WhatsApp AI assistant',
      'AI-powered product generation',
      'AI usage allowance included',
    ],
    cta: 'Get Started',
    highlighted: true,
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'Higher volume and features built around your business.',
    features: ['Custom product limits', 'Custom feature set', 'Priority support'],
    cta: 'Talk to us',
    comingSoon: true,
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
      className={`pricing${visible ? ' pricing--visible' : ''}`}
      aria-label="Pricing"
      id="pricing"
    >
      <div className="pricing__inner">
        <div className="pricing__intro">
          <p className="pricing__eyebrow">Pricing</p>
          <h2 className="pricing__headline">Plans that grow with your store.</h2>
          <p className="pricing__subtext">
            Start with the essentials, add AI when you're ready — or talk to us about a plan
            built around what you actually need.
          </p>
        </div>

        <div className="pricing__grid">
          {PLANS.map((plan, i) => (
            <article
              key={plan.id}
              className={`pricing__card${plan.highlighted ? ' pricing__card--highlighted' : ''}${
                plan.comingSoon ? ' pricing__card--soon' : ''
              }`}
              style={withDelay(i * 0.12)}
            >
              {plan.highlighted && <span className="pricing__ribbon">Most popular</span>}
              {plan.comingSoon && <span className="pricing__ribbon pricing__ribbon--soon">Coming soon</span>}

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

              <a
                href={plan.comingSoon ? '#contact' : '#get-started'}
                className={`pricing__cta${plan.highlighted ? ' pricing__cta--primary' : ''}`}
              >
                {plan.cta}
              </a>
            </article>
          ))}
        </div>

        <p className="pricing__note">Custom plans are available for growing businesses.</p>
      </div>
    </section>
  );
}