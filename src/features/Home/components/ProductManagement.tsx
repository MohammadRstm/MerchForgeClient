import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './ProductManagement.css';

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
  { name: 'Leather Crossbody Bag', category: 'Accessories', price: '$95', status: 'Active', swatch: '#8b5e3c' },
  { name: 'Ribbed Knit Beanie', category: 'Accessories', price: '$22', status: 'Out of stock', swatch: '#6b6f76' },
];

const STATUS_STYLE: Record<Status, string> = {
  Active: 'active',
  Draft: 'draft',
  'Out of stock': 'out',
};

function withDelay(seconds: number): CSSProperties {
  return { '--delay': `${seconds}s` } as CSSProperties;
}

export default function ProductManagement() {
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
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`catalog${visible ? ' catalog--visible' : ''}`}
      aria-label="Product management"
      id="product-management"
    >
      <div className="catalog__inner">
        <div className="catalog__intro">
          <p className="catalog__eyebrow">Product management</p>
          <h2 className="catalog__headline">One place for every product.</h2>
          <p className="catalog__subtext">
            However a product was created, it lands in the same catalog — so you can manage
            everything from a single screen instead of juggling apps.
          </p>
        </div>

        <div className="catalog__panel">
          <div className="catalog__toolbar">
            <div className="catalog__search">
              <span className="catalog__search-icon" aria-hidden="true" />
              <span className="catalog__search-placeholder">Search products</span>
            </div>
            <span className="catalog__filter-chip">All categories</span>
            <button type="button" className="catalog__add-btn">
              Add product
            </button>
          </div>

          <div className="catalog__table" role="table" aria-label="Product catalog">
            <div className="catalog__row catalog__row--head" role="row">
              <span role="columnheader">Product</span>
              <span role="columnheader">Category</span>
              <span role="columnheader">Price</span>
              <span role="columnheader">Status</span>
              <span role="columnheader" className="catalog__col-actions">
                Actions
              </span>
            </div>

            {CATALOG.map((item, i) => (
              <div
                key={item.name}
                className="catalog__row"
                role="row"
                style={withDelay(0.12 + i * 0.08)}
              >
                <span className="catalog__cell catalog__cell--product" role="cell">
                  <span className="catalog__thumb" style={{ background: item.swatch }} aria-hidden="true" />
                  {item.name}
                </span>
                <span className="catalog__cell" role="cell">
                  {item.category}
                </span>
                <span className="catalog__cell" role="cell">
                  {item.price}
                </span>
                <span className="catalog__cell" role="cell">
                  <span className={`catalog__status catalog__status--${STATUS_STYLE[item.status]}`}>
                    {item.status}
                  </span>
                </span>
                <span className="catalog__cell catalog__col-actions" role="cell">
                  <button type="button" className="catalog__row-action" aria-label={`Edit ${item.name}`}>
                    Edit
                  </button>
                  <button type="button" className="catalog__row-action catalog__row-action--more" aria-label={`More actions for ${item.name}`}>
                    •••
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}