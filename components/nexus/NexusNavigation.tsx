'use client'

import Link from 'next/link'

interface NexusNavigationProps {
  isScrolled: boolean
  isMobileMenuOpen: boolean
  cartCount: number
  onSearchClick: () => void
  onCartClick: () => void
  onMenuToggle: () => void
}

export function NexusNavigation({
  isScrolled,
  isMobileMenuOpen,
  cartCount,
  onSearchClick,
  onCartClick,
  onMenuToggle,
}: NexusNavigationProps) {
  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="nav-container">
          <Link href="/nexus" className="nav-logo" aria-label="NEXUS Home">
            <span className="logo-icon" aria-hidden="true">⬡</span>
            <span className="logo-text">NEXUS</span>
          </Link>
          <ul className="nav-links" role="menubar">
            <li role="none">
              <a href="#hero" className="nav-link" role="menuitem">
                Home
              </a>
            </li>
            <li role="none">
              <a href="#products" className="nav-link" role="menuitem">
                Shop
              </a>
            </li>
            <li role="none">
              <a href="#features" className="nav-link" role="menuitem">
                Features
              </a>
            </li>
            <li role="none">
              <a href="#testimonials" className="nav-link" role="menuitem">
                Reviews
              </a>
            </li>
            <li role="none">
              <Link href="/" className="nav-link" role="menuitem" style={{ color: 'var(--gold-light)' }}>
                AURA AI
              </Link>
            </li>
          </ul>
          <div className="nav-actions">
            <button
              className="btn-search"
              onClick={onSearchClick}
              aria-label="Search products"
              title="Search products"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
            <button
              className="btn-cart"
              onClick={onCartClick}
              aria-label={`Shopping cart with ${cartCount} items`}
              title={`Shopping cart with ${cartCount} items`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="cart-badge" aria-label={`${cartCount} items in cart`}>
                {cartCount}
              </span>
            </button>
            <button
              className="btn-menu"
              onClick={onMenuToggle}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              title={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <span
                style={{
                  transform: isMobileMenuOpen
                    ? 'rotate(45deg) translate(5px, 5px)'
                    : '',
                }}
                aria-hidden="true"
              />
              <span style={{ opacity: isMobileMenuOpen ? '0' : '' }} aria-hidden="true" />
              <span
                style={{
                  transform: isMobileMenuOpen
                    ? 'rotate(-45deg) translate(5px, -5px)'
                    : '',
                }}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}
        role="navigation"
        aria-label="Mobile navigation"
        aria-hidden={!isMobileMenuOpen}
      >
        <ul role="menubar">
          <li role="none">
            <a
              href="#hero"
              className="mobile-nav-link"
              onClick={onMenuToggle}
              role="menuitem"
            >
              Home
            </a>
          </li>
          <li role="none">
            <a
              href="#products"
              className="mobile-nav-link"
              onClick={onMenuToggle}
              role="menuitem"
            >
              Shop
            </a>
          </li>
          <li role="none">
            <a
              href="#features"
              className="mobile-nav-link"
              onClick={onMenuToggle}
              role="menuitem"
            >
              Features
            </a>
          </li>
          <li role="none">
            <a
              href="#testimonials"
              className="mobile-nav-link"
              onClick={onMenuToggle}
              role="menuitem"
            >
              Reviews
            </a>
          </li>
          <li role="none">
            <Link
              href="/"
              className="mobile-nav-link"
              onClick={onMenuToggle}
              role="menuitem"
            >
              AURA AI
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}
