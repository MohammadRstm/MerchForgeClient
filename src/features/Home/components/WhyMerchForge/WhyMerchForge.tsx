import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './WhyMerchForge.css';

interface Reason {
  title: string;
  description: string;
}

const REASONS: Reason[] = [
  {
    title: 'No tedious forms',
    description: 'Create a product by sending a photo and describing it — nothing to fill in by hand.',
  },
  {
    title: 'Understands you naturally',
    description: "Text, images, or voice — MerchForge reads it the way you'd explain it to a person.",
  },
  {
    title: 'One place for everything',
    description: 'Products, conversations, and channels live in a single catalog, not scattered apps.',
  },
  {
    title: 'Less repetitive work',
    description: 'The parts of running a store that repeat themselves are the parts MerchForge automates first.',
  },
];

function withDelay(seconds: number): CSSProperties {
  return { '--delay': `${seconds}s` } as CSSProperties;
}

export default function WhyMerchForge() {
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
      className={`why${visible ? ' why--visible' : ''}`}
      aria-label="Why MerchForge"
      id="why-merchforge"
    >
      <div className="why__inner">
        <div className="why__intro">
          <p className="why__eyebrow">Why MerchForge</p>
          <h2 className="why__headline">Built around the way merchants actually work.</h2>
        </div>

        <ul className="why__row">
          {REASONS.map((reason, i) => (
            <li key={reason.title} className="why__item" style={withDelay(i * 0.1)}>
              <h3 className="why__item-title">{reason.title}</h3>
              <p className="why__item-description">{reason.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}