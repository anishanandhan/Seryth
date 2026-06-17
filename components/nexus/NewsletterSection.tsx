'use client'

interface NewsletterSectionProps {
  emailInput: string
  isSubscribed: boolean
  onEmailChange: (email: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function NewsletterSection({
  emailInput,
  isSubscribed,
  onEmailChange,
  onSubmit,
}: NewsletterSectionProps) {
  return (
    <section className="newsletter" aria-labelledby="newsletter-heading">
      <div className="container">
        <div className="newsletter-card">
          <div className="newsletter-content">
            <div className="section-badge">Stay Connected</div>
            <h2 id="newsletter-heading">
              Get Exclusive <span className="gradient-text">Early Access</span>
            </h2>
            <p>
              Join 50,000+ tech enthusiasts. Be the first to know about new drops and exclusive
              deals.
            </p>
            <form className="newsletter-form" onSubmit={onSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  className="newsletter-input"
                  placeholder="Enter your email address"
                  aria-label="Email address for newsletter"
                  value={emailInput}
                  onChange={(e) => onEmailChange(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="btn-subscribe"
                  style={{
                    background: isSubscribed ? 'linear-gradient(135deg, #10b981, #06b6d4)' : '',
                  }}
                  aria-label={isSubscribed ? 'Subscribed' : 'Subscribe to newsletter'}
                >
                  {isSubscribed ? '✓ Subscribed!' : 'Subscribe'}
                </button>
              </div>
              <p className="form-note">No spam ever. Unsubscribe anytime.</p>
            </form>
          </div>
          <div className="newsletter-visual" aria-hidden="true">
            <div className="nl-glow" />
            <div className="nl-icon">📬</div>
          </div>
        </div>
      </div>
    </section>
  )
}
