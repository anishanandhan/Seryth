'use client'

import React from 'react'
import type { FragranceMatch } from '@/types'

interface MatchCardProps {
  match: FragranceMatch
  rank: number
  isLoved: boolean
  onLove: (id: string) => void
}

const MatchCard: React.FC<MatchCardProps> = ({ match, rank, isLoved, onLove }) => {
  const { fragrance, score } = match

  return (
    <div className="match-card">
      <div className="match-card-header">
        <div className="match-card-rank">#{rank}</div>
        <div className="match-card-score">{(score * 100).toFixed(1)}% match</div>
      </div>

      <div className="match-card-name">{fragrance.name}</div>
      <div className="match-card-archetype">{fragrance.archetype}</div>
      <p className="match-card-desc">{fragrance.description}</p>

      <div className="match-card-notes">
        <div className="match-card-note-group">
          <div className="match-card-note-label">Top</div>
          <div className="match-card-note-values">{fragrance.notes.top.join(', ')}</div>
        </div>
        <div className="match-card-note-group">
          <div className="match-card-note-label">Heart</div>
          <div className="match-card-note-values">{fragrance.notes.heart.join(', ')}</div>
        </div>
        <div className="match-card-note-group">
          <div className="match-card-note-label">Base</div>
          <div className="match-card-note-values">{fragrance.notes.base.join(', ')}</div>
        </div>
      </div>

      <div className="match-card-actions">
        <button
          className={`match-action-btn ${isLoved ? 'loved' : ''}`}
          onClick={() => onLove(fragrance.id)}
        >
          {isLoved ? '♥ Loved' : '♡ Love'}
        </button>
        <button className="match-action-btn">
          {fragrance.mood} · {fragrance.season}
        </button>
        <button className="match-action-btn">
          {fragrance.intensity}
        </button>
      </div>
    </div>
  )
}

export default MatchCard
