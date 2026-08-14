import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './Problem.css';

const PROBLEMS: string[] = [
  'Every listing needs a title, a description, and pricing typed in by hand',
  'Product photos need to be prepped before they can go live',
  'Customers ask the same questions in different chats, over and over',
  'Promoting a product means repeating the same work on every platform',
  'Orders and order details live across texts, notes, and spreadsheets',
];

function withDelay(seconds: number): CSSProperties {
  return { '--delay': `${seconds}s` } as CSSProperties;
}

export default function Problem() {
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
      className={`problem${visible ? ' problem--visible' : ''}`}
      aria-label="The problem MerchForge solves"
    >
      <div className="problem__inner">
        <div className="problem__intro">
          <p className="problem__eyebrow">The reality for most merchants</p>
          <h2 className="problem__headline">Running a store shouldn't mean doing everything manually.</h2>
          <p className="problem__subtext">
            Between listings, messages, and promotion, most of a merchant's day goes to repeating the
            same small tasks — one product at a time.
          </p>
        </div>

        <ul className="problem__list">
          {PROBLEMS.map((problem, i) => (
            <li key={problem} className="problem__item" style={withDelay(i * 0.08)}>
              <span className="problem__item-mark" aria-hidden="true" />
              <span className="problem__item-text">{problem}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="problem__transition" style={withDelay(PROBLEMS.length * 0.08 + 0.1)}>
        MerchForge brings all of it into one place — and automates the parts that shouldn't need you.
      </p>
    </section>
  );
}