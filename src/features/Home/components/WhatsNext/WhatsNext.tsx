import { useEffect, useId, useRef, useState, type ReactElement } from 'react';
import './WhatsNext.css';

/**
 * The two features that are coming but are not here yet.
 *
 * Deliberately drawn as mechanism sketches rather than mocked as screens.
 * Neither exists, so a screenshot of either would be an invention presented as a
 * product, and a visitor cannot tell the difference between a mock and a
 * promise. A diagram of how the thing will work claims exactly as much as is
 * true.
 *
 * Each sketch draws once when it comes into view and then stops. pathLength="1"
 * normalises every path to a single unit, so one dash rule animates all of them
 * without measuring anything at runtime.
 */

/** Neutral channel tiles, not real platform marks — no trademarks borrowed. */
function SocialSketch() {
    return (
        <svg viewBox="0 0 420 250" role="img" aria-label="One product fanning out to four publishing channels" className="next__svg">
            {/* The product, already made */}
            <rect className="next__draw" pathLength="1" x="16" y="74" width="118" height="104" rx="8" style={{ '--d': '0s' } as React.CSSProperties} />
            <path className="next__draw" pathLength="1" d="M32 152h86" style={{ '--d': '0.35s' } as React.CSSProperties} />
            <path className="next__draw" pathLength="1" d="M32 164h54" style={{ '--d': '0.45s' } as React.CSSProperties} />
            <circle className="next__pop" cx="75" cy="116" r="19" style={{ '--d': '0.5s' } as React.CSSProperties} />

            {/* The one click */}
            <circle className="next__spark" cx="134" cy="74" r="7" style={{ '--d': '0.75s' } as React.CSSProperties} />

            {/* Fan-out */}
            {[
                { d: 'M140 120C200 120 210 40 268 40', delay: '0.85s' },
                { d: 'M140 122C200 122 214 100 268 100', delay: '0.95s' },
                { d: 'M140 128C200 128 214 160 268 160', delay: '1.05s' },
                { d: 'M140 130C200 130 210 220 268 220', delay: '1.15s' },
            ].map((line) => (
                <path key={line.d} className="next__draw next__draw--accent" pathLength="1" d={line.d} style={{ '--d': line.delay } as React.CSSProperties} />
            ))}

            {/* Channels */}
            {[40, 100, 160, 220].map((y, index) => (
                <g key={y} className="next__pop" style={{ '--d': `${1.25 + index * 0.08}s` } as React.CSSProperties}>
                    <rect x="272" y={y - 22} width="132" height="44" rx="7" />
                    <circle cx="296" cy={y} r="8" className="next__dot" />
                    <path d={`M316 ${y - 5}h68`} className="next__hair" />
                    <path d={`M316 ${y + 6}h44`} className="next__hair" />
                </g>
            ))}
        </svg>
    );
}

function DeliverySketch() {
    return (
        <svg viewBox="0 0 420 250" role="img" aria-label="A delivery route drawn from the shop to a customer, with a driver on the way" className="next__svg">
            {/* Ground grid, faint */}
            {[60, 110, 160, 210].map((y) => (
                <path key={y} d={`M12 ${y}h396`} className="next__grid" />
            ))}

            {/* The route */}
            <path
                className="next__draw next__draw--accent next__route"
                pathLength="1"
                d="M56 196C120 196 118 96 186 96C254 96 244 58 356 58"
                style={{ '--d': '0.15s' } as React.CSSProperties}
            />

            {/* Shop */}
            <g className="next__pop" style={{ '--d': '0s' } as React.CSSProperties}>
                <path d="M40 196v-26h32v26z" />
                <path d="M36 170l10-14h20l10 14z" className="next__hair" />
            </g>

            {/* Driver, part-way along */}
            <g className="next__pop" style={{ '--d': '1.15s' } as React.CSSProperties}>
                <circle cx="186" cy="96" r="13" className="next__marker" />
                <path d="M181 96l4 4 7-8" className="next__tick" />
            </g>

            {/* Customer */}
            <g className="next__pop" style={{ '--d': '1.35s' } as React.CSSProperties}>
                <path d="M340 72v-22h32v22z" />
                <path d="M336 50l20-16 20 16z" className="next__hair" />
            </g>
        </svg>
    );
}

interface Item {
    id: string;
    title: string;
    body: string;
    points: string[];
    sketch: ReactElement;
}

const ITEMS: Item[] = [
    {
        id: 'social',
        title: 'Post to your channels in one click',
        body:
            'The listing already has the photography, the copy and the price. Publishing it everywhere you sell should not mean writing it out four more times.',
        points: ['Every generated angle, sized per channel', 'Captions drawn from the listing you approved', 'One product, one click, every channel'],
        sketch: <SocialSketch />,
    },
    {
        id: 'delivery',
        title: 'A delivery app for your drivers',
        body:
            'Orders already live in MerchForge. The last mile is the part that still happens over phone calls and screenshots — so it is the part we are building next.',
        points: ['Orders assigned straight from the dashboard', 'Routes and status without a phone call', 'The customer sees where it is'],
        sketch: <DeliverySketch />,
    },
];

export default function WhatsNext() {
    const [seen, setSeen] = useState<Set<string>>(new Set());
    const rootRef = useRef<HTMLDivElement>(null);
    const baseId = useId();

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;

        const rows = [...root.querySelectorAll<HTMLElement>('[data-row]')];

        const observer = new IntersectionObserver(
            (entries) => {
                const arrived = entries
                    .filter((entry) => entry.isIntersecting)
                    .map((entry) => entry.target.getAttribute('data-row'))
                    .filter((id): id is string => Boolean(id));

                if (arrived.length === 0) return;

                // Each sketch draws once. Unobserving keeps it from replaying
                // every time the row scrolls back through, which is the
                // difference between a flourish and a nervous tic.
                setSeen((current) => new Set([...current, ...arrived]));
                entries.forEach((entry) => entry.isIntersecting && observer.unobserve(entry.target));
            },
            { rootMargin: '0px 0px -22% 0px', threshold: 0.25 },
        );

        rows.forEach((row) => observer.observe(row));
        return () => observer.disconnect();
    }, []);

    return (
        <section className="mf-section next" id="whats-next" aria-labelledby={`${baseId}-heading`}>
            <div className="mf-section__inner" ref={rootRef}>
                <header className="next__header">
                    <p className="mf-eyebrow">On the way</p>
                    <h2 className="next__heading" id={`${baseId}-heading`}>
                        Two things we are building next.
                    </h2>
                    <p className="next__lede">
                        Neither of these ships today, so there is nothing to show you but how they will
                        work. No dates we cannot keep.
                    </p>
                </header>

                {ITEMS.map((item, index) => (
                    <article
                        key={item.id}
                        data-row={item.id}
                        className={`next__row${index % 2 === 1 ? ' next__row--reverse' : ''}${seen.has(item.id) ? ' is-visible' : ''}`}
                    >
                        <div className="next__copy">
                            <p className="next__badge">Coming soon</p>
                            <h3 className="next__title">{item.title}</h3>
                            <p className="next__body">{item.body}</p>
                            <ul className="next__points">
                                {item.points.map((point) => (
                                    <li key={point}>{point}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="next__sketch">{item.sketch}</div>
                    </article>
                ))}
            </div>
        </section>
    );
}
