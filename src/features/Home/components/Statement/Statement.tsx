import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './Statement.css';

const PROBLEMS: string[] = [
  'Every listing needs a title, a description, and pricing typed in by hand',
  'Product photos need to be prepped before they can go live',
  'Customers ask the same questions in different chats, over and over',
  'Promoting a product means repeating the same work on every platform',
  'Orders and order details live across texts, notes, and spreadsheets',
];

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

/**
 * The page's one big editorial statement — eloqwnt's "Who we are" analog.
 * Merges what used to be two separate sections (Problem, WhyMerchForge) into
 * a single block: the reality merchants live with, then why MerchForge is
 * built the way it is.
 */
export default function Statement() {
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
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`statement mf-section${visible ? ' statement--visible' : ''}`}
      aria-label="Why MerchForge exists"
    >
      <div className="statement__inner mf-section__inner">
        <p className="mf-eyebrow">The reality for most merchants</p>
        <h2 className="statement__headline mf-headline">
          Running a store shouldn't mean doing everything manually.
        </h2>

        <ul className="statement__list">
          {PROBLEMS.map((problem, i) => (
            <li key={problem} className="statement__item" style={withDelay(i * 0.06)}>
              <span className="statement__item-mark" aria-hidden="true" />
              <span className="statement__item-text">{problem}</span>
            </li>
          ))}
        </ul>

        <p className="statement__transition" style={withDelay(PROBLEMS.length * 0.06 + 0.1)}>
          MerchForge brings all of it into one place — and automates the parts that shouldn't need you.
        </p>

        <hr className="mf-divider statement__divider" />

        <ul className="statement__reasons">
          {REASONS.map((reason, i) => (
            <li key={reason.title} className="statement__reason" style={withDelay(0.2 + i * 0.08)}>
              <h3 className="statement__reason-title">{reason.title}</h3>
              <p className="statement__reason-description">{reason.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
