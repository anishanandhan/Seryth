import React from 'react'

const steps = [
  { num: '01', icon: '✦', name: 'Discovery', text: 'Answer a personality and mood assessment. Describe how you feel, who you are, where you want to go.' },
  { num: '02', icon: '◈', name: 'AI Composition', text: 'Our AI maps your inputs to fragrance notes — woody, floral, citrus, oriental — and composes your signature blend.' },
  { num: '03', icon: '◎', name: 'Scent Identity', text: 'Your fragrance profile is visualized as a mood board and stored permanently in your personal Scent Vault.' },
  { num: '04', icon: '⟳', name: 'Refill Forever', text: 'Order refills online. Your exact formula is retrieved from your vault — same scent, every time, no retest needed.' },
  { num: '05', icon: '◇', name: 'Evolve With You', text: 'As your life changes, SERYTH adapts. Track your scent journey and discover new variations tailored to your seasons.' },
]

const HowItWorks: React.FC = () => {
  return (
    <section className="how" id="how">
      <div className="how-header reveal">
        <div className="section-label">The Experience</div>
        <h2 className="how-title">Fragrance,<br /><em>Reimagined</em></h2>
        <p className="how-desc">
          A five-step journey from personality to personalized scent — entirely digital,
          entirely yours.
        </p>
      </div>

      <div className="steps-grid">
        {steps.map((step, idx) => (
          <div
            key={step.num}
            className="step reveal"
            style={{ transitionDelay: `${idx * 0.1}s` }}
          >
            <div className="step-num">{step.num}</div>
            <div className="step-icon">{step.icon}</div>
            <div className="step-name">{step.name}</div>
            <p className="step-text">{step.text}</p>
          </div>
        ))}

        {/* The SERYTH Way — highlight card */}
        <div
          className="step reveal"
          style={{
            transitionDelay: '0.5s',
            background: 'linear-gradient(135deg, rgba(201,169,110,0.08) 0%, transparent 100%)',
          }}
        >
          <div className="step-num" style={{ color: 'rgba(201,169,110,0.2)' }}>∞</div>
          <div className="step-icon" style={{ borderColor: 'rgba(201,169,110,0.5)' }}>✦</div>
          <div className="step-name" style={{ color: 'var(--gold-light)' }}>The SERYTH Way</div>
          <p className="step-text">
            Not a product. A living identity that grows, refills, and stays uniquely
            yours — across your entire lifetime.
          </p>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
