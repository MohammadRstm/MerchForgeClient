import { useEffect, useState, useCallback } from 'react';
import logo from '../../../../assets/logo.svg';
import './Navbar.css';

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Features', href: '#features' },
  { label: 'AI', href: '#ai' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Coming Soon', href: '#coming-soon' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 720) setMenuOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}${menuOpen ? ' navbar--open' : ''}`}>
      <div className="navbar__inner">
        <a href="#top" className="navbar__logo" onClick={closeMenu}>
          <img src={logo} alt="" className="navbar__logo-mark" />
          MerchForge
        </a>

        <nav className="navbar__links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="navbar__link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="navbar__actions">
          <a href="/login" className="navbar__login">
            Log in
          </a>
          <a href="#get-started" className="navbar__cta">
            Get Started
          </a>
        </div>

        <button
          type="button"
          className="navbar__menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="navbar-mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="navbar__menu-bar" />
          <span className="navbar__menu-bar" />
          <span className="navbar__menu-bar" />
        </button>
      </div>

      <div className="navbar__mobile" id="navbar-mobile-menu" hidden={!menuOpen}>
        <nav className="navbar__mobile-links" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="navbar__mobile-link" onClick={closeMenu}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="navbar__mobile-actions">
          <a href="#login" className="navbar__login navbar__login--mobile" onClick={closeMenu}>
            Log in
          </a>
          <a href="#get-started" className="navbar__cta navbar__cta--mobile" onClick={closeMenu}>
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}