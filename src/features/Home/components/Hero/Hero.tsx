import { useEffect, useState, type CSSProperties } from 'react';
import { Link } from 'react-router';
import HeroBackdrop from './HeroBackdrop';
import HeroShowcase from './HeroShowcase';
import { routes } from '../../../../config/routes';
import './Hero.css';

function withDelay(seconds: number): CSSProperties {
  return { '--delay': `${seconds}s` } as CSSProperties;
}

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className={`hero${loaded ? ' hero--loaded' : ''}`} aria-label="MerchForge introduction">
      <HeroBackdrop />

      <div className="hero__inner">
        <div className="hero__content">
          <p className="hero__eyebrow" style={withDelay(0)}>
            Product operations, powered by AI
          </p>
          <h1 className="hero__headline" style={withDelay(0.08)}>
            Your products. Your customers.
            <br />
            Your growth — <span className="hero__headline-accent">automated</span>.
          </h1>
          <p className="hero__subtext" style={withDelay(0.16)}>
            MerchForge gives you one place to create, manage, and sell your products —
            powered by AI that turns a photo and a voice note into a finished listing.
          </p>
          <div className="hero__actions" style={withDelay(0.24)}>
            <Link to={routes.CONTACT} className="hero__btn hero__btn--primary">
              Start Creating
            </Link>
            <a href="#studio" className="hero__btn hero__btn--secondary">
              See how it works
            </a>
          </div>
        </div>

        <div className="hero__visual" style={withDelay(0.32)}>
          <HeroShowcase />
        </div>
      </div>
    </section>
  );
}
