import React from 'react'

const featuresList = [
  { icon: '✦', name: 'AI Personality Engine', desc: 'MBTI-style personality mapping combined with mood and lifestyle inputs generates your unique fragrance DNA.' },
  { icon: '◈', name: 'Scent Vault', desc: 'Every formula you create is stored in a secure cloud vault — accessible globally, forever. Never lose your scent.' },
  { icon: '◎', name: 'Smart Nudge System', desc: 'Usage tracking and intelligent refill reminders turn fragrance from a one-time purchase into a continuous ritual.' },
  { icon: '◇', name: 'Privacy Mode', desc: 'Voice or silent text input for those who prefer a discreet, accessible fragrance discovery experience.' },
]

const Features: React.FC = () => {
  return (
    <section className="features" id="features">
      <div className="features-layout">
        {/* Phone Wireframe Mockups */}
        <div className="features-visual reveal">
          <div className="phone-orb" />
          <div className="phone-mock phone-mock-1">
            <div className="phone-screen">
              <div className="phone-dot" />
              <div className="phone-block accent" />
              <div className="phone-line" />
              <div className="phone-block" />
              <div className="phone-block" />
              <div className="phone-block tall" />
              <div className="phone-line" />
              <div className="phone-block" />
              <div className="phone-label">Scent Profile</div>
            </div>
          </div>
          <div className="phone-mock phone-mock-2">
            <div className="phone-screen">
              <div className="phone-dot" />
              <div className="phone-block tall accent" />
              <div className="phone-line" />
              <div className="phone-block" />
              <div className="phone-block" />
              <div className="phone-line" />
              <div className="phone-block" />
              <div className="phone-block accent" />
              <div className="phone-label">Seryth Vault</div>
            </div>
          </div>
        </div>

        {/* Feature List */}
        <div>
          <div className="section-label reveal">Core Features</div>
          <h2 className="how-title reveal" style={{ marginBottom: 48 }}>
            Everything in<br /><em>One App</em>
          </h2>
          <ul className="features-list">
            {featuresList.map((feat) => (
              <li key={feat.name} className="feat-item reveal">
                <div className="feat-icon">{feat.icon}</div>
                <div>
                  <div className="feat-name">{feat.name}</div>
                  <p className="feat-desc">{feat.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Features
