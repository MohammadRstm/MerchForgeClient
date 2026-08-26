import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './MerchantBenefits.css';

interface Benefit {
  number: string;
  title: string;
  description: string;
}

const BENEFITS: Benefit[] = [
  {
    number: '01',
    title: 'Create products faster',
    description: 'What used to take a form and a photo editor now takes a photo and a sentence.',
  },
  {
    number: '02',
    title: 'Professional visuals, no photoshoot',
    description: 'Every angle and color your customers want to see, generated from what you already have.',
  },
  {
    number: '03',
    title: 'Variants without the extra work',
    description: 'Adding a new color used to mean a new photoshoot. Now it means picking a color.',
  },
  {
    number: '04',
    title: 'Everything organized in one place',
    description: 'Product details stay structured and consistent, however the product was created.',
  },
  {
    number: '05',
    title: 'Publish efficiently',
    description: 'Review what MerchForge generated, then publish it everywhere you sell in one move.',
  },
];

function withDelay(seconds: number): CSSProperties {
  return { '--delay': `${seconds}s` } as CSSProperties;
}

export default function MerchantBenefits() {
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
      className={`benefits mf-section${visible ? ' benefits--visible' : ''}`}
      aria-label="Why merchants use MerchForge"
    >
      <div className="benefits__inner mf-section__inner">
        <p className="mf-eyebrow">Why it matters</p>
        <h2 className="benefits__headline mf-headline">Built around the business, not just the tech.</h2>

        <ol className="benefits__list">
          {BENEFITS.map((benefit, i) => (
            <li key={benefit.number} className="benefits__row" style={withDelay(i * 0.06)}>
              <span className="benefits__number mf-index">{benefit.number}</span>
              <h3 className="benefits__row-title">{benefit.title}</h3>
              <p className="benefits__row-description">{benefit.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
