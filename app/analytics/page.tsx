'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AnalyticsOverview } from '@/components/analytics/AnalyticsOverview'
import { UserSegments } from '@/components/analytics/UserSegments'
import { CampaignManager } from '@/components/analytics/CampaignManager'
import { AudienceBuilder } from '@/components/analytics/AudienceBuilder'
import { IntegrationHub } from '@/components/analytics/IntegrationHub'
import './analytics.scss'

type TabType = 'overview' | 'segments' | 'campaigns' | 'audiences' | 'integrations'

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [password, setPassword] = useState('')

  // Simple auth check (in production, use proper authentication)
  useEffect(() => {
    const auth = localStorage.getItem('aura-admin-auth')
    if (auth === 'authorized') {
      setIsAuthorized(true)
    }
  }, [])

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    // Demo password - in production use proper auth
    if (password === 'epsilon2026') {
      localStorage.setItem('aura-admin-auth', 'authorized')
      setIsAuthorized(true)
    } else {
      alert('Invalid credentials')
    }
  }

  if (!isAuthorized) {
    return (
      <div className="analytics-auth">
        <div className="auth-card">
          <div className="auth-logo">
            <span className="logo-icon">◈</span>
            <h1>AURA Analytics</h1>
          </div>
          <p className="auth-subtitle">MarTech Intelligence Platform</p>
          <form onSubmit={handleAuth} className="auth-form">
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              aria-label="Admin password"
            />
            <button type="submit" className="auth-button">
              Access Dashboard
            </button>
          </form>
          <p className="auth-hint">Demo password: epsilon2026</p>
          <Link href="/" className="auth-back">
            ← Back to AURA
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="analytics-container">
      {/* Header */}
      <header className="analytics-header">
        <div className="header-content">
          <div className="header-brand">
            <Link href="/" className="brand-link">
              <span className="logo-icon">◈</span>
              <span className="logo-text">AURA</span>
            </Link>
            <span className="header-divider">/</span>
            <h1 className="header-title">Analytics</h1>
          </div>
          <div className="header-actions">
            <button
              className="btn-export"
              onClick={() => alert('Export functionality - see Audience Builder tab')}
              aria-label="Export data"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Export
            </button>
            <button
              className="btn-logout"
              onClick={() => {
                localStorage.removeItem('aura-admin-auth')
                setIsAuthorized(false)
              }}
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="analytics-nav" role="tablist">
        <button
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
          role="tab"
          aria-selected={activeTab === 'overview'}
          aria-controls="overview-panel"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          Overview
        </button>
        <button
          className={`nav-tab ${activeTab === 'segments' ? 'active' : ''}`}
          onClick={() => setActiveTab('segments')}
          role="tab"
          aria-selected={activeTab === 'segments'}
          aria-controls="segments-panel"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          User Segments
        </button>
        <button
          className={`nav-tab ${activeTab === 'campaigns' ? 'active' : ''}`}
          onClick={() => setActiveTab('campaigns')}
          role="tab"
          aria-selected={activeTab === 'campaigns'}
          aria-controls="campaigns-panel"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          Campaigns
        </button>
        <button
          className={`nav-tab ${activeTab === 'audiences' ? 'active' : ''}`}
          onClick={() => setActiveTab('audiences')}
          role="tab"
          aria-selected={activeTab === 'audiences'}
          aria-controls="audiences-panel"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <polyline points="17 11 19 13 23 9" />
          </svg>
          Audience Builder
        </button>
        <button
          className={`nav-tab ${activeTab === 'integrations' ? 'active' : ''}`}
          onClick={() => setActiveTab('integrations')}
          role="tab"
          aria-selected={activeTab === 'integrations'}
          aria-controls="integrations-panel"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
          </svg>
          Integrations
        </button>
      </nav>

      {/* Content Panels */}
      <main className="analytics-main">
        {activeTab === 'overview' && (
          <div id="overview-panel" role="tabpanel">
            <AnalyticsOverview />
          </div>
        )}
        {activeTab === 'segments' && (
          <div id="segments-panel" role="tabpanel">
            <UserSegments />
          </div>
        )}
        {activeTab === 'campaigns' && (
          <div id="campaigns-panel" role="tabpanel">
            <CampaignManager />
          </div>
        )}
        {activeTab === 'audiences' && (
          <div id="audiences-panel" role="tabpanel">
            <AudienceBuilder />
          </div>
        )}
        {activeTab === 'integrations' && (
          <div id="integrations-panel" role="tabpanel">
            <IntegrationHub />
          </div>
        )}
      </main>
    </div>
  )
}
