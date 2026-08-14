import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './AiServices.css';

interface ChatLine {
  from: 'merchant' | 'customer' | 'ai';
  text: string;
}

interface Service {
  id: 'telegram' | 'whatsapp' | 'website' | 'social';
  label: string;
  availability: 'Available now' | 'Coming soon';
  title: string;
  description: string;
}

const SERVICES: Service[] = [
  {
    id: 'telegram',
    label: 'Telegram',
    availability: 'Available now',
    title: 'Describe it. MerchForge builds it.',
    description:
      'Send a photo and describe the product by text or voice — the Telegram assistant turns it into a finished listing.',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    availability: 'Available now',
    title: 'Turn conversations into customers.',
    description:
      'The WhatsApp assistant answers customer questions in real time, using your product catalog as its source of truth.',
  },
  {
    id: 'website',
    label: 'Website',
    availability: 'Available now',
    title: "Your store's AI assistant.",
    description:
      'A chat widget on your site helps customers find products and get answers — even while you\'re away.',
  },
  {
    id: 'social',
    label: 'Social media',
    availability: 'Coming soon',
    title: 'One product. Every social channel.',
    description:
      'Turn an existing product into ready-to-post content for Instagram, Facebook, and TikTok.',
  },
];

const TELEGRAM_CHAT: ChatLine[] = [
  { from: 'merchant', text: 'Black hoodie, $45, sizes M–XL' },
  { from: 'ai', text: 'Product created ✓' },
];

const WHATSAPP_CHAT: ChatLine[] = [
  { from: 'customer', text: 'Is the black hoodie available in XL?' },
  { from: 'ai', text: 'Yes — available in XL for $45.' },
];

const SOCIAL_CHANNELS = ['Instagram', 'Facebook', 'TikTok'];

function withDelay(seconds: number): CSSProperties {
  return { '--delay': `${seconds}s` } as CSSProperties;
}

function ChatPreview({ lines }: { lines: ChatLine[] }) {
  return (
    <div className="ai-services__chat">
      {lines.map((line, i) => (
        <div key={i} className={`ai-services__bubble ai-services__bubble--${line.from}`}>
          {line.text}
        </div>
      ))}
    </div>
  );
}

function ServiceVisual({ id }: { id: Service['id'] }) {
  if (id === 'telegram') return <ChatPreview lines={TELEGRAM_CHAT} />;
  if (id === 'whatsapp') return <ChatPreview lines={WHATSAPP_CHAT} />;

  if (id === 'website') {
    return (
      <div className="ai-services__widget">
        <span className="ai-services__widget-dot" aria-hidden="true" />
        <span className="ai-services__widget-text">Ask about this product</span>
      </div>
    );
  }

  return (
    <div className="ai-services__social">
      <span className="ai-services__social-source" aria-hidden="true" />
      <span className="ai-services__social-arrow" aria-hidden="true">
        →
      </span>
      <div className="ai-services__social-channels">
        {SOCIAL_CHANNELS.map((channel) => (
          <span key={channel} className="ai-services__social-channel">
            {channel}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AIServices() {
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
      className={`ai-services${visible ? ' ai-services--visible' : ''}`}
      aria-label="AI-powered services"
      id="ai"
    >
      <div className="ai-services__inner">
        <div className="ai-services__intro">
          <p className="ai-services__eyebrow">AI-powered services</p>
          <h2 className="ai-services__headline">An AI team for your business.</h2>
          <p className="ai-services__subtext">
            Four AI capabilities working across the places your customers already are.
          </p>
        </div>

        <div className="ai-services__grid">
          {SERVICES.map((service, i) => (
            <article
              key={service.id}
              className={`ai-services__card ai-services__card--${service.id}`}
              style={withDelay(i * 0.1)}
            >
              <div className="ai-services__card-header">
                <span className="ai-services__label">
                  <span className={`ai-services__label-dot ai-services__label-dot--${service.id}`} aria-hidden="true" />
                  {service.label}
                </span>
                <span
                  className={`ai-services__badge${
                    service.availability === 'Coming soon' ? ' ai-services__badge--soon' : ''
                  }`}
                >
                  {service.availability}
                </span>
              </div>

              <h3 className="ai-services__card-title">{service.title}</h3>
              <p className="ai-services__card-description">{service.description}</p>

              <ServiceVisual id={service.id} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}