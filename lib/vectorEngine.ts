import type { OlfactoryVector } from '@/types'

/**
 * Compute a 6D olfactory vector from quiz answers.
 * Each answer contributes weights to the 6 dimensions.
 */
export function computeVectorFromAnswers(
  answerWeights: OlfactoryVector[]
): OlfactoryVector {
  if (answerWeights.length === 0) {
    return [0, 0, 0, 0, 0, 0]
  }

  // Sum all weights across dimensions
  const summed: OlfactoryVector = [0, 0, 0, 0, 0, 0]
  for (const weights of answerWeights) {
    for (let i = 0; i < 6; i++) {
      summed[i] += weights[i]
    }
  }

  // Normalize to 0–1 range
  return normalizeVector(summed)
}

/**
 * Normalize a vector so each component is in [0, 1].
 * Uses min-max normalization relative to the vector's own range.
 */
export function normalizeVector(vector: OlfactoryVector): OlfactoryVector {
  const max = Math.max(...vector, 0.001) // avoid division by zero
  return vector.map(v => Math.min(1, Math.max(0, v / max))) as OlfactoryVector
}

/**
 * Cosine similarity between two 6D vectors.
 * Returns a value between 0 and 1 (higher = more similar).
 */
export function cosineSimilarity(a: OlfactoryVector, b: OlfactoryVector): number {
  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < 6; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB)
  if (denominator === 0) return 0

  return dotProduct / denominator
}

/**
 * Adjust a vector based on natural language feedback deltas.
 * e.g., { floral: -0.2, musk: +0.3 }
 */
export function adjustVector(
  current: OlfactoryVector,
  deltas: Partial<Record<string, number>>
): OlfactoryVector {
  const dimensionMap: Record<string, number> = {
    floral: 0, woody: 1, fresh: 2, spicy: 3, musk: 4, citrus: 5
  }

  const adjusted = [...current] as OlfactoryVector
  for (const [dim, delta] of Object.entries(deltas)) {
    const idx = dimensionMap[dim.toLowerCase()]
    if (idx !== undefined && delta !== undefined) {
      adjusted[idx] = Math.min(1, Math.max(0, adjusted[idx] + delta))
    }
  }

  return adjusted
}

/**
 * Determine the user's olfactory archetype based on their vector.
 */
export function determineArchetype(vector: OlfactoryVector): string {
  const labels = ['Floral', 'Woody', 'Fresh', 'Spicy', 'Musk', 'Citrus']
  
  // Find top 2 dimensions
  const indexed = vector.map((v, i) => ({ value: v, label: labels[i] }))
  indexed.sort((a, b) => b.value - a.value)

  const primary = indexed[0]
  const secondary = indexed[1]

  // Archetype mapping based on dominant dimensions
  const archetypeMap: Record<string, Record<string, string>> = {
    Floral: {
      Woody: 'The Romantic Wanderer',
      Fresh: 'The Garden Dreamer',
      Spicy: 'The Velvet Rebel',
      Musk: 'The Midnight Bloom',
      Citrus: 'The Radiant Spirit',
    },
    Woody: {
      Floral: 'The Noble Poet',
      Fresh: 'The Forest Sage',
      Spicy: 'The Ember King',
      Musk: 'The Dark Architect',
      Citrus: 'The Coastal Pioneer',
    },
    Fresh: {
      Floral: 'The Morning Muse',
      Woody: 'The Alpine Nomad',
      Spicy: 'The Electric Current',
      Musk: 'The Silver Thread',
      Citrus: 'The Crystal Wave',
    },
    Spicy: {
      Floral: 'The Silk Phoenix',
      Woody: 'The Spice Navigator',
      Fresh: 'The Storm Chaser',
      Musk: 'The Velvet Shadow',
      Citrus: 'The Golden Flame',
    },
    Musk: {
      Floral: 'The Night Orchid',
      Woody: 'The Stone Temple',
      Fresh: 'The Ghost Whisper',
      Spicy: 'The Obsidian Crown',
      Citrus: 'The Amber Tide',
    },
    Citrus: {
      Floral: 'The Sun Painter',
      Woody: 'The Driftwood Soul',
      Fresh: 'The Zephyr Rider',
      Spicy: 'The Tropic Thunder',
      Musk: 'The Silk Road',
    },
  }

  return archetypeMap[primary.label]?.[secondary.label] || 'The Enigma'
}

/**
 * Generate a unique Scent Vault ID.
 */
export function generateVaultId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 3; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  const year = new Date().getFullYear()
  return `SERYTH-${code}-${year}`
}

/**
 * Format a vector for display with percentage values.
 */
export function formatVectorForDisplay(vector: OlfactoryVector): {
  label: string
  value: number
  percentage: string
}[] {
  const labels = ['Floral', 'Woody', 'Fresh', 'Spicy', 'Musk', 'Citrus']
  return labels.map((label, i) => ({
    label,
    value: vector[i],
    percentage: `${Math.round(vector[i] * 100)}%`,
  }))
}
