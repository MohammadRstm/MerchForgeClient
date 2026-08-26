import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { FiScissors, FiSun } from 'react-icons/fi';
import BlackHoodieImage from '../../../../assets/Landing/Landing__AiProductCreation__blackHoodie.jpg';
import AngleBack from '../../../../assets/Landing/Landing__Showcase__angle-back.jpg';
import AngleLeft from '../../../../assets/Landing/Landing__Showcase__angle-left.jpg';
import AngleThreeQuarter from '../../../../assets/Landing/Landing__Showcase__angle-threequarter.jpg';
import ColorA from '../../../../assets/Landing/Landing__Showcase__color-a.jpg';
import ColorB from '../../../../assets/Landing/Landing__Showcase__color-b.jpg';
import './Capabilities.css';

const UNDERSTOOD_FIELDS = ['Name', 'Description', 'Price', 'Sizes', 'Colors', 'Brand'];

interface RowProps {
  number: string;
  tag: string;
  title: string;
  description: string;
  visual: ReactNode;
  reverse?: boolean;
}

function CapabilityRow({ number, tag, title, description, visual, reverse }: RowProps) {
  return (
    <article className={`capabilities__row${reverse ? ' capabilities__row--reverse' : ''}`}>
      <div className="capabilities__row-copy">
        <span className="capabilities__row-number mf-index">{number}</span>
        <span className="capabilities__row-tag">{tag}</span>
        <h3 className="capabilities__row-title">{title}</h3>
        <p className="capabilities__row-description">{description}</p>
      </div>
      <div className="capabilities__row-visual">{visual}</div>
    </article>
  );
}

export default function Capabilities() {
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
      className={`capabilities mf-section${visible ? ' capabilities--visible' : ''}`}
      aria-label="MerchForge AI capabilities"
      id="capabilities"
    >
      <div className="capabilities__inner mf-section__inner">
        <p className="mf-eyebrow">What MerchForge can do</p>
        <h2 className="capabilities__headline mf-headline">
          Every part of turning a photo into a finished product.
        </h2>

        <div className="capabilities__list">
          <CapabilityRow
            number="01"
            tag="AI product creation · Structured info"
            title="A photo and a few words become a finished listing"
            description="Send a photo and describe it — by voice or text. MerchForge fills in the name, description, price, sizes, colors, and brand, leaving only what it can't infer for you to review."
            visual={
              <div className="capability-pipeline">
                <div className="capability-pipeline__bubble">
                  <img src={BlackHoodieImage} alt="" className="capability-pipeline__photo" />
                  <span>Product photo</span>
                </div>
                <div className="capability-pipeline__bubble capability-pipeline__bubble--voice">
                  <span className="capability-pipeline__wave" aria-hidden="true">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <span key={i} style={{ '--bar': i } as CSSProperties} />
                    ))}
                  </span>
                  <span>"Black hoodie, forty-five dollars, sizes M to XL."</span>
                </div>
                <div className="capability-pipeline__tags">
                  {UNDERSTOOD_FIELDS.map((field) => (
                    <span key={field}>{field}</span>
                  ))}
                </div>
              </div>
            }
          />

          <CapabilityRow
            number="02"
            tag="AI image generation · Angle generation"
            title="Every angle, from a single photo"
            description="Front, back, side, three-quarter — MerchForge generates each angle your customers would want to see, without another photoshoot."
            reverse
            visual={
              <div className="capability-angles">
                <img src={AngleBack} alt="Back view, AI-generated" />
                <img src={AngleThreeQuarter} alt="Three-quarter view, AI-generated" />
                <img src={AngleLeft} alt="Left side view, AI-generated" />
              </div>
            }
          />

          <CapabilityRow
            number="03"
            tag="Product color generation"
            title="Show every color you sell"
            description="Pick the colors a product comes in, and MerchForge generates a real photo in each — reusing your existing images where it can."
            visual={
              <div className="capability-colors">
                <img src={ColorA} alt="Product regenerated in an alternate color, AI-generated" />
                <img src={ColorB} alt="Product regenerated in a second alternate color, AI-generated" />
              </div>
            }
          />

          <CapabilityRow
            number="04"
            tag="Product image editing"
            title="Clean up any photo in one request"
            description="Describe the change you want — a clean white background, better lighting, sharper detail — and MerchForge edits the photo for you."
            reverse
            visual={
              <div className="capability-editing">
                <span className="capability-editing__icon">
                  <FiScissors aria-hidden="true" />
                </span>
                <span className="capability-editing__label">Remove background</span>
                <span className="capability-editing__icon">
                  <FiSun aria-hidden="true" />
                </span>
                <span className="capability-editing__label">Enhance photo</span>
              </div>
            }
          />

          <CapabilityRow
            number="05"
            tag="Management & publishing"
            title="One catalog, published in one move"
            description="However a product was created, it lands in the same catalog — organized, searchable, and ready to publish across every channel you sell on."
            visual={
              <div className="capability-stat">
                <span className="capability-stat__number">1</span>
                <span className="capability-stat__label">catalog for every product, however it was created</span>
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}
