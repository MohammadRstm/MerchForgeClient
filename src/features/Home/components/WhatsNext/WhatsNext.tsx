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
    // Geometry is anchored, not eyeballed. The storefront's right edge sits at
    // x=92, its mid-height at y=188; the home's left edge at x=330, mid-height
    // y=64. The route begins and ends on exactly those points, so it meets both
    // buildings instead of floating past them, and its inflection lands at
    // (211,126) which is where the driver stands.
    const SHOP = { x: 92, y: 188 };
    const DRIVER = { x: 211, y: 126 };
    const HOME = { x: 330, y: 64 };

    return (
        <svg viewBox="0 0 420 250" role="img" aria-label="A delivery route from the storefront, past the driver, to the customer's home" className="next__svg">
            {[50, 100, 150, 200].map((y) => (
                <path key={y} d={`M12 ${y}h396`} className="next__grid" />
            ))}

            {/* Storefront: flat awning and a door, so it reads as a shop rather
                than as a second house. */}
            <g className="next__pop" style={{ '--d': '0s' } as React.CSSProperties}>
                <path d="M28 208v-40h64v40z" />
                <path d="M22 168l8-14h60l8 14z" className="next__hair" />
                <path d="M52 208v-18h16v18" className="next__hair" />
            </g>

            {/* Storefront -> driver -> home, in one stroke. */}
            <path
                className="next__draw next__draw--accent next__route"
                pathLength="1"
                d={`M${SHOP.x} ${SHOP.y}C150 ${SHOP.y} 150 ${DRIVER.y} ${DRIVER.x} ${DRIVER.y}C272 ${DRIVER.y} 272 ${HOME.y} ${HOME.x} ${HOME.y}`}
                style={{ '--d': '0.2s' } as React.CSSProperties}
            />

            {/* The driver, standing on the route. The marker is filled opaque so
                the line passes behind it rather than through it. */}
            <g className="next__pop" style={{ '--d': '1.2s' } as React.CSSProperties}>
                <circle cx={DRIVER.x} cy={DRIVER.y} r="14" className="next__marker" />
                <path d={`M${DRIVER.x - 5} ${DRIVER.y}l4 4 7-8`} className="next__tick" />
            </g>

            {/* Home: pitched roof. */}
            <g className="next__pop" style={{ '--d': '1.45s' } as React.CSSProperties}>
                <path d="M330 84v-40h64v40z" />
                <path d="M324 44l38-28 38 28z" className="next__hair" />
                <path d="M354 84v-16h16v16" className="next__hair" />
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
