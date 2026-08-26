import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router';
import { routes } from '../../../../config/routes';
import BlackHoodieImage from '../../../../assets/Landing/Landing__AiProductCreation__blackHoodie.jpg';
import AngleFront from '../../../../assets/Landing/Landing__Showcase__angle-front.jpg';
import AngleBack from '../../../../assets/Landing/Landing__Showcase__angle-back.jpg';
import AngleLeft from '../../../../assets/Landing/Landing__Showcase__angle-left.jpg';
import AngleThreeQuarter from '../../../../assets/Landing/Landing__Showcase__angle-threequarter.jpg';
import './Showcase.css';

const UNDERSTOOD_FIELDS = ['Name', 'Description', 'Price', 'Sizes', 'Colors', 'Brand'];
const OUTPUT_TAGS = ['M', 'L', 'XL', 'Cotton blend'];

type Status = 'Active' | 'Draft' | 'Out of stock';

interface CatalogRow {
  name: string;
  category: string;
  price: string;
  status: Status;
  swatch: string;
}

const CATALOG: CatalogRow[] = [
  { name: 'Classic Black Hoodie', category: 'Apparel', price: '$45', status: 'Active', swatch: '#2b2b2e' },
  { name: 'Premium Linen Shirt', category: 'Apparel', price: '$68', status: 'Draft', swatch: '#d9cbb8' },
  { name: 'Urban Sneakers', category: 'Footwear', price: '$120', status: 'Active', swatch: '#e8e4dd' },
];

const STATUS_STYLE: Record<Status, string> = {
  Active: 'active',
  Draft: 'draft',
  'Out of stock': 'out',
};

const ANGLE_IMAGES = [
  { src: AngleFront, label: 'Front' },
  { src: AngleBack, label: 'Back' },
  { src: AngleLeft, label: 'Left side' },
  { src: AngleThreeQuarter, label: 'Three-quarter' },
];

function withDelay(seconds: number): CSSProperties {
  return { '--delay': `${seconds}s` } as CSSProperties;
}

/**
 * eloqwnt's "Selected Work" analog. MerchForge has no client case studies or
 * testimonials yet, so — rather than inventing either — this shows off
 * MerchForge's own dashboard and AI features instead, in the same project-
 * card shape (tag, title, description, a fact row, "Explore"). The angle
 * images in the third card are real output from the actual multi-angle
 * generation feature, not a mockup.
 */
