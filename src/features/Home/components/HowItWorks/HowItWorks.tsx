import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './HowItWorks.css';

interface Step {
  number: string;
  title: string;
  description: string;
  chips: string[];
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Send what you have',
    description: 'A photo, a voice note, or a quick text — sent the way you already talk to people.',
    chips: ['Photo', 'Voice note', 'Text'],
  },
  {
    number: '02',
    title: 'MerchForge understands it',
    description: 'It reads the image, listens to the voice note, and picks out the details that matter.',
    chips: ['Reading', 'Listening', 'Extracting'],
  },
  {
    number: '03',
    title: 'Your product, structured',
    description: 'Name, description, price, and variants — filled in automatically, ready to review.',
    chips: ['Name', 'Price', 'Sizes', 'Color'],
  },
  {
    number: '04',
    title: 'Ready to sell',
    description: 'Adjust anything you like, then publish it to your catalog in one move.',
    chips: ['Reviewed', 'Published'],
  },
];

function withDelay(seconds: number): CSSProperties {
  return { '--delay': `${seconds}s` } as CSSProperties;
}

export default function HowItWorks() {
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
      className={`how${visible ? ' how--visible' : ''}`}
      aria-label="How MerchForge works"
      id="how-it-works"
    >
      <div className="how__inner">
        <div className="how__intro">
          <p className="how__eyebrow">How it works</p>
          <h2 className="how__headline">From a message to a finished product.</h2>
          <p className="how__subtext">
            No forms to fill out. Send MerchForge what you'd naturally send a coworker, and it takes
            care of the rest.
          </p>
        </div>

        <div className="how__rail" aria-hidden="true">
          <div className="how__rail-track" />
          <div className="how__rail-fill" />
        </div>

        <ol className="how__steps">
          {STEPS.map((step, i) => (
            <li key={step.number} className="how__step" style={withDelay(0.15 + i * 0.14)}>
              <div className="how__step-marker">
                <span className="how__step-dot" />
                <span className="how__step-number">{step.number}</span>
              </div>
              <h3 className="how__step-title">{step.title}</h3>
              <p className="how__step-description">{step.description}</p>
              <div className="how__step-chips">
                {step.chips.map((chip) => (
                  <span key={chip} className="how__step-chip">
                    {chip}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}