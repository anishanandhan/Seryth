'use client'

export function FeaturesSection() {
  return (
    <section className="features" id="features" aria-labelledby="features-heading">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">Why Choose Us</div>
          <h2 className="section-title" id="features-heading">
            Built for the <span className="gradient-text">Extraordinary</span>
          </h2>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" aria-hidden="true">
              🚀
            </div>
            <h3>Same-Day Delivery</h3>
            <p>Order before 2PM for guaranteed same-day delivery in 50+ cities.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" aria-hidden="true">
              🛡️
            </div>
            <h3>2-Year Warranty</h3>
            <p>Every product comes with a comprehensive 2-year warranty and support.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" aria-hidden="true">
              🔄
            </div>
            <h3>30-Day Returns</h3>
            <p>Not satisfied? Return any product within 30 days for a full refund.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" aria-hidden="true">
              💳
            </div>
            <h3>Secure Payments</h3>
            <p>256-bit SSL encryption and support for 20+ payment methods worldwide.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
