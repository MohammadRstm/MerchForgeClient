import { useEffect, useRef, useState, type CSSProperties } from 'react';
import BlackHoodieImage from '../../../../assets/Landing/Landing__AiProductCreation__blackHoodie.jpg';
import './AiProductCreation.css';

const UNDERSTOOD_FIELDS = ['Name', 'Description', 'Price', 'Sizes', 'Colors', 'Brand'];

const OUTPUT_TAGS = ['M', 'L', 'XL', 'Cotton blend'];

function withDelay(seconds: number): CSSProperties {
  return { '--delay': `${seconds}s` } as CSSProperties;
}

export default function AIProductCreation() {
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
      className={`creation${visible ? ' creation--visible' : ''}`}
      aria-label="AI product creation"
      id="ai-product-creation"
    >
      <div className="creation__inner">
        <div className="creation__intro">
          <p className="creation__eyebrow">AI product creation</p>
          <h2 className="creation__headline">Create products the way you already work.</h2>
          <p className="creation__subtext">
            No forms to fill out. Send a photo and describe it out loud or in a message —
            MerchForge writes the listing for you.
          </p>
          <div className="creation__fields">
            <span className="creation__fields-label">MerchForge understands:</span>
            <div className="creation__fields-tags">
              {UNDERSTOOD_FIELDS.map((field) => (
                <span key={field} className="creation__field-tag">
                  {field}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          className="creation__pipeline"
          role="img"
          aria-label="A product photo and a voice note are sent to MerchForge AI, which produces a finished product listing for a black hoodie"
        >
          <div className="creation__inputs">
            <div className="creation__bubble creation__bubble--photo" style={withDelay(0.1)}>
              <img src={BlackHoodieImage} alt="" className="creation__photo-swatch" />
              <span className="creation__bubble-label">Product photo</span>
            </div>

            <div className="creation__bubble creation__bubble--voice" style={withDelay(0.22)}>
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
            <div className="creation__listing" style={withDelay(0.55)}>
              <img src={BlackHoodieImage} alt="Classic Black Hoodie" className="creation__listing-image" />
              <div className="creation__listing-body">
                <span className="creation__listing-name" style={withDelay(0.62)}>
                  Classic Black Hoodie
                </span>
                <span className="creation__listing-price" style={withDelay(0.68)}>
                  $45
                </span>
                <p className="creation__listing-description" style={withDelay(0.74)}>
                  A relaxed-fit hoodie in soft cotton blend fleece, built for everyday wear.
                </p>
                <div className="creation__listing-tags" style={withDelay(0.8)}>
                  {OUTPUT_TAGS.map((tag) => (
                    <span key={tag} className="creation__listing-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="creation__output-caption">
              Ask for a change — "make the background white" — and MerchForge updates the photo too.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}