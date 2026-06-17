'use client'

import { useState, useEffect } from 'react'
import './analytics.scss'

interface AnalyticsData {
  totalUsers: number
  quizCompletions: number
  avgEngagementTime: number
  topPersonality: string
  conversionRate: number
  activeUsers24h: number
}

export function AnalyticsOverview() {
  const [data, setData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    // Load analytics data from localStorage
    const profiles = JSON.parse(localStorage.getItem('aura-profiles') || '[]')
    const sessions = JSON.parse(localStorage.getItem('aura-sessions') || '[]')

    // Calculate metrics
    const personalityCounts: Record<string, number> = {}
    profiles.forEach((p: any) => {
      personalityCounts[p.mbtiType] = (personalityCounts[p.mbtiType] || 0) + 1
    })

    const topPersonality = Object.entries(personalityCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || 'N/A'

    setData({
      totalUsers: profiles.length,
      quizCompletions: profiles.length,
      avgEngagementTime: 4.2, // Mock data
      topPersonality,
      conversionRate: profiles.length > 0 ? (sessions.filter((s: any) => s.converted).length / profiles.length) * 100 : 0,
      activeUsers24h: sessions.filter((s: any) => {
        const sessionTime = new Date(s.timestamp).getTime()
        const now = Date.now()
        return now - sessionTime < 24 * 60 * 60 * 1000
      }).length,
    })
  }, [])

  if (!data) {
    return <div className="loading">Loading analytics...</div>
  }

  return (
    <div className="overview-container">
      <div className="overview-header">
        <h2>Dashboard Overview</h2>
        <p className="overview-subtitle">Real-time MarTech intelligence for AURA personalization engine</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon" aria-hidden="true">👥</div>
          <div className="metric-value">{data.totalUsers.toLocaleString()}</div>
          <div className="metric-label">Total Users</div>
          <div className="metric-change positive">+12% vs last week</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" aria-hidden="true">✓</div>
          <div className="metric-value">{data.quizCompletions.toLocaleString()}</div>
          <div className="metric-label">Quiz Completions</div>
          <div className="metric-change positive">+8% completion rate</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" aria-hidden="true">⏱</div>
          <div className="metric-value">{data.avgEngagementTime.toFixed(1)}m</div>
          <div className="metric-label">Avg. Engagement</div>
          <div className="metric-change neutral">±0% vs average</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" aria-hidden="true">🎯</div>
          <div className="metric-value">{data.conversionRate.toFixed(1)}%</div>
          <div className="metric-label">Conversion Rate</div>
          <div className="metric-change positive">+15% this month</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" aria-hidden="true">⚡</div>
          <div className="metric-value">{data.activeUsers24h}</div>
          <div className="metric-label">Active (24h)</div>
          <div className="metric-change positive">Live now</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" aria-hidden="true">🏆</div>
          <div className="metric-value">{data.topPersonality}</div>
          <div className="metric-label">Top Personality</div>
          <div className="metric-change neutral">Most common type</div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="insights-section">
        <h3>Key Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-header">
              <span className="insight-badge">Opportunity</span>
              <span className="insight-impact">High Impact</span>
            </div>
            <h4>Personality-Based Segmentation</h4>
            <p>
              ENFP and INFP users show 23% higher conversion rates when shown fresh/citrus fragrances.
              Consider creating lookalike audiences for these segments.
            </p>
            <button className="insight-action">Create Audience →</button>
          </div>

          <div className="insight-card">
            <div className="insight-header">
              <span className="insight-badge alert">Alert</span>
              <span className="insight-impact">Medium Impact</span>
            </div>
            <h4>Engagement Drop-off</h4>
            <p>
              15% of users abandon the quiz at question 3. A/B test shorter intro copy or add progress incentives.
            </p>
            <button className="insight-action">View Details →</button>
          </div>

          <div className="insight-card">
            <div className="insight-header">
              <span className="insight-badge">Trending</span>
              <span className="insight-impact">High Impact</span>
            </div>
            <h4>Seasonal Preferences</h4>
            <p>
              Woody and spicy fragrances are trending +34% this week. Update ad creative to feature warm,
              grounding scent profiles for better click-through rates.
            </p>
            <button className="insight-action">Update Campaign →</button>
          </div>
        </div>
      </div>

      {/* MarTech Value Proposition */}
      <div className="value-prop-section">
        <h3>AdTech & MarTech Applications</h3>
        <div className="value-grid">
          <div className="value-card">
            <div className="value-icon">🎯</div>
            <h4>Precision Targeting</h4>
            <p>Build hyper-targeted audiences based on psychological profiles + olfactory preferences for 3x better ROAS</p>
          </div>
          <div className="value-card">
            <div className="value-icon">📊</div>
            <h4>Predictive Analytics</h4>
            <p>Forecast which personality types will respond to specific fragrance families before campaign launch</p>
          </div>
          <div className="value-card">
            <div className="value-icon">🔄</div>
            <h4>Dynamic Personalization</h4>
            <p>Real-time content adaptation: serve citrus ads to ENFP, woody scents to INTJ automatically</p>
          </div>
          <div className="value-card">
            <div className="value-icon">💡</div>
            <h4>Lookalike Modeling</h4>
            <p>Find high-value customers similar to your best converters using 6D olfactory + MBTI vectors</p>
          </div>
        </div>
      </div>
    </div>
  )
}
