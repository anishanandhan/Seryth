'use client'

export function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo">
              <span className="logo-icon" aria-hidden="true">
                ⬡
              </span>
              <span className="logo-text">NEXUS</span>
            </div>
            <p className="footer-tagline">
              Where technology meets artistry. Premium tech for those who demand the extraordinary.
            </p>
            <div className="social-links" role="group" aria-label="Social media links">
              <a href="#" className="social-link" aria-label="Follow us on Twitter">
                𝕏
              </a>
              <a href="#" className="social-link" aria-label="Follow us on Instagram">
                ◻
              </a>
              <a href="#" className="social-link" aria-label="Subscribe on YouTube">
                ▶
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li>
                <a href="#">Audio</a>
              </li>
              <li>
                <a href="#">Wearables</a>
              </li>
              <li>
                <a href="#">Computing</a>
              </li>
              <li>
                <a href="#">Accessories</a>
              </li>
              <li>
                <a href="#">New Arrivals</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li>
                <a href="#">Help Center</a>
              </li>
              <li>
                <a href="#">Track Order</a>
              </li>
              <li>
                <a href="#">Returns</a>
              </li>
              <li>
                <a href="#">Warranty</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="#">About NEXUS</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">Press</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 NEXUS Inc. All rights reserved.</p>
          <div className="payment-icons" aria-label="Accepted payment methods">
            <span>VISA</span>
            <span>MC</span>
            <span>AMEX</span>
            <span>PayPal</span>
            <span>ApplePay</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
