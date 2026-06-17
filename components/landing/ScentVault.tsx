import React from 'react'

const ScentVault: React.FC = () => {
  return (
    <section className="vault" id="vault">
      <div className="vault-inner">
        <div className="reveal">
          <div className="section-label">The Vault</div>
          <h2 className="vault-title">
            Your Scent,<br /><em>Stored</em><br />Forever
          </h2>
          <p className="vault-text">
            Your fragrance formula is your identity. SERYTH stores every note,
            every proportion, every nuance in a secure digital vault — so you
            can recreate your signature scent anywhere in the world, at any time.
          </p>
          <div className="vault-stats">
            <div>
              <div className="stat-num">∞</div>
              <div className="stat-label">Formulas stored</div>
            </div>
            <div>
              <div className="stat-num">1</div>
              <div className="stat-label">Signature you</div>
            </div>
            <div>
              <div className="stat-num">0</div>
              <div className="stat-label">Bottles wasted</div>
            </div>
            <div>
              <div className="stat-num">5★</div>
              <div className="stat-label">Personalization</div>
            </div>
          </div>
        </div>

        <div className="vault-visual reveal">
          <div className="vault-orb-bg" />
          <div className="vault-circle">
            <div className="vault-center">
              <div className="vault-center-icon">◈</div>
              <div className="vault-center-text">Your Vault</div>
            </div>
            <div className="vault-dot" style={{ top: 0, left: '50%', transform: 'translate(-50%,-50%)' }} />
            <div className="vault-dot" style={{ bottom: 0, left: '50%', transform: 'translate(-50%,50%)' }} />
            <div className="vault-dot" style={{ left: 0, top: '50%', transform: 'translate(-50%,-50%)' }} />
            <div className="vault-dot" style={{ right: 0, top: '50%', transform: 'translate(50%,-50%)' }} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ScentVault
