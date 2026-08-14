import { useEffect, useRef, useState } from 'react';
import './Integrations.css';

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

export default function Integrations() {
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
      className={`integrations${visible ? ' integrations--visible' : ''}`}
      aria-label="Channels MerchForge connects"
      id="integrations"
    >
      <div className="integrations__inner">
        <div className="integrations__intro">
          <p className="integrations__eyebrow">Everywhere your customers are</p>
          <h2 className="integrations__headline">One system connecting every channel.</h2>
          <p className="integrations__subtext">
            MerchForge sits at the center, keeping your products and conversations in sync
            across every channel you use.
          </p>
        </div>

        <div className="integrations__diagram" role="img" aria-label="MerchForge connected to Website, Telegram, and WhatsApp, which are available now, and Social media, which is coming soon">
          <svg className="integrations__lines" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <line className="integrations__line" x1="200" y1="200" x2="200" y2="76" />
            <line className="integrations__line" x1="200" y1="200" x2="324" y2="200" />
            <line className="integrations__line" x1="200" y1="200" x2="200" y2="324" />
            <line className="integrations__line integrations__line--dashed" x1="200" y1="200" x2="76" y2="200" />
          </svg>

          <div className="integrations__hub">MerchForge</div>

          {CHANNELS.map((channel) => (
            <div key={channel.id} className={`integrations__node integrations__node--${channel.position}`}>
              <span
                className={`integrations__node-dot${
                  channel.availability === 'Coming soon' ? ' integrations__node-dot--soon' : ''
                }`}
                aria-hidden="true"
              />
              <span className="integrations__node-label">{channel.label}</span>
              <span
                className={`integrations__node-status${
                  channel.availability === 'Coming soon' ? ' integrations__node-status--soon' : ''
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