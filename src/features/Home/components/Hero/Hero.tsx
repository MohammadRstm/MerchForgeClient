import { useEffect, useState, type CSSProperties } from 'react';
import './Hero.css';

type ProductStatus = 'ready' | 'draft' | 'generating';

interface Product {
  id: string;
  name: string;
  price: string;
  status: ProductStatus;
  swatch: string;
}

interface Source {
  id: 'telegram' | 'whatsapp' | 'website';
  label: string;
}

const PRODUCTS: Product[] = [
  { id: 'hoodie', name: 'Classic Black Hoodie', price: '$45', status: 'ready', swatch: '#2B2B2E' },
  { id: 'shirt', name: 'Premium Linen Shirt', price: '$68', status: 'draft', swatch: '#D9CBB8' },
  { id: 'sneakers', name: 'Urban Sneakers', price: '$120', status: 'ready', swatch: '#E8E4DD' },
  { id: 'bag', name: 'Leather Crossbody Bag', price: '$95', status: 'generating', swatch: '#8B5E3C' },
];

const SOURCES: Source[] = [
  { id: 'telegram', label: 'Telegram' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'website', label: 'Website' },
];

const STATUS_LABEL: Record<ProductStatus, string> = {
  ready: 'In stock',
  draft: 'Draft',
  generating: 'Generating…',
};

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
            <a href="#get-started" className="hero__btn hero__btn--primary">
              Get Started
            </a>
            <a href="#how-it-works" className="hero__btn hero__btn--secondary">
              Explore Features
            </a>
          </div>
        </div>

        <div
          className="hero__visual"
          role="img"
          aria-label="MerchForge dashboard assembling a product catalog from messages sent through Telegram, WhatsApp, and the merchant's website"
        >
          <div className="hero__sources">
            {SOURCES.map((source, i) => (
              <div key={source.id} className="hero__source-chip" style={withDelay(0.3 + i * 0.12)}>
                <span className={`hero__source-dot hero__source-dot--${source.id}`} aria-hidden="true" />
                {source.label}
              </div>
            ))}
          </div>

          <svg className="hero__flow" viewBox="0 0 100 220" preserveAspectRatio="none" aria-hidden="true">
            <path className="hero__flow-path" d="M2 20 C 55 20, 45 110, 98 110" />
            <path className="hero__flow-path" d="M2 110 C 55 110, 55 110, 98 110" />
            <path className="hero__flow-path" d="M2 200 C 55 200, 45 110, 98 110" />
          </svg>

          <div className="hero__dashboard" style={withDelay(0.42)}>
            <div className="hero__dashboard-header">
              <span className="hero__dashboard-title">Products</span>
              <span className="hero__dashboard-count">{PRODUCTS.length} items</span>
            </div>
            <ul className="hero__product-grid">
              {PRODUCTS.map((product, i) => (
                <li
                  key={product.id}
                  className={`hero__product-card hero__product-card--${product.status}`}
                  style={withDelay(0.55 + i * 0.1)}
                >
                  <span className="hero__product-thumb" style={{ background: product.swatch }} aria-hidden="true" />
                  <div className="hero__product-info">
                    <span className="hero__product-name">{product.name}</span>
                    <span className="hero__product-price">{product.price}</span>
                  </div>
                  <span className={`hero__product-status hero__product-status--${product.status}`}>
                    {STATUS_LABEL[product.status]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}