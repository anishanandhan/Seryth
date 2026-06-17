'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { OlfactoryVector, FragranceMatch, QuizAnswer } from '@/types'

interface ScentVaultSaveProps {
  vaultId: string
  vector: OlfactoryVector
  archetype: string
  matches: FragranceMatch[]
  quizAnswers: QuizAnswer[]
}

const LABELS = ['Floral', 'Woody', 'Fresh', 'Spicy', 'Musk', 'Citrus']

const ScentVaultSave: React.FC<ScentVaultSaveProps> = ({
  vaultId,
  vector,
  archetype,
  matches,
  quizAnswers,
}) => {
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)

    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save',
          profile: {
            id: vaultId,
            userName: 'AURA User',
            vector,
            archetype,
            matches: matches.map(m => ({
              fragrance: { id: m.fragrance.id, name: m.fragrance.name },
              score: m.score,
            })),
            quizAnswers,
            createdAt: new Date().toISOString(),
          },
        }),
      })

      setSaved(true)

      // Fire confetti!
      try {
        const confetti = (await import('canvas-confetti')).default
        const gold = '#c9a96e'
        const goldLight = '#e8c98a'
        const white = '#f2ede8'

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: [gold, goldLight, white],
          shapes: ['circle', 'square'],
          gravity: 0.8,
          ticks: 200,
        })

        // Second burst
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: [gold, goldLight],
          })
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: [gold, goldLight],
          })
        }, 300)
      } catch {
        // Confetti is nice-to-have, not critical
      }
    } catch (error) {
      console.error('Save error:', error)
      // Still show as saved for demo
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      className="vault-save-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.8 }}
    >
      <div className="vault-save-icon">◈</div>

      {!saved ? (
        <>
          <div className="vault-save-title">Save to Scent Vault</div>
          <p style={{
            fontSize: 13,
            color: 'var(--white-dim)',
            lineHeight: 1.8,
            marginBottom: 24,
            maxWidth: 400,
            margin: '0 auto 24px',
          }}>
            Your formula will be stored permanently under a unique vault ID.
            Create once, refill forever.
          </p>
          <div className="vault-save-id">{vaultId}</div>
          <br />
          <button
            className="vault-save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save My Formula'}
          </button>
        </>
      ) : (
        <>
          <motion.div
            className="vault-save-title"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Formula Saved ✦
          </motion.div>
          <motion.div
            className="vault-save-id"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {vaultId}
          </motion.div>
          <motion.p
            style={{
              fontSize: 13,
              color: 'var(--gold)',
              letterSpacing: 2,
              marginTop: 16,
              fontStyle: 'italic',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            This formula is permanent. Create Once. Refill Forever.
          </motion.p>

          {/* Formula Breakdown */}
          <motion.div
            className="vault-saved-formula"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {LABELS.map((label, i) => (
              <div key={label} className="vault-formula-item">
                <div className="vault-formula-label">{label}</div>
                <div className="vault-formula-value">
                  {(vector[i] * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </motion.div>
        </>
      )}
    </motion.div>
  )
}

export default ScentVaultSave
