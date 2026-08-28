import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './Faq.css';

interface FaqItem {
  number: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    number: '01',
    question: 'Which channels does MerchForge support?',
    answer:
      'Telegram, WhatsApp, and your website today, with social media coming soon. Every channel reads from and writes to the same product catalog, so nothing gets out of sync.',
  },
  {
    number: '02',
    question: 'What does every plan include?',
    answer:
      'A fully responsive, self-managed website with an owner dashboard, unlimited AI product creation, and basic branding — your logo, favicon, brand color, and contact details on your storefront. Growth and Pro add more image-edit credits and unlock advanced customization: social links, business hours, and per-template storefront fields.',
  },
  {
    number: '03',
    question: 'How do image-edit credits work?',
    answer:
      'Each credit covers one AI image edit — generating a product photo in a new angle or color, or editing an existing photo. Credits reset every billing period and don’t roll over; Starter includes 40/month, Growth 150, and Pro 400. AI product creation itself is unlimited on every plan.',
  },
  {
    number: '04',
    question: 'Can I switch plans later?',
    answer:
      'Yes — switching takes effect immediately from your dashboard’s Billing page, any time. Or talk to us about a custom plan built around your business.',
  },
  {
    number: '05',
    question: 'Do I need any coding knowledge?',
    answer:
      "No. Products are created by sending a photo and describing it — by voice or text — the way you'd explain it to a person. MerchForge turns that into a structured listing for you.",
  },
];

function withDelay(seconds: number): CSSProperties {
  return { '--delay': `${seconds}s` } as CSSProperties;
}

export default function Faq() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
      className={`faq mf-section${visible ? ' faq--visible' : ''}`}
      aria-label="Frequently asked questions"
      id="faq"
    >
      <div className="faq__inner mf-section__inner">
        <p className="mf-eyebrow">Frequently asked</p>
        <h2 className="faq__headline mf-headline">Questions merchants actually ask.</h2>

        <ul className="faq__list">
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <li key={item.number} className="faq__item" style={withDelay(i * 0.05)}>
                <button
                  type="button"
                  className="faq__question"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.number}`}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span className="faq__number mf-index">{item.number}</span>
                  <span className="faq__question-text">{item.question}</span>
                  <span className={`faq__toggle${isOpen ? ' faq__toggle--open' : ''}`} aria-hidden="true" />
                </button>
                <div
                  id={`faq-answer-${item.number}`}
                  className={`faq__answer${isOpen ? ' faq__answer--open' : ''}`}
                  role="region"
                >
                  <p className="faq__answer-text">{item.answer}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
