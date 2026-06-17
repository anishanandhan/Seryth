'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { OlfactoryVector, QuizAnswer, FragranceMatch } from '@/types'
import { computeVectorFromAnswers, generateVaultId } from '@/lib/vectorEngine'
import Quiz from './Quiz'
import RadarChart from './RadarChart'
import VectorBars from './VectorBars'
import MatchCard from './MatchCard'
import StreamingNarrative from './StreamingNarrative'
import ScentVaultSave from './ScentVaultSave'

type Phase = 'quiz' | 'computing' | 'results'

const AuraExperience: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('quiz')
  const [userVector, setUserVector] = useState<OlfactoryVector>([0, 0, 0, 0, 0, 0])
  const [archetype, setArchetype] = useState('')
  const [mbtiType, setMbtiType] = useState('')
  const [matches, setMatches] = useState<FragranceMatch[]>([])
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([])
  const [lovedIds, setLovedIds] = useState<Set<string>>(new Set())
  const [vaultId] = useState(() => generateVaultId())

  const handleQuizComplete = useCallback(async (
    answers: QuizAnswer[],
    weights: OlfactoryVector[],
    quizMbtiType: string,
    quizArchetype: string
  ) => {
    setQuizAnswers(answers)
    const vector = computeVectorFromAnswers(weights)
    setUserVector(vector)
    setMbtiType(quizMbtiType)
    setArchetype(quizArchetype)
    setPhase('computing')

    // Fetch matches from API
    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vector, topK: 5 }),
      })

      if (response.ok) {
        const data = await response.json()
        setMatches(data.matches)
      }
    } catch (error) {
      console.error('Match error:', error)
    }

    // Transition to results after computing animation
    setTimeout(() => setPhase('results'), 3000)
  }, [])

  const handleLove = useCallback((fragranceId: string) => {
    setLovedIds(prev => {
      const next = new Set(prev)
      if (next.has(fragranceId)) {
        next.delete(fragranceId)
      } else {
        next.add(fragranceId)
      }
      return next
    })
  }, [])

  return (
    <div className="aura-page">
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="aura-container">
        {/* Header */}
        <div className="aura-header">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <em>AURA</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {phase === 'quiz' && 'Five questions. Your personality becomes your fragrance.'}
            {phase === 'computing' && 'Mapping your MBTI profile to 6-dimensional olfactory space...'}
            {phase === 'results' && `${mbtiType} — ${archetype}. Here is your scent DNA.`}
          </motion.p>
        </div>

        {/* Phase Content */}
        <AnimatePresence mode="wait">
          {/* ─── Quiz Phase ─── */}
          {phase === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Quiz onComplete={handleQuizComplete} />
            </motion.div>
          )}

          {/* ─── Computing Phase ─── */}
          {phase === 'computing' && (
            <motion.div
              key="computing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="computing-container"
            >
              <div className="computing-title">Analyzing Your Olfactory Profile</div>
              <div className="computing-vector">
                {['Floral', 'Woody', 'Fresh', 'Spicy', 'Musk', 'Citrus'].map((label, i) => (
                  <motion.div
                    key={label}
                    className="computing-dim"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.3 }}
                  >
                    <div className="computing-dim-label">{label}</div>
                    <div className="computing-dim-value">
                      {(userVector[i] * 100).toFixed(0)}%
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="computing-spinner" />
            </motion.div>
          )}

          {/* ─── Results Phase ─── */}
          {phase === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Archetype Badge */}
              <motion.div
                style={{
                  textAlign: 'center',
                  marginBottom: 60,
                  padding: '20px 40px',
                  background: 'rgba(201, 169, 110, 0.06)',
                  border: '1px solid rgba(201, 169, 110, 0.2)',
                  borderRadius: 8,
                  display: 'inline-block',
                  margin: '0 auto 60px',
                  width: 'fit-content',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div style={{ 
                  fontSize: 10, 
                  letterSpacing: 4, 
                  textTransform: 'uppercase' as const, 
                  color: 'var(--gold)', 
                  marginBottom: 8 
                }}>
                  Your Personality Type
                </div>
                <div style={{ 
                  fontFamily: 'Jost, sans-serif', 
                  fontSize: 32, 
                  fontWeight: 300,
                  letterSpacing: 8,
                  color: 'var(--gold-light)',
                  marginBottom: 8,
                }}>
                  {mbtiType}
                </div>
                <div style={{ 
                  fontFamily: 'Cormorant Garamond, serif', 
                  fontSize: 24, 
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: 'var(--white-dim)',
                }}>
                  {archetype}
                </div>
              </motion.div>

              {/* Results Dashboard */}
              <div className="results-container">
                {/* Left: Radar + Vector Bars */}
                <div className="results-left">
                  <RadarChart vector={userVector} />
                  <VectorBars vector={userVector} />
                </div>

                {/* Right: Match Cards */}
                <div className="results-right">
                  {matches.map((match, i) => (
                    <motion.div
                      key={match.fragrance.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.15 }}
                    >
                      <MatchCard
                        match={match}
                        rank={i + 1}
                        isLoved={lovedIds.has(match.fragrance.id)}
                        onLove={handleLove}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Streaming Narrative */}
              <StreamingNarrative
                userVector={userVector}
                archetype={archetype}
                matches={matches}
              />

              {/* Scent Vault Save */}
              <ScentVaultSave
                vaultId={vaultId}
                vector={userVector}
                archetype={archetype}
                matches={matches}
                quizAnswers={quizAnswers}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AuraExperience
