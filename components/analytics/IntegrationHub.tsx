'use client'

import './analytics.scss'

interface Integration {
  id: string
  name: string
  category: 'CRM' | 'Ad Platform' | 'Analytics' | 'CDP'
  icon: string
  status: 'connected' | 'available' | 'coming-soon'
  description: string
  features: string[]
}

export function IntegrationHub() {
  const integrations: Integration[] = [
    {
      id: 'salesforce',
      name: 'Salesforce',
      category: 'CRM',
      icon: '☁️',
      status: 'available',
      description: 'Sync personality profiles and olfactory preferences to customer records',
      features: [
        'Bi-directional contact sync',
        'Custom fields for MBTI + olfactory vectors',
        'Lead scoring enhancement',
        'Personalized email templates',
      ],
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      category: 'CRM',
      icon: '🎯',
      status: 'available',
      description: 'Enrich HubSpot contacts with psychographic and fragrance preference data',
      features: [
        'Contact property mapping',
        'Workflow triggers based on personality',
        'Smart content personalization',
        'Segment-based nurture campaigns',
      ],
    },
    {
      id: 'facebook',
      name: 'Meta Ads',
      category: 'Ad Platform',
      icon: '📘',
      status: 'connected',
      description: 'Export custom audiences and lookalikes directly to Facebook/Instagram Ads',
      features: [
        'One-click audience export',
        'Automatic lookalike generation',
        'Dynamic creative optimization',
        'Conversion tracking integration',
      ],
    },
    {
      id: 'google-ads',
      name: 'Google Ads',
      category: 'Ad Platform',
      icon: '🎨',
      status: 'connected',
      description: 'Push MBTI-based audiences to Google Ads for precise targeting',
      features: [
        'Customer Match lists',
        'Similar Audiences',
        'Remarketing tag integration',
        'Smart Bidding optimization',
      ],
    },
    {
      id: 'segment',
      name: 'Segment',
      category: 'CDP',
      icon: '💾',
      status: 'available',
      description: 'Stream personality quiz completions and preferences to your CDP',
      features: [
        'Real-time event streaming',
        'User trait enrichment',
        'Multi-platform distribution',
        'Warehouse sync',
      ],
    },
    {
      id: 'ga4',
      name: 'Google Analytics 4',
      category: 'Analytics',
      icon: '📊',
      status: 'connected',
      description: 'Track quiz engagement and segment performance in GA4',
      features: [
        'Custom event tracking',
        'User properties for MBTI',
        'Conversion funnel analysis',
        'Predictive audiences',
      ],
    },
    {
      id: 'klaviyo',
      name: 'Klaviyo',
      category: 'CRM',
      icon: '📧',
      status: 'coming-soon',
      description: 'Personalize email campaigns based on fragrance personality profiles',
      features: [
        'Profile property sync',
        'Segment-based flows',
        'Predictive analytics',
        'A/B testing',
      ],
    },
    {
      id: 'braze',
      name: 'Braze',
      category: 'CDP',
      icon: '🔥',
      status: 'coming-soon',
      description: 'Orchestrate cross-channel campaigns with AURA personality insights',
      features: [
        'Real-time personalization',
        'Journey orchestration',
        'Multi-channel messaging',
        'Connected content',
      ],
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <span className="status-badge status-connected">Connected</span>
      case 'available':
        return <span className="status-badge status-available">Available</span>
      default:
        return <span className="status-badge status-soon">Coming Soon</span>
    }
  }

  const handleConnect = (integration: Integration) => {
    if (integration.status === 'coming-soon') {
      alert(`${integration.name} integration is coming soon! Join the waitlist.`)
    } else if (integration.status === 'connected') {
      alert(`${integration.name} is already connected. View settings to configure.`)
    } else {
      alert(`OAuth flow for ${integration.name} - In production, this would initiate the connection`)
    }
  }

  return (
    <div className="integration-hub-container">
      <div className="integration-header">
        <div>
          <h2>Integration Hub</h2>
          <p className="integration-subtitle">Connect AURA with your MarTech stack</p>
        </div>
      </div>

      {/* Integrations by Category */}
      {['CRM', 'Ad Platform', 'CDP', 'Analytics'].map((category) => (
        <div key={category} className="integration-category">
          <h3 className="category-title">{category}</h3>
          <div className="integrations-grid">
            {integrations
              .filter((i) => i.category === category)
              .map((integration) => (
                <div key={integration.id} className="integration-card">
                  <div className="integration-card-header">
                    <div className="integration-icon">{integration.icon}</div>
                    <div className="integration-title-section">
                      <h4>{integration.name}</h4>
                      {getStatusBadge(integration.status)}
                    </div>
                  </div>

                  <p className="integration-description">{integration.description}</p>

                  <ul className="integration-features">
                    {integration.features.map((feature, i) => (
                      <li key={i}>
                        <span className="feature-bullet">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`integration-btn ${integration.status}`}
                    onClick={() => handleConnect(integration)}
                  >
                    {integration.status === 'connected'
                      ? 'Configure'
                      : integration.status === 'available'
                        ? 'Connect'
                        : 'Join Waitlist'}
                  </button>
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* API Documentation */}
      <div className="api-docs-section">
        <h3>Developer Resources</h3>
        <div className="docs-grid">
          <div className="doc-card">
            <div className="doc-icon">📚</div>
            <h4>API Documentation</h4>
            <p>RESTful API for programmatic access to AURA personality data and recommendations</p>
            <code className="api-endpoint">POST /api/profile</code>
            <code className="api-endpoint">GET /api/match</code>
            <button className="doc-btn" onClick={() => alert('API docs at /api/docs')}>View Docs</button>
          </div>

          <div className="doc-card">
            <div className="doc-icon">🔌</div>
            <h4>Webhooks</h4>
            <p>Real-time event notifications when users complete quiz or update preferences</p>
            <ul className="webhook-events">
              <li>quiz.completed</li>
              <li>profile.updated</li>
              <li>recommendation.clicked</li>
            </ul>
            <button className="doc-btn" onClick={() => alert('Configure webhooks')}>Setup Webhooks</button>
          </div>

          <div className="doc-card">
            <div className="doc-icon">🔑</div>
            <h4>API Keys</h4>
            <p>Generate and manage API keys for secure integration with your applications</p>
            <div className="api-key-preview">
              <code>aura_pk_live_***************</code>
            </div>
            <button className="doc-btn" onClick={() => alert('Manage API keys')}>Manage Keys</button>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="use-cases-section">
        <h3>Integration Use Cases</h3>
        <div className="use-cases-list">
          <div className="use-case">
            <div className="use-case-number">01</div>
            <div className="use-case-content">
              <h4>E-commerce Personalization</h4>
              <p>
                Sync AURA profiles to Shopify/Salesforce Commerce Cloud. Dynamically recommend products
                based on olfactory preferences. Achieve 40% higher AOV with personalized bundles.
              </p>
            </div>
          </div>

          <div className="use-case">
            <div className="use-case-number">02</div>
            <div className="use-case-content">
              <h4>Paid Social Optimization</h4>
              <p>
                Export MBTI segments to Meta Ads. Create 16 custom audiences (one per personality type).
                Serve tailored creative featuring preferred fragrance families. See 3.2x improvement in CTR.
              </p>
            </div>
          </div>

          <div className="use-case">
            <div className="use-case-number">03</div>
            <div className="use-case-content">
              <h4>Email Marketing Personalization</h4>
              <p>
                Push olfactory profiles to Klaviyo/HubSpot. Segment email lists by personality + scent preference.
                Personalize subject lines, imagery, and product recommendations. Boost open rates by 28%.
              </p>
            </div>
          </div>

          <div className="use-case">
            <div className="use-case-number">04</div>
            <div className="use-case-content">
              <h4>Predictive Lead Scoring</h4>
              <p>
                Enrich CRM contacts with MBTI + olfactory data. Train ML models to predict high-value customers.
                Prioritize outreach to INTJ/ENTJ with woody preferences - highest LTV segment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
