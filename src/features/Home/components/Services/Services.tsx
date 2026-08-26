import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './Services.css';

type Availability = 'Available now' | 'Coming soon';

interface ServiceRow {
  number: string;
  title: string;
  description: string;
  availability: Availability;
}

const SERVICES: ServiceRow[] = [
  {
    number: '01',
    title: 'AI product creation',
    description: 'Send a photo and describe it by voice or text — MerchForge writes the listing.',
    availability: 'Available now',
  },
  {
    number: '02',
    title: 'AI image editing',
    description: 'Generate every angle and color of a product from a single photo.',
    availability: 'Available now',
  },
  {
    number: '03',
    title: 'Telegram assistant',
    description: 'Create and manage products directly from a Telegram conversation.',
    availability: 'Available now',
  },
  {
    number: '04',
    title: 'WhatsApp assistant',
    description: "Answers customer questions in real time, using your catalog as its source of truth.",
    availability: 'Available now',
  },
  {
    number: '05',
    title: 'Website assistant',
    description: "A chat widget that helps customers find products and get answers — even while you're away.",
    availability: 'Available now',
  },
  {
    number: '06',
    title: 'Central catalog & team dashboard',
    description: 'Every product and every team member managed from a single screen, however it was created.',
    availability: 'Available now',
  },
  {
    number: '07',
    title: 'Social media',
    description: 'Turn an existing product into ready-to-post content for Instagram, Facebook, and TikTok.',
    availability: 'Coming soon',
  },
];

interface Step {
  number: string;
  title: string;
}

const STEPS: Step[] = [
  { number: '01', title: 'Send a photo, voice note, or text' },
  { number: '02', title: 'MerchForge reads, listens, and extracts' },
  { number: '03', title: 'A structured product, ready to review' },
  { number: '04', title: 'Publish to your catalog in one move' },
];

function withDelay(seconds: number): CSSProperties {
  return { '--delay': `${seconds}s` } as CSSProperties;
}

/**
 * eloqwnt's numbered services list. Absorbs AiServices + ProductManagement +
 * HowItWorks into one condensed list, with the old step-by-step flow kept
 * as a compact strip underneath rather than its own section.
 */
export default function Services() {
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
      { threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`services mf-section${visible ? ' services--visible' : ''}`}
      aria-label="What MerchForge does"
      id="services"
    >
      <div className="services__inner mf-section__inner">
        <p className="mf-eyebrow">What MerchForge does</p>
        <h2 className="services__headline mf-headline">
          Everything a growing store needs, in one system.
        </h2>

        <ol className="services__list">
          {SERVICES.map((service, i) => (
            <li key={service.number} className="services__row" style={withDelay(i * 0.05)}>
              <span className="services__number mf-index">{service.number}</span>
              <div className="services__row-copy">
                <h3 className="services__row-title">{service.title}</h3>
                <p className="services__row-description">{service.description}</p>
              </div>
              <span
                className={`services__badge${
                  service.availability === 'Coming soon' ? ' services__badge--soon' : ''
                }`}
              >
                {service.availability}
              </span>
            </li>
          ))}
        </ol>

        <div className="services__flow">
          <p className="services__flow-label">From a message to a finished product</p>
          <ol className="services__flow-steps">
            {STEPS.map((step, i) => (
              <li key={step.number} className="services__flow-step" style={withDelay(0.4 + i * 0.08)}>
                <span className="services__flow-number mf-index">{step.number}</span>
                <span className="services__flow-title">{step.title}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
