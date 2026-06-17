import { describe, it, expect } from 'vitest'
import type { OlfactoryVector } from '@/types'
import {
  computeVectorFromAnswers,
  normalizeVector,
  cosineSimilarity,
  adjustVector,
  determineArchetype,
  generateVaultId,
  formatVectorForDisplay,
} from '@/lib/vectorEngine'

describe('computeVectorFromAnswers', () => {
  it('returns zero vector for empty input', () => {
    const result = computeVectorFromAnswers([])
    expect(result).toEqual([0, 0, 0, 0, 0, 0])
  })

  it('sums weights across dimensions correctly', () => {
    const weights: OlfactoryVector[] = [
      [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
      [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    ]
    const result = computeVectorFromAnswers(weights)
    expect(result).toEqual([1, 1, 1, 1, 1, 1])
  })

  it('handles single answer weight', () => {
    const weights: OlfactoryVector[] = [[0.8, 0.2, 0.4, 0.6, 0.1, 0.9]]
    const result = computeVectorFromAnswers(weights)
    expect(result.every(v => v >= 0 && v <= 1)).toBe(true)
  })

  it('normalizes result to 0-1 range', () => {
    const weights: OlfactoryVector[] = [
      [2.0, 3.0, 1.5, 4.0, 0.5, 1.0],
      [1.0, 2.0, 0.5, 3.0, 1.5, 2.5],
    ]
    const result = computeVectorFromAnswers(weights)
    result.forEach(v => {
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThanOrEqual(1)
    })
  })

  it('handles zero weights', () => {
    const weights: OlfactoryVector[] = [[0, 0, 0, 0, 0, 0]]
    const result = computeVectorFromAnswers(weights)
    expect(result).toEqual([0, 0, 0, 0, 0, 0])
  })

  it('processes multiple diverse answer weights', () => {
    const weights: OlfactoryVector[] = [
      [0.95, 0.15, 0.30, 0.10, 0.45, 0.10],
      [0.10, 0.50, 0.05, 0.30, 0.60, 0.05],
      [0.70, 0.20, 0.05, 0.40, 0.55, 0.05],
    ]
    const result = computeVectorFromAnswers(weights)
    expect(result.length).toBe(6)
    expect(result.every(v => v >= 0 && v <= 1)).toBe(true)
  })
})

describe('normalizeVector', () => {
  it('normalizes vector to 0-1 range', () => {
    const vector: OlfactoryVector = [10, 20, 30, 40, 50, 60]
    const result = normalizeVector(vector)
    expect(result).toEqual([10/60, 20/60, 30/60, 40/60, 50/60, 1])
  })

  it('handles zero vector', () => {
    const vector: OlfactoryVector = [0, 0, 0, 0, 0, 0]
    const result = normalizeVector(vector)
    expect(result).toEqual([0, 0, 0, 0, 0, 0])
  })

  it('handles vector with one non-zero value', () => {
    const vector: OlfactoryVector = [0, 0, 5, 0, 0, 0]
    const result = normalizeVector(vector)
    expect(result[2]).toBe(1)
    expect(result.filter(v => v === 0).length).toBe(5)
  })

  it('handles negative values', () => {
    const vector: OlfactoryVector = [-5, 10, -3, 8, 0, 12]
    const result = normalizeVector(vector)
    result.forEach(v => {
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThanOrEqual(1)
    })
  })

  it('handles already normalized vector', () => {
    const vector: OlfactoryVector = [0.5, 0.3, 0.7, 0.2, 0.9, 0.4]
    const result = normalizeVector(vector)
    result.forEach(v => {
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThanOrEqual(1)
    })
  })

  it('avoids division by zero', () => {
    const vector: OlfactoryVector = [0, 0, 0, 0, 0, 0]
    const result = normalizeVector(vector)
    expect(result.every(v => !isNaN(v))).toBe(true)
  })
})

describe('cosineSimilarity', () => {
  it('returns 1 for identical vectors', () => {
    const a: OlfactoryVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
    const b: OlfactoryVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
    const similarity = cosineSimilarity(a, b)
    expect(similarity).toBeCloseTo(1, 5)
  })

  it('returns 0 for orthogonal vectors', () => {
    const a: OlfactoryVector = [1, 0, 0, 0, 0, 0]
    const b: OlfactoryVector = [0, 1, 0, 0, 0, 0]
    const similarity = cosineSimilarity(a, b)
    expect(similarity).toBeCloseTo(0, 5)
  })

  it('returns value between 0 and 1 for typical vectors', () => {
    const a: OlfactoryVector = [0.8, 0.2, 0.5, 0.3, 0.6, 0.4]
    const b: OlfactoryVector = [0.7, 0.3, 0.4, 0.5, 0.5, 0.6]
    const similarity = cosineSimilarity(a, b)
    expect(similarity).toBeGreaterThanOrEqual(0)
    expect(similarity).toBeLessThanOrEqual(1)
  })

  it('handles zero vectors without NaN', () => {
    const a: OlfactoryVector = [0, 0, 0, 0, 0, 0]
    const b: OlfactoryVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
    const similarity = cosineSimilarity(a, b)
    expect(similarity).toBe(0)
  })

  it('is symmetric', () => {
    const a: OlfactoryVector = [0.8, 0.2, 0.5, 0.3, 0.6, 0.4]
    const b: OlfactoryVector = [0.7, 0.3, 0.4, 0.5, 0.5, 0.6]
    const sim1 = cosineSimilarity(a, b)
    const sim2 = cosineSimilarity(b, a)
    expect(sim1).toBeCloseTo(sim2, 5)
  })

  it('handles sparse vectors', () => {
    const a: OlfactoryVector = [1, 0, 0, 0, 0, 0]
    const b: OlfactoryVector = [0.5, 0, 0, 0, 0, 0]
    const similarity = cosineSimilarity(a, b)
    expect(similarity).toBeCloseTo(1, 5)
  })

  it('handles opposite-direction vectors', () => {
    const a: OlfactoryVector = [1, 0, 0, 0, 0, 0]
    const b: OlfactoryVector = [0, 0, 0, 0, 0, 1]
    const similarity = cosineSimilarity(a, b)
    expect(similarity).toBeCloseTo(0, 5)
  })
})

describe('adjustVector', () => {
  it('adjusts single dimension correctly', () => {
    const current: OlfactoryVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
    const deltas = { floral: 0.2 }
    const result = adjustVector(current, deltas)
    expect(result[0]).toBeCloseTo(0.7, 5)
  })

  it('adjusts multiple dimensions', () => {
    const current: OlfactoryVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
    const deltas = { floral: 0.2, woody: -0.3, citrus: 0.1 }
    const result = adjustVector(current, deltas)
    expect(result[0]).toBeCloseTo(0.7, 5)
    expect(result[1]).toBeCloseTo(0.2, 5)
    expect(result[5]).toBeCloseTo(0.6, 5)
  })

  it('clamps values to 0-1 range', () => {
    const current: OlfactoryVector = [0.9, 0.1, 0.5, 0.5, 0.5, 0.5]
    const deltas = { floral: 0.5, woody: -0.5 }
    const result = adjustVector(current, deltas)
    expect(result[0]).toBe(1)
    expect(result[1]).toBe(0)
  })

  it('handles negative deltas', () => {
    const current: OlfactoryVector = [0.8, 0.7, 0.6, 0.5, 0.4, 0.3]
    const deltas = { floral: -0.3, musk: -0.2 }
    const result = adjustVector(current, deltas)
    expect(result[0]).toBeCloseTo(0.5, 5)
    expect(result[4]).toBeCloseTo(0.2, 5)
  })

  it('ignores invalid dimension names', () => {
    const current: OlfactoryVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
    const deltas = { invalid: 0.5, floral: 0.2 }
    const result = adjustVector(current, deltas)
    expect(result[0]).toBeCloseTo(0.7, 5)
  })

  it('handles case-insensitive dimension names', () => {
    const current: OlfactoryVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
    const deltas = { Floral: 0.2, WOODY: -0.1 }
    const result = adjustVector(current, deltas)
    expect(result[0]).toBeCloseTo(0.7, 5)
    expect(result[1]).toBeCloseTo(0.4, 5)
  })

  it('returns copy of vector when no deltas provided', () => {
    const current: OlfactoryVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
    const result = adjustVector(current, {})
    expect(result).toEqual(current)
    expect(result).not.toBe(current) // New array
  })

  it('handles all six dimensions', () => {
    const current: OlfactoryVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
    const deltas = {
      floral: 0.1,
      woody: 0.1,
      fresh: 0.1,
      spicy: 0.1,
      musk: 0.1,
      citrus: 0.1,
    }
    const result = adjustVector(current, deltas)
    expect(result).toEqual([0.6, 0.6, 0.6, 0.6, 0.6, 0.6])
  })
})

describe('determineArchetype', () => {
  it('returns archetype for floral-dominant vector', () => {
    const vector: OlfactoryVector = [0.9, 0.1, 0.2, 0.1, 0.3, 0.1]
    const archetype = determineArchetype(vector)
    expect(archetype).toBeTruthy()
    expect(typeof archetype).toBe('string')
  })

  it('returns archetype for woody-dominant vector', () => {
    const vector: OlfactoryVector = [0.1, 0.9, 0.2, 0.3, 0.1, 0.1]
    const archetype = determineArchetype(vector)
    expect(archetype).toBeTruthy()
  })

  it('returns archetype for balanced vector', () => {
    const vector: OlfactoryVector = [0.5, 0.5, 0.3, 0.3, 0.3, 0.3]
    const archetype = determineArchetype(vector)
    expect(archetype).toBeTruthy()
  })

  it('handles edge case of all equal values', () => {
    const vector: OlfactoryVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
    const archetype = determineArchetype(vector)
    expect(archetype).toBeTruthy()
  })

  it('handles zero vector', () => {
    const vector: OlfactoryVector = [0, 0, 0, 0, 0, 0]
    const archetype = determineArchetype(vector)
    expect(archetype).toBeTruthy()
  })

  it('returns different archetypes for different vectors', () => {
    const v1: OlfactoryVector = [0.9, 0.1, 0.1, 0.1, 0.1, 0.1]
    const v2: OlfactoryVector = [0.1, 0.9, 0.1, 0.1, 0.1, 0.1]
    const a1 = determineArchetype(v1)
    const a2 = determineArchetype(v2)
    expect(a1).not.toBe(a2)
  })

  it('handles citrus-fresh combination', () => {
    const vector: OlfactoryVector = [0.1, 0.1, 0.8, 0.1, 0.1, 0.9]
    const archetype = determineArchetype(vector)
    expect(archetype).toBeTruthy()
  })

  it('handles spicy-musk combination', () => {
    const vector: OlfactoryVector = [0.1, 0.2, 0.1, 0.9, 0.8, 0.1]
    const archetype = determineArchetype(vector)
    expect(archetype).toBeTruthy()
  })
})

describe('generateVaultId', () => {
  it('generates ID with correct format', () => {
    const id = generateVaultId()
    expect(id).toMatch(/^SERYTH-[A-Z0-9]{3}-\d{4}$/)
  })

  it('includes current year', () => {
    const id = generateVaultId()
    const year = new Date().getFullYear()
    expect(id).toContain(year.toString())
  })

  it('generates unique IDs', () => {
    const ids = new Set()
    for (let i = 0; i < 100; i++) {
      ids.add(generateVaultId())
    }
    expect(ids.size).toBeGreaterThan(90) // Most should be unique
  })

  it('uses only safe characters', () => {
    const id = generateVaultId()
    const code = id.split('-')[1]
    expect(code).toMatch(/^[A-Z0-9]+$/)
    expect(code).not.toContain('I')
    expect(code).not.toContain('O')
    expect(code).not.toContain('0')
    expect(code).not.toContain('1')
  })

  it('has 3-character code segment', () => {
    const id = generateVaultId()
    const code = id.split('-')[1]
    expect(code.length).toBe(3)
  })
})

describe('formatVectorForDisplay', () => {
  it('returns array with 6 elements', () => {
    const vector: OlfactoryVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
    const result = formatVectorForDisplay(vector)
    expect(result.length).toBe(6)
  })

  it('includes correct labels', () => {
    const vector: OlfactoryVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
    const result = formatVectorForDisplay(vector)
    const labels = result.map(item => item.label)
    expect(labels).toEqual(['Floral', 'Woody', 'Fresh', 'Spicy', 'Musk', 'Citrus'])
  })

  it('formats values as percentages', () => {
    const vector: OlfactoryVector = [0.75, 0.5, 0.25, 1.0, 0.0, 0.33]
    const result = formatVectorForDisplay(vector)
    expect(result[0].percentage).toBe('75%')
    expect(result[1].percentage).toBe('50%')
    expect(result[2].percentage).toBe('25%')
    expect(result[3].percentage).toBe('100%')
    expect(result[4].percentage).toBe('0%')
    expect(result[5].percentage).toBe('33%')
  })

  it('includes raw values', () => {
    const vector: OlfactoryVector = [0.75, 0.5, 0.25, 1.0, 0.0, 0.33]
    const result = formatVectorForDisplay(vector)
    expect(result[0].value).toBe(0.75)
    expect(result[1].value).toBe(0.5)
    expect(result[2].value).toBe(0.25)
  })

  it('handles edge case values', () => {
    const vector: OlfactoryVector = [0, 1, 0.001, 0.999, 0.5, 0.333]
    const result = formatVectorForDisplay(vector)
    expect(result[0].percentage).toBe('0%')
    expect(result[1].percentage).toBe('100%')
    expect(result[2].percentage).toBe('0%')
    expect(result[3].percentage).toBe('100%')
  })
})
