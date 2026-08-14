import './Footer.css';

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

const COLUMNS: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'AI', href: '#ai' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#documentation' },
      { label: 'Help Center', href: '#help' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '#privacy' },
      { label: 'Terms', href: '#terms' },
    ],
  },
];

const SOCIAL_LINKS = ['X', 'Instagram', 'LinkedIn'];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <span className="footer__logo">MerchForge</span>
            <p className="footer__tagline">Turn your products into sales — with AI.</p>
            <div className="footer__social" aria-label="Social links">
              {SOCIAL_LINKS.map((label) => (
                <a key={label} href="#" className="footer__social-link" aria-label={label}>
                  {label}
                </a>
              ))}
            </div>
          </div>

          <nav className="footer__columns" aria-label="Footer">
            {COLUMNS.map((column) => (
              <div key={column.title} className="footer__column">
                <span className="footer__column-title">{column.title}</span>
                <ul className="footer__link-list">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="footer__link">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="footer__bottom">
          <span className="footer__copyright">© {year} MerchForge. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}