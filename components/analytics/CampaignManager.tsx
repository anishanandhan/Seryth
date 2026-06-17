'use client'

import { useState } from 'react'
import './analytics.scss'

interface Campaign {
  id: string
  name: string
  status: 'active' | 'paused' | 'draft'
  targetSegment: string
  budget: number
  spend: number
  impressions: number
  clicks: number
  conversions: number
  roas: number
}

export function CampaignManager() {
  const [campaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'ENFP Citrus Lovers - Summer Campaign',
      status: 'active',
      targetSegment: 'ENFP',
      budget: 5000,
      spend: 3240,
      impressions: 45000,
      clicks: 1350,
      conversions: 89,
      roas: 4.2,
    },
    {
      id: '2',
      name: 'INTJ Woody & Sophisticated',
      status: 'active',
      targetSegment: 'INTJ',
      budget: 4000,
      spend: 2100,
      impressions: 32000,
      clicks: 960,
      conversions: 72,
      roas: 5.1,
    },
    {
      id: '3',
      name: 'ISFP Floral Garden Collection',
      status: 'paused',
      targetSegment: 'ISFP',
      budget: 3500,
      spend: 890,
      impressions: 12000,
      clicks: 420,
      conversions: 18,
      roas: 2.8,
    },
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-active'
      case 'paused':
        return 'status-paused'
      default:
        return 'status-draft'
    }
  }

  const calculateCTR = (clicks: number, impressions: number) => {
    return ((clicks / impressions) * 100).toFixed(2)
  }

  const calculateCVR = (conversions: number, clicks: number) => {
    return ((conversions / clicks) * 100).toFixed(2)
  }

  return (
    <div className="campaigns-container">
      <div className="campaigns-header">
        <div>
          <h2>Campaign Manager</h2>
          <p className="campaigns-subtitle">Personality-targeted marketing campaigns</p>
        </div>
        <button className="btn-create-campaign" onClick={() => setShowCreateForm(!showCreateForm)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Campaign
        </button>
      </div>

      {showCreateForm && (
        <div className="create-campaign-form">
          <h3>Create New Campaign</h3>
          <form onSubmit={(e) => { e.preventDefault(); alert('Campaign creation - integrate with your ad platform'); }}>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="campaign-name">Campaign Name</label>
                <input id="campaign-name" type="text" placeholder="e.g., ENFP Spring Launch" required />
              </div>
              <div className="form-field">
                <label htmlFor="target-segment">Target Segment</label>
                <select id="target-segment" required>
                  <option value="">Select MBTI Type</option>
                  <option value="ENFP">ENFP - The Radiant Nomad</option>
                  <option value="INTJ">INTJ - The Dark Architect</option>
                  <option value="ISFP">ISFP - The Garden Poet</option>
                  <option value="INFJ">INFJ - The Mystic Sage</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="budget">Budget ($)</label>
                <input id="budget" type="number" placeholder="5000" required />
              </div>
              <div className="form-field">
                <label htmlFor="duration">Duration (days)</label>
                <input id="duration" type="number" placeholder="30" required />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-submit">Create Campaign</button>
              <button type="button" className="btn-cancel" onClick={() => setShowCreateForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Campaign Performance Table */}
      <div className="campaigns-table">
        <table>
          <thead>
            <tr>
              <th>Campaign Name</th>
              <th>Status</th>
              <th>Segment</th>
              <th>Budget</th>
              <th>Impressions</th>
              <th>CTR</th>
              <th>Conversions</th>
              <th>CVR</th>
              <th>ROAS</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td className="campaign-name">{campaign.name}</td>
                <td>
                  <span className={`status-badge ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="segment-cell">{campaign.targetSegment}</td>
                <td className="budget-cell">
                  ${campaign.spend.toLocaleString()} / ${campaign.budget.toLocaleString()}
                </td>
                <td>{campaign.impressions.toLocaleString()}</td>
                <td>{calculateCTR(campaign.clicks, campaign.impressions)}%</td>
                <td>{campaign.conversions}</td>
                <td>{calculateCVR(campaign.conversions, campaign.clicks)}%</td>
                <td className={`roas-cell ${campaign.roas >= 4 ? 'roas-good' : campaign.roas >= 2 ? 'roas-ok' : 'roas-poor'}`}>
                  {campaign.roas.toFixed(1)}x
                </td>
                <td>
                  <button className="action-btn" onClick={() => alert('Edit campaign')}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Campaign Insights */}
      <div className="campaign-insights">
        <h3>Performance Insights</h3>
        <div className="insights-cards">
          <div className="insight-card-mini">
            <div className="insight-icon">🚀</div>
            <div>
              <div className="insight-title">Best Performer</div>
              <div className="insight-desc">INTJ campaign: 5.1x ROAS - Consider scaling budget</div>
            </div>
          </div>
          <div className="insight-card-mini">
            <div className="insight-icon">⚠️</div>
            <div>
              <div className="insight-title">Needs Attention</div>
              <div className="insight-desc">ISFP campaign paused - Low CVR suggests creative refresh needed</div>
            </div>
          </div>
          <div className="insight-card-mini">
            <div className="insight-icon">💡</div>
            <div>
              <div className="insight-title">Optimization Tip</div>
              <div className="insight-desc">Test woody/spicy messaging for INTJ segment - 73% preference match</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
