import { useEffect, useRef, useState } from 'react';
import './FinalCTA.css';

export default function FinalCTA() {
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
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`final-cta${visible ? ' final-cta--visible' : ''}`} aria-label="Get started with MerchForge" id="get-started">
      <div className="final-cta__inner">
        <h2 className="final-cta__headline">
          Spend less time managing your store.
          <br />
          More time growing it.
        </h2>
        <p className="final-cta__subtext">
          Set up your catalog and start creating products with AI in minutes.
        </p>
        <div className="final-cta__actions">
          <a href="#get-started" className="final-cta__btn final-cta__btn--primary">
            Get Started
          </a>
          <a href="#features" className="final-cta__btn final-cta__btn--secondary">
            Explore MerchForge
          </a>
        </div>
      </div>
    </section>
  );
}