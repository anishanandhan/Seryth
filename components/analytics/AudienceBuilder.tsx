'use client'

import { useState } from 'react'
import './analytics.scss'

interface AudienceFilter {
  mbtiTypes: string[]
  olfactoryPrefs: string[]
  minConversionProb: number
}

export function AudienceBuilder() {
  const [filters, setFilters] = useState<AudienceFilter>({
    mbtiTypes: [],
    olfactoryPrefs: [],
    minConversionProb: 0,
  })

  const [audienceName, setAudienceName] = useState('')
  const [estimatedSize, setEstimatedSize] = useState(0)

  const mbtiTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
    'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP']

  const olfactoryNotes = ['Floral', 'Woody', 'Fresh', 'Spicy', 'Musk', 'Citrus']

  const toggleMBTI = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      mbtiTypes: prev.mbtiTypes.includes(type)
        ? prev.mbtiTypes.filter((t) => t !== type)
        : [...prev.mbtiTypes, type],
    }))
    updateEstimate()
  }

  const toggleOlfactory = (note: string) => {
    setFilters((prev) => ({
      ...prev,
      olfactoryPrefs: prev.olfactoryPrefs.includes(note)
        ? prev.olfactoryPrefs.filter((n) => n !== note)
        : [...prev.olfactoryPrefs, note],
    }))
    updateEstimate()
  }

  const updateEstimate = () => {
    // Mock calculation - in production, query actual user database
    const profiles = JSON.parse(localStorage.getItem('aura-profiles') || '[]')
    const baseSize = profiles.length
    const filterMultiplier = filters.mbtiTypes.length > 0 ? 0.3 : 1
    setEstimatedSize(Math.floor(baseSize * filterMultiplier))
  }

  const exportAudience = (format: 'csv' | 'json' | 'facebook' | 'google') => {
    const profiles = JSON.parse(localStorage.getItem('aura-profiles') || '[]')

    // Filter profiles based on criteria
    const filteredProfiles = profiles.filter((p: any) => {
      if (filters.mbtiTypes.length > 0 && !filters.mbtiTypes.includes(p.mbtiType)) {
        return false
      }
      // Add more filtering logic
      return true
    })

    if (format === 'csv') {
      const csv = convertToCSV(filteredProfiles)
      downloadFile(csv, `${audienceName || 'audience'}.csv`, 'text/csv')
    } else if (format === 'json') {
      const json = JSON.stringify(filteredProfiles, null, 2)
      downloadFile(json, `${audienceName || 'audience'}.json`, 'application/json')
    } else if (format === 'facebook') {
      alert('Facebook Ads integration: Export ' + filteredProfiles.length + ' profiles as Custom Audience')
    } else if (format === 'google') {
      alert('Google Ads integration: Export ' + filteredProfiles.length + ' profiles as Customer Match list')
    }
  }

  const convertToCSV = (data: any[]) => {
    const headers = ['user_id', 'mbti_type', 'archetype', 'top_olfactory_note', 'conversion_score']
    const rows = data.map((p: any) => [
      p.userId || 'anonymous',
      p.mbtiType,
      p.archetype,
      getTopNote(p.finalVector),
      Math.random() * 100, // Mock score
    ])

    return [headers, ...rows].map((row) => row.join(',')).join('\n')
  }

  const getTopNote = (vector: number[]) => {
    const notes = ['Floral', 'Woody', 'Fresh', 'Spicy', 'Musk', 'Citrus']
    return notes[vector.indexOf(Math.max(...vector))]
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="audience-builder-container">
      <div className="audience-header">
        <div>
          <h2>Audience Builder</h2>
          <p className="audience-subtitle">Build precision-targeted audiences for ad platforms</p>
        </div>
      </div>

      <div className="builder-layout">
        {/* Filters Panel */}
        <div className="filters-panel">
          <h3>Audience Criteria</h3>

          <div className="filter-section">
            <label className="filter-label">Audience Name</label>
            <input
              type="text"
              className="audience-name-input"
              placeholder="e.g., High-Intent Woody Lovers"
              value={audienceName}
              onChange={(e) => setAudienceName(e.target.value)}
            />
          </div>

          <div className="filter-section">
            <label className="filter-label">Personality Types</label>
            <div className="checkbox-grid">
              {mbtiTypes.map((type) => (
                <label key={type} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.mbtiTypes.includes(type)}
                    onChange={() => toggleMBTI(type)}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-label">Olfactory Preferences</label>
            <div className="checkbox-grid">
              {olfactoryNotes.map((note) => (
                <label key={note} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.olfactoryPrefs.includes(note)}
                    onChange={() => toggleOlfactory(note)}
                  />
                  <span>{note}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-label" htmlFor="conversion-slider">
              Min. Conversion Probability: {filters.minConversionProb}%
            </label>
            <input
              id="conversion-slider"
              type="range"
              min="0"
              max="100"
              value={filters.minConversionProb}
              onChange={(e) =>
                setFilters({ ...filters, minConversionProb: parseInt(e.target.value) })
              }
              className="conversion-slider"
            />
          </div>

          <div className="estimated-size">
            <div className="size-icon">👥</div>
            <div>
              <div className="size-label">Estimated Audience Size</div>
              <div className="size-value">{estimatedSize.toLocaleString()} users</div>
            </div>
          </div>
        </div>

        {/* Export Panel */}
        <div className="export-panel">
          <h3>Export Audience</h3>
          <p className="export-desc">
            Export your custom audience to advertising platforms or download as a file for further analysis.
          </p>

          <div className="export-options">
            <button className="export-btn facebook" onClick={() => exportAudience('facebook')}>
              <div className="export-icon">📘</div>
              <div>
                <div className="export-title">Facebook Ads</div>
                <div className="export-subtitle">Custom Audience</div>
              </div>
            </button>

            <button className="export-btn google" onClick={() => exportAudience('google')}>
              <div className="export-icon">🎯</div>
              <div>
                <div className="export-title">Google Ads</div>
                <div className="export-subtitle">Customer Match</div>
              </div>
            </button>

            <button className="export-btn csv" onClick={() => exportAudience('csv')}>
              <div className="export-icon">📊</div>
              <div>
                <div className="export-title">Download CSV</div>
                <div className="export-subtitle">For analysis</div>
              </div>
            </button>

            <button className="export-btn json" onClick={() => exportAudience('json')}>
              <div className="export-icon">{ }</div>
              <div>
                <div className="export-title">Download JSON</div>
                <div className="export-subtitle">Raw data</div>
              </div>
            </button>
          </div>

          <div className="lookalike-section">
            <h4>Lookalike Audiences</h4>
            <p>Find users similar to your best converters using AI-powered similarity matching.</p>
            <button className="btn-lookalike" onClick={() => alert('Lookalike audience generation - using cosine similarity on MBTI + olfactory vectors')}>
              Generate Lookalike Audience →
            </button>
          </div>

          <div className="integration-note">
            <div className="note-icon">💡</div>
            <p>
              <strong>Pro Tip:</strong> For maximum ROAS, combine MBTI segments with olfactory preferences.
              Users with aligned personality + scent preferences convert 3.2x better.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
