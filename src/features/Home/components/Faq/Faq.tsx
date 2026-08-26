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
    question: 'What does the Standard plan actually include?',
    answer:
      'A fully responsive website and a free NFC card customers can tap to leave a Google review. The website is managed by MerchForge — to add or edit products, you contact us rather than editing it yourself.',
  },
  {
    number: '03',
    question: 'How do the image and voice-to-text credits work?',
    answer:
      'Each credit covers one AI action — generating a product image in a new angle or color, or transcribing a voice note into product details. The Premium plan includes 200 image credits and 300 voice-to-text credits per year.',
  },
  {
    number: '04',
    question: 'Can I switch plans later?',
    answer:
      "Yes. If you outgrow the Standard plan's managed website, you can move to Premium for self-managed control and AI credits — or talk to us about a Custom plan built around your business.",
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
