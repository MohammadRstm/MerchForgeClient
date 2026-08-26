import { useEffect, useRef, useState } from 'react';
import './WhoItsFor.css';

type Availability = 'Available now' | 'Coming soon';

interface Channel {
  id: 'website' | 'telegram' | 'whatsapp' | 'social';
  label: string;
  position: 'top' | 'right' | 'bottom' | 'left';
  availability: Availability;
}

const CHANNELS: Channel[] = [
  { id: 'website', label: 'Website', position: 'top', availability: 'Available now' },
  { id: 'telegram', label: 'Telegram', position: 'right', availability: 'Available now' },
  { id: 'whatsapp', label: 'WhatsApp', position: 'bottom', availability: 'Available now' },
  { id: 'social', label: 'Social media', position: 'left', availability: 'Coming soon' },
];

/**
 * eloqwnt's "who we work with" analog. MerchForge has no client logos to
 * show, so instead of a fabricated logo marquee this restyles Integrations'
 * existing hub-and-spoke diagram — the real channels MerchForge connects —
 * as the supporting visual for a statement about who the product is built
 * for: merchants selling across chat and web.
 */
export default function WhoItsFor() {
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
      className={`who mf-section${visible ? ' who--visible' : ''}`}
      aria-label="Who MerchForge is built for"
      id="who-its-for"
    >
      <div className="who__inner mf-section__inner">
        <div className="who__intro">
          <p className="mf-eyebrow">Built for growing merchants</p>
          <h2 className="who__headline mf-headline">
            Built for merchants who sell wherever their customers are.
          </h2>
          <p className="mf-subtext who__subtext">
            Not every sale happens on a website. MerchForge keeps one catalog and one source of
            truth in sync across every channel you actually use — so switching between them
            never means switching tools.
          </p>
        </div>

        <div
          className="who__diagram"
          role="img"
          aria-label="MerchForge connected to Website, Telegram, and WhatsApp, which are available now, and Social media, which is coming soon"
        >
          <svg className="who__lines" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <line className="who__line" x1="200" y1="200" x2="200" y2="76" />
            <line className="who__line" x1="200" y1="200" x2="324" y2="200" />
            <line className="who__line" x1="200" y1="200" x2="200" y2="324" />
            <line className="who__line who__line--dashed" x1="200" y1="200" x2="76" y2="200" />
          </svg>

          <div className="who__hub">MerchForge</div>

          {CHANNELS.map((channel) => (
            <div key={channel.id} className={`who__node who__node--${channel.position}`}>
              <span
                className={`who__node-dot${channel.availability === 'Coming soon' ? ' who__node-dot--soon' : ''}`}
                aria-hidden="true"
              />
              <span className="who__node-label">{channel.label}</span>
              <span
                className={`who__node-status${
                  channel.availability === 'Coming soon' ? ' who__node-status--soon' : ''
                }`}
              >
                {channel.availability}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
