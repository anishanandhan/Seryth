import React from 'react'
import Link from 'next/link'

const Hero: React.FC = () => {
  return (
    <section className="hero" id="hero">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="hero-content">
        <div className="hero-eyebrow">AI Fragrance Identity</div>
        <h1 className="hero-title">
          Your Scent,<br /><em>Perfectly You</em>
        </h1>
        <p className="hero-subtitle-line">Personalized. Stored. Forever.</p>
        <p className="hero-desc">
          SERYTH reads your personality and emotions to create a signature
          fragrance that is entirely your own — stored in your digital vault,
          refillable anywhere.
        </p>
        <div className="hero-actions">
          <Link href="/aura" className="btn-primary">Discover Your Scent</Link>
          <a href="#how" className="btn-ghost">How It Works</a>
        </div>
      </div>

      <div className="scroll-hint">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  )
}

export default Hero
