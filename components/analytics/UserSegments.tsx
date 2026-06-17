'use client'

import { useState, useEffect } from 'react'
import { MBTI_ARCHETYPES } from '@/data/quiz-data'
import './analytics.scss'

interface SegmentData {
  mbtiType: string
  archetype: string
  count: number
  percentage: number
  topFragrance: string
  conversionRate: number
  avgVector: number[]
}

export function UserSegments() {
  const [segments, setSegments] = useState<SegmentData[]>([])
  const [sortBy, setSortBy] = useState<'count' | 'conversion'>('count')

  useEffect(() => {
    loadSegmentData()
  }, [])

  const loadSegmentData = () => {
    const profiles = JSON.parse(localStorage.getItem('aura-profiles') || '[]')

    // Group by MBTI type
    const segmentMap: Record<string, any[]> = {}
    profiles.forEach((profile: any) => {
      if (!segmentMap[profile.mbtiType]) {
        segmentMap[profile.mbtiType] = []
      }
      segmentMap[profile.mbtiType].push(profile)
    })

    // Calculate segment stats
    const segmentData: SegmentData[] = Object.entries(segmentMap).map(([mbtiType, users]) => {
      const totalUsers = profiles.length
      const count = users.length
      const percentage = (count / totalUsers) * 100

      // Find most common fragrance preference
      const fragrancePrefs: Record<string, number> = {}
      users.forEach((user: any) => {
        const topNote = getTopOlfactoryNote(user.finalVector)
        fragrancePrefs[topNote] = (fragrancePrefs[topNote] || 0) + 1
      })
      const topFragrance = Object.entries(fragrancePrefs)
        .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || 'N/A'

      // Mock conversion rate (would come from actual tracking)
      const conversionRate = 15 + Math.random() * 35

      // Average vector
      const avgVector = [0, 0, 0, 0, 0, 0]
      users.forEach((user: any) => {
        user.finalVector.forEach((val: number, i: number) => {
          avgVector[i] += val / count
        })
      })

      return {
        mbtiType,
        archetype: MBTI_ARCHETYPES[mbtiType] || 'Unknown',
        count,
        percentage,
        topFragrance,
        conversionRate,
        avgVector,
      }
    })

    setSegments(segmentData.sort((a, b) => b.count - a.count))
  }

  const getTopOlfactoryNote = (vector: number[]) => {
    const notes = ['Floral', 'Woody', 'Fresh', 'Spicy', 'Musk', 'Citrus']
    const maxIndex = vector.indexOf(Math.max(...vector))
    return notes[maxIndex]
  }

  const sortedSegments = [...segments].sort((a, b) => {
    if (sortBy === 'count') return b.count - a.count
    return b.conversionRate - a.conversionRate
  })

  return (
    <div className="segments-container">
      <div className="segments-header">
        <div>
          <h2>User Segments</h2>
          <p className="segments-subtitle">Personality-based cohorts for precision targeting</p>
        </div>
        <div className="segments-controls">
          <label htmlFor="sort-select" className="sr-only">Sort segments by</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="sort-select"
          >
            <option value="count">Sort by Size</option>
            <option value="conversion">Sort by Conversion</option>
          </select>
        </div>
      </div>

      {segments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No segment data yet</h3>
          <p>Complete the AURA quiz to start building personality segments</p>
          <a href="/" className="empty-action">Try AURA Quiz →</a>
        </div>
      ) : (
        <div className="segments-grid">
          {sortedSegments.map((segment) => (
            <div key={segment.mbtiType} className="segment-card">
              <div className="segment-header">
                <div>
                  <h3 className="segment-type">{segment.mbtiType}</h3>
                  <p className="segment-archetype">{segment.archetype}</p>
                </div>
                <div className="segment-size">
                  <div className="size-value">{segment.count}</div>
                  <div className="size-label">users</div>
                </div>
              </div>

              <div className="segment-stats">
                <div className="stat-row">
                  <span className="stat-label">Market Share</span>
                  <span className="stat-value">{segment.percentage.toFixed(1)}%</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Conversion Rate</span>
                  <span className="stat-value highlight">{segment.conversionRate.toFixed(1)}%</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Top Preference</span>
                  <span className="stat-value">{segment.topFragrance}</span>
                </div>
              </div>

              <div className="segment-vector">
                <div className="vector-label">Olfactory Profile</div>
                <div className="vector-bars">
                  {segment.avgVector.map((value, i) => {
                    const notes = ['F', 'W', 'Fr', 'Sp', 'M', 'C']
                    const percentage = value * 100
                    return (
                      <div key={i} className="vector-bar-wrapper" title={notes[i]}>
                        <div className="vector-bar" style={{ height: `${percentage}%` }} />
                        <div className="vector-note">{notes[i]}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="segment-actions">
                <button className="segment-btn primary" onClick={() => alert(`Exporting ${segment.mbtiType} segment...`)}>
                  Export Audience
                </button>
                <button className="segment-btn secondary" onClick={() => alert(`Campaign builder for ${segment.mbtiType}`)}>
                  Create Campaign
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Segment Insights */}
      {segments.length > 0 && (
        <div className="segment-insights">
          <h3>Segment Intelligence</h3>
          <div className="insights-list">
            <div className="insight-item">
              <span className="insight-bullet">•</span>
              <p>
                <strong>High-Value Segment:</strong> {sortedSegments[0]?.mbtiType} users have the highest conversion
                rate at {sortedSegments[0]?.conversionRate.toFixed(1)}%. Consider allocating more ad budget to
                lookalike audiences.
              </p>
            </div>
            <div className="insight-item">
              <span className="insight-bullet">•</span>
              <p>
                <strong>Untapped Opportunity:</strong> Create dedicated campaigns for underserved personality types
                to capture market share from competitors.
              </p>
            </div>
            <div className="insight-item">
              <span className="insight-bullet">•</span>
              <p>
                <strong>Personalization Strategy:</strong> Use olfactory profiles to dynamically serve relevant
                product recommendations in email and display ads.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
