'use client'

export function HeroSection() {
  return (
    <section className="hero" id="hero" role="banner">
      <div className="hero-content">
        <div className="hero-badge" aria-label="New Collection 2026">
          ✦ New Collection 2026
        </div>
        <h1 className="hero-title">
          Tech That
          <br />
          <span className="gradient-text">Transcends</span>
          <br />
          Reality
        </h1>
        <p className="hero-subtitle">
          Experience the future of premium electronics. Crafted for those who demand nothing but
          the extraordinary.
        </p>
        <div className="hero-cta">
          <a href="#products" className="btn-primary" aria-label="Shop now">
            <span>Shop Now</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#features" className="btn-secondary" aria-label="Learn more about NEXUS">
            Learn More
          </a>
        </div>
        <div className="hero-stats" role="group" aria-label="NEXUS statistics">
          <div className="stat">
            <span className="stat-number">50K+</span>
            <span className="stat-label">Happy Customers</span>
          </div>
          <div className="stat-divider" aria-hidden="true" />
          <div className="stat">
            <span className="stat-number">4.9★</span>
            <span className="stat-label">Average Rating</span>
          </div>
          <div className="stat-divider" aria-hidden="true" />
          <div className="stat">
            <span className="stat-number">200+</span>
            <span className="stat-label">Premium Products</span>
          </div>
        </div>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="hero-glow" />
        <div className="hero-image-ring" />
        <div className="hero-floating-card card-1">
          <span>🎧</span>
          <div>
            <div className="fc-title">SoundMax Pro</div>
            <div className="fc-price">$299</div>
          </div>
        </div>
        <div className="hero-floating-card card-2">
          <span>⌚</span>
          <div>
            <div className="fc-title">ChronoX Watch</div>
            <div className="fc-price">$499</div>
          </div>
        </div>
        <div className="hero-floating-card card-3">
          <div className="fc-stars">★★★★★</div>
          <div className="fc-review">"Mind-blowing quality!"</div>
        </div>
      </div>
    </section>
  )
}
