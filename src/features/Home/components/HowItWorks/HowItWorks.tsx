import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './HowItWorks.css';

interface Step {
  number: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Upload',
    description: 'Send a product photo from your dashboard, Telegram, or WhatsApp.',
  },
  {
    number: '02',
    title: 'Add information & colors',
    description: 'Describe it by voice or text, and pick which colors it comes in.',
  },
  {
    number: '03',
    title: 'AI generates & edits',
    description: 'MerchForge writes the listing and generates every angle and color.',
  },
  {
    number: '04',
    title: 'Review',
    description: 'Check what MerchForge produced and adjust anything you like.',
  },
  {
    number: '05',
    title: 'Publish',
    description: 'One move, and it is live in your catalog and on every channel.',
  },
];

function withDelay(seconds: number): CSSProperties {
  return { '--delay': `${seconds}s` } as CSSProperties;
}

export default function HowItWorks() {
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
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`how mf-section${visible ? ' how--visible' : ''}`}
      aria-label="How MerchForge works"
      id="how-it-works"
    >
      <div className="how__inner mf-section__inner">
        <p className="mf-eyebrow">How it works</p>
        <h2 className="how__headline mf-headline">From a photo to a published product.</h2>

        <div className="how__rail" aria-hidden="true">
          <div className="how__rail-fill" />
        </div>

        <ol className="how__steps">
          {STEPS.map((step, i) => (
            <li key={step.number} className="how__step" style={withDelay(0.15 + i * 0.12)}>
              <span className="how__step-dot" style={withDelay(0.1 + i * 0.12)} />
              <span className="how__step-number mf-index">{step.number}</span>
              <h3 className="how__step-title">{step.title}</h3>
              <p className="how__step-description">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