export default function Showcase() {
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
      className={`showcase mf-section${visible ? ' showcase--visible' : ''}`}
      aria-label="MerchForge in action"
      id="showcase"
    >
      <div className="showcase__inner mf-section__inner">
        <p className="mf-eyebrow">MerchForge in action</p>
        <h2 className="showcase__headline mf-headline">
          One system. Every part of running a store.
        </h2>

        <div className="showcase__list">
          {/* ---------- Card 1: Dashboard ---------- */}
          <article className="showcase__card" style={withDelay(0)}>
            <div className="showcase__card-copy">
              <span className="showcase__tag">Owner dashboard</span>
              <h3 className="showcase__card-title">Central management</h3>
              <p className="showcase__card-description">
                Every product, every team member, every conversation — in one dashboard instead of
                scattered apps and spreadsheets.
              </p>
              <ul className="showcase__facts">
                <li>Full catalog</li>
                <li>Team access</li>
                <li>Live analytics</li>
              </ul>
              <Link to={routes.LOGIN} className="showcase__explore">
                Explore →
              </Link>
            </div>

            <div className="showcase__card-visual">
              <div className="mock-panel">
                <div className="mock-panel__toolbar">
                  <span className="mock-panel__search">Search products</span>
                  <span className="mock-panel__filter">All categories</span>
                </div>
                <div className="mock-panel__table" role="table" aria-label="Product catalog preview">
                  <div className="mock-panel__row mock-panel__row--head" role="row">
                    <span role="columnheader">Product</span>
                    <span role="columnheader">Price</span>
                    <span role="columnheader">Status</span>
                  </div>
                  {CATALOG.map((item) => (
                    <div key={item.name} className="mock-panel__row" role="row">
                      <span className="mock-panel__cell mock-panel__cell--product" role="cell">
                        <span className="mock-panel__thumb" style={{ background: item.swatch }} aria-hidden="true" />
                        {item.name}
                      </span>
                      <span className="mock-panel__cell" role="cell">
                        {item.price}
                      </span>
                      <span className="mock-panel__cell" role="cell">
                        <span className={`mock-panel__status mock-panel__status--${STATUS_STYLE[item.status]}`}>
                          {item.status}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* ---------- Card 2: AI Product Creation ---------- */}
          <article className="showcase__card showcase__card--reverse" style={withDelay(0.1)}>
            <div className="showcase__card-copy">
              <span className="showcase__tag">AI product creation</span>
              <h3 className="showcase__card-title">A photo and a voice note become a listing</h3>
              <p className="showcase__card-description">
                No forms to fill out. Send a photo and describe it out loud or in a message —
                MerchForge writes the listing for you.
              </p>
              <div className="showcase__understood">
                <span className="showcase__understood-label">MerchForge understands:</span>
                <div className="showcase__understood-tags">
                  {UNDERSTOOD_FIELDS.map((field) => (
                    <span key={field} className="showcase__understood-tag">
                      {field}
                    </span>
                  ))}
                </div>
              </div>
              <ul className="showcase__facts">
                <li>3 channels</li>
                <li>Seconds, not forms</li>
                <li>1 photo + voice</li>
              </ul>
              <Link to={routes.LOGIN} className="showcase__explore">
                Explore →
              </Link>
            </div>

            <div
              className="showcase__card-visual creation__pipeline"
              role="img"
              aria-label="A product photo and a voice note are sent to MerchForge AI, which produces a finished product listing for a black hoodie"
            >
              <div className="creation__inputs">
                <div className="creation__bubble creation__bubble--photo">
                  <img src={BlackHoodieImage} alt="" className="creation__photo-swatch" />
                  <span className="creation__bubble-label">Product photo</span>
                </div>

                <div className="creation__bubble creation__bubble--voice">
                  <span className="creation__waveform" aria-hidden="true">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <span key={i} className="creation__wave-bar" style={{ '--bar': i } as CSSProperties} />
                    ))}
                  </span>
                  <p className="creation__transcript">
                    "Black hoodie, forty-five dollars, sizes medium through extra large, cotton blend."
                  </p>
                </div>
              </div>

              <div className="creation__connector" aria-hidden="true">
                <span className="creation__connector-line" />
                <span className="creation__ai-node">MerchForge AI</span>
                <span className="creation__connector-line" />
              </div>

              <div className="creation__output">
                <div className="creation__listing">
                  <img src={BlackHoodieImage} alt="Classic Black Hoodie" className="creation__listing-image" />
                  <div className="creation__listing-body">
                    <span className="creation__listing-name">Classic Black Hoodie</span>
                    <span className="creation__listing-price">$45</span>
                    <p className="creation__listing-description">
                      A relaxed-fit hoodie in soft cotton blend fleece, built for everyday wear.
                    </p>
                    <div className="creation__listing-tags">
                      {OUTPUT_TAGS.map((tag) => (
                        <span key={tag} className="creation__listing-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* ---------- Card 3: AI Image Generation ---------- */}
          <article className="showcase__card" style={withDelay(0.2)}>
            <div className="showcase__card-copy">
              <span className="showcase__tag">AI image generation</span>
              <h3 className="showcase__card-title">One photo, every angle</h3>
              <p className="showcase__card-description">
                Pick the angles or colors you need — MerchForge generates each one from the product
                you already photographed. These are real, unedited results from the feature.
              </p>
              <ul className="showcase__facts">
                <li>4 angles</li>
                <li>4 colors</li>
                <li>Generated concurrently</li>
              </ul>
              <Link to={routes.LOGIN} className="showcase__explore">
                Explore →
              </Link>
            </div>

            <div
              className="showcase__card-visual showcase__angle-grid"
              role="img"
              aria-label="The same white t-shirt shown from the front, back, left side, and a three-quarter angle, all generated by MerchForge AI from the original front photo"
            >
              {ANGLE_IMAGES.map((angle) => (
                <figure key={angle.label} className="showcase__angle-tile">
                  <img src={angle.src} alt={`${angle.label} view, AI-generated`} loading="lazy" />
                  <figcaption>{angle.label}</figcaption>
                </figure>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
