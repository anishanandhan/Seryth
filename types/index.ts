// ═══════════════════════════════════════════════════════════
//  AURA by SERYTH — Type Definitions
// ═══════════════════════════════════════════════════════════

/** 6-dimensional olfactory vector: [floral, woody, fresh, spicy, musk, citrus] */
export type OlfactoryVector = [number, number, number, number, number, number]

/** Dimension labels for display and indexing */
export const VECTOR_DIMENSIONS = [
  'Floral',
  'Woody',
  'Fresh',
  'Spicy',
  'Musk',
  'Citrus',
] as const

export type VectorDimension = (typeof VECTOR_DIMENSIONS)[number]

/** A fragrance in the database */
export interface Fragrance {
  id: string
  name: string
  archetype: string
  description: string
  notes: {
    top: string[]
    heart: string[]
    base: string[]
  }
  vector: OlfactoryVector
  mood: string
  season: string
  intensity: 'Light' | 'Moderate' | 'Bold' | 'Intense'
  gender: 'Feminine' | 'Masculine' | 'Unisex'
}

/** A matched fragrance with similarity score */
export interface FragranceMatch {
  fragrance: Fragrance
  score: number // cosine similarity 0–1
}

/** User's scent profile stored in the vault */
export interface ScentProfile {
  id: string // e.g. "SERYTH-A7X-2025"
  userName: string
  vector: OlfactoryVector
  matches: FragranceMatch[]
  archetype: string
  createdAt: string
  quizAnswers?: QuizAnswer[]
}

/** A single quiz answer */
export interface QuizAnswer {
  questionId: number
  selectedOption: number
  label: string
}

/** Quiz question structure */
export interface QuizQuestion {
  id: number
  category: string
  question: string
  options: {
    label: string
    /** How this answer affects each dimension: [floral, woody, fresh, spicy, musk, citrus] */
    weights: OlfactoryVector
  }[]
}

/** Chat message for the streaming AI */
export interface AuraMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
}

/** API response from /api/match */
export interface MatchResponse {
  matches: FragranceMatch[]
  userVector: OlfactoryVector
  archetype: string
}
