import { useEffect, useId, useRef, useState, type ReactElement } from 'react';
import Snapshot from '../../../../assets/Landing/Landing__Studio__snapshot.jpg';
import Cutout from '../../../../assets/Landing/Landing__Studio__cutout.jpg';
import StudioShot from '../../../../assets/Landing/Landing__Showcase__counter-base.jpg';
import AltAngle from '../../../../assets/Landing/Landing__Studio__angle.jpg';
import Green from '../../../../assets/Landing/Landing__Showcase__counter-green.jpg';
import Terracotta from '../../../../assets/Landing/Landing__Showcase__counter-terracotta.jpg';
import './Studio.css';

/**
 * One photograph, moving down the pipeline.
 *
 * The copy column scrolls; the stage beside it stays put and changes state as
 * each step reaches the middle of the viewport. Chosen over another carousel on
 * purpose — the hero already has one, and repeating the device would make the
 * page feel like a single trick. Continuous transformation of one object also
 * happens to be the honest shape of the product.
 *
 * The step names are the dashboard's own action labels, not marketing
 * paraphrases of them.
 */

interface Step {
    id: string;
    title: string;
    body: string;
    visual: () => ReactElement;
}

function Plate({ src, caption, alt }: { src: string; caption: string; alt: string }) {
    return (
        <figure className="studio__plate">
            <img src={src} alt={alt} loading="lazy" />
            <figcaption>{caption}</figcaption>
        </figure>
    );
}

/** What the model proposes. Every one of these is editable before it ships. */
const DETAILS = [
    ['Name', 'Oak counter stool'],
    ['Category', 'Homeware · Seating'],
    ['Materials', 'Solid oak, powder-coated steel'],
    ['Height', '65 cm'],
    ['Suggested price', '$149.00'],
];

const STEPS: Step[] = [
    {
        id: 'photo',
        title: 'Your photo',
        body: 'Taken on a phone, in the shop, in whatever light there happened to be. This is the only thing you have to provide.',
        visual: () => <Plate src={Snapshot} caption="As uploaded" alt="A bar stool photographed on a phone in a domestic kitchen" />,
    },
    {
        id: 'background',
        title: 'Remove background',
        body: 'The kitchen goes. The stool stays, on a clean ground, with its shadow rebuilt underneath it.',
        visual: () => <Plate src={Cutout} caption="Background removed" alt="The same stool with the kitchen removed, on a plain ground" />,
    },
    {
        id: 'enhance',
        title: 'Enhance photo',
        body: 'Colour, contrast and sharpness corrected to something you would put in a catalogue without apologising for it.',
        visual: () => <Plate src={StudioShot} caption="Enhanced" alt="The same stool, colour corrected and sharpened" />,
    },
    {
        id: 'angles',
        title: 'Generate in multiple angles',
        body: 'Views you never photographed, built from the one you did — so a listing has more than a single flat shot.',
        visual: () => (
            <div className="studio__pair">
                <Plate src={StudioShot} caption="Front" alt="The stool from the front" />
                <Plate src={AltAngle} caption="Generated" alt="The same stool from a second angle, generated" />
            </div>
        ),
    },
    {
        id: 'colors',
        title: 'Add images with colors',
        body: 'A new colourway becomes a choice rather than another photoshoot. Same stool, same light, different finish.',
        visual: () => (
            <div className="studio__pair">
                <Plate src={Green} caption="Forest" alt="The same stool in a forest green finish" />
                <Plate src={Terracotta} caption="Terracotta" alt="The same stool in a terracotta finish" />
            </div>
        ),
    },
    {
        id: 'details',
        title: 'Suggest details from photo',
        body: 'Name, category, materials, dimensions and a price band — proposed from what the photo actually shows. Nothing goes live until you approve it.',
        visual: () => (
            <div className="studio__details">
                <p className="studio__details-caption">Suggested — awaiting your approval</p>
                <dl>
                    {DETAILS.map(([label, value]) => (
                        <div key={label}>
                            <dt>{label}</dt>
                            <dd>{value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        ),
    },
];

export default function Studio() {
    const [active, setActive] = useState(0);
    const stepsRef = useRef<HTMLDivElement>(null);
    const baseId = useId();

    useEffect(() => {
        const root = stepsRef.current;
        if (!root) return;

        const steps = [...root.querySelectorAll<HTMLElement>('[data-step]')];
        if (steps.length === 0) return;

        // A thin band across the middle of the viewport. A step becomes current
        // when it enters that band, which is what keeps the stage in step with
        // whatever the reader is actually looking at rather than with whatever
        // happens to be topmost.
        const observer = new IntersectionObserver(
            (entries) => {
                const hit = entries.find((entry) => entry.isIntersecting);
                if (!hit) return;

                const index = steps.indexOf(hit.target as HTMLElement);
                if (index >= 0) setActive(index);
            },
            { rootMargin: '-48% 0px -48% 0px', threshold: 0 },
        );

        steps.forEach((step) => observer.observe(step));
        return () => observer.disconnect();
    }, []);

    return (
        <section className="mf-section studio" id="studio" aria-labelledby={`${baseId}-heading`}>
            <div className="mf-section__inner">
                <header className="studio__header">
                    <p className="mf-eyebrow">One photo in</p>
                    <h2 className="studio__heading" id={`${baseId}-heading`}>
                        Everything a listing needs, from the picture you already took.
                    </h2>
                    <p className="studio__lede">
                        Send it from the dashboard, Telegram or WhatsApp. What comes back is a finished
                        product — and you approve it before anyone else sees it.
                    </p>
                </header>

                <div className="studio__body">
                    <div className="studio__steps" ref={stepsRef}>
                        {STEPS.map((step, index) => (
                            <article
                                key={step.id}
                                data-step={step.id}
                                className={`studio__step${index === active ? ' is-current' : ''}`}
                            >
                                <p className="studio__step-index mf-index">
                                    {String(index + 1).padStart(2, '0')}
                                </p>
                                <h3 className="studio__step-title">{step.title}</h3>
                                <p className="studio__step-body">{step.body}</p>

                                {/* The narrow layout has no sticky stage, so each step
                                    carries its own visual. Hidden on wide screens, where
                                    the stage below does the work. Same image URLs either
                                    way, so nothing is fetched twice. */}
                                <div className="studio__step-visual">{step.visual()}</div>
                            </article>
                        ))}
                    </div>

                    <div className="studio__stage" aria-hidden="true">
                        <div className="studio__stage-inner" key={STEPS[active].id}>
                            {STEPS[active].visual()}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
