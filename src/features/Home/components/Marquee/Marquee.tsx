import type { CSSProperties } from 'react';
import './Marquee.css';

type MarqueeProps = {
  items: string[];
  /** Seconds for one full loop — lower is faster. */
  speed?: number;
};

/**
 * A horizontal, infinitely-scrolling strip of short text items — eloqwnt's
 * proof-ticker pattern. The track holds the item list twice back to back and
 * animates exactly one copy's width, so the loop point is invisible.
 */
export default function Marquee({ items, speed = 28 }: MarqueeProps) {
  return (
    <div className="marquee" style={{ '--marquee-duration': `${speed}s` } as CSSProperties}>
      <div className="marquee__track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="marquee__item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
