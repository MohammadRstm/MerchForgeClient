import { useEffect, useRef, useState, type CSSProperties } from 'react';
import './Faq.css';

/* The numbers that used to label these are gone. mf-index means "step N of a
   sequence" everywhere else it appears - HowItWorks and Studio - and these
   questions have no order, so numbering them only implied one that isn't
   there. */
interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'Which channels does MerchForge support?',
    answer:
      'Telegram, WhatsApp, and your website today, with social media coming soon. Every channel reads from and writes to the same product catalog, so nothing gets out of sync.',
  },
  {
    question: 'What does every plan include?',
    answer:
      'A fully responsive, self-managed website with an owner dashboard, unlimited AI product creation, and basic branding — your logo, favicon, brand color, and contact details on your storefront. Growth and Pro add more image-edit credits and unlock advanced customization: social links, business hours, and per-template storefront fields.',
  },
  {
    question: 'How do image-edit credits work?',
    answer:
      'Each credit covers one AI image edit — generating a product photo in a new angle or color, or editing an existing photo. Credits reset every billing period and don’t roll over; Starter includes 40/month, Growth 150, and Pro 400. AI product creation itself is unlimited on every plan.',
  },
  {
    question: 'Can I switch plans later?',
    answer:
      'Yes — switching takes effect immediately from your dashboard’s Billing page, any time. Or talk to us about a custom plan built around your business.',
  },
  {
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

        {/* A description list, because that is what a set of question/answer
            pairs is. Nothing here is a button any more: the answers are short,
            and someone weighing what a plan includes against how credits work
            can now read both at once instead of opening one and closing the
            other. */}
        <dl className="faq__list">
          {FAQS.map((item, i) => (
            <div key={item.question} className="faq__item" style={withDelay(i * 0.06)}>
              <dt className="faq__question">{item.question}</dt>
              <dd className="faq__answer">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
