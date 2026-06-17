'use client'

export function TestimonialsSection() {
  return (
    <section className="testimonials" id="testimonials" aria-labelledby="testimonials-heading">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">Customer Love</div>
          <h2 className="section-title" id="testimonials-heading">
            What People <span className="gradient-text">Are Saying</span>
          </h2>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-stars" aria-label="5 out of 5 stars">
              ★★★★★
            </div>
            <p className="testimonial-text">
              "The SoundMax Pro headphones completely blew me away. The sound quality is unlike
              anything I've ever experienced at this price point."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar" aria-hidden="true">
                AK
              </div>
              <div className="author-info">
                <div className="author-name">Alex Kim</div>
                <div className="author-role">Music Producer, LA</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card featured-testimonial">
            <div className="testimonial-stars" aria-label="5 out of 5 stars">
              ★★★★★
            </div>
            <p className="testimonial-text">
              "NEXUS is the only place I trust for my tech. The Aether SL is the best laptop I've
              ever owned — insane performance and stunning design."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar" aria-hidden="true">
                SR
              </div>
              <div className="author-info">
                <div className="author-name">Sofia Reyes</div>
                <div className="author-role">UX Designer, NYC</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-stars" aria-label="5 out of 5 stars">
              ★★★★★
            </div>
            <p className="testimonial-text">
              "Fast shipping, incredible packaging, and the ChronoX Watch is genuinely a
              game-changer for my daily fitness routine. Highly recommend!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar" aria-hidden="true">
                MJ
              </div>
              <div className="author-info">
                <div className="author-name">Marcus Johnson</div>
                <div className="author-role">Fitness Coach, Chicago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
