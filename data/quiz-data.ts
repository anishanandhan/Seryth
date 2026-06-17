import type { OlfactoryVector } from '@/types'

// ═══════════════════════════════════════════════════════════
//  MBTI → Olfactory Vector Mapping
//  Based on the Myers-Briggs Type Indicator framework
//  Created by Katharine Cook Briggs & Isabel Briggs Myers
//  4 dichotomies: E/I, S/N, T/F, J/P → 16 types
// ═══════════════════════════════════════════════════════════

/**
 * Each MBTI dimension maps to specific olfactory tendencies:
 * - E (Extraversion): citrus-forward, fresh, radiant
 * - I (Introversion): musk-forward, woody, deep
 * - S (Sensing): woody, spicy, grounded
 * - N (Intuition): floral, fresh, abstract
 * - T (Thinking): woody, citrus, structured
 * - F (Feeling): floral, musk, emotional
 * - J (Judging): woody, spicy, ordered
 * - P (Perceiving): fresh, citrus, spontaneous
 */

// Vector weights for each MBTI pole: [floral, woody, fresh, spicy, musk, citrus]
export const MBTI_WEIGHTS: Record<string, OlfactoryVector> = {
  E: [0.30, 0.05, 0.35, 0.10, 0.05, 0.55],
  I: [0.10, 0.50, 0.05, 0.30, 0.60, 0.05],
  S: [0.10, 0.45, 0.10, 0.45, 0.30, 0.10],
  N: [0.55, 0.10, 0.45, 0.10, 0.20, 0.30],
  T: [0.05, 0.50, 0.30, 0.20, 0.10, 0.35],
  F: [0.60, 0.10, 0.10, 0.10, 0.55, 0.10],
  J: [0.10, 0.50, 0.10, 0.35, 0.25, 0.10],
  P: [0.20, 0.05, 0.55, 0.10, 0.10, 0.50],
}

// 16 MBTI types → Scent Archetype names
export const MBTI_ARCHETYPES: Record<string, string> = {
  ISTJ: 'The Heritage Guardian',
  ISFJ: 'The Velvet Protector',
  INFJ: 'The Mystic Sage',
  INTJ: 'The Dark Architect',
  ISTP: 'The Silent Storm',
  ISFP: 'The Garden Poet',
  INFP: 'The Dream Weaver',
  INTP: 'The Crystal Mind',
  ESTP: 'The Wild Card',
  ESFP: 'The Golden Hour',
  ENFP: 'The Radiant Nomad',
  ENTP: 'The Electric Spark',
  ESTJ: 'The Iron Compass',
  ESFJ: 'The Warm Hearth',
  ENFJ: 'The Silk Phoenix',
  ENTJ: 'The Crown Bearer',
}

export interface MBTIQuestion {
  id: number
  dimension: string // 'EI' | 'SN' | 'TF' | 'JP'
  category: string
  question: string
  optionA: { label: string; letter: string }
  optionB: { label: string; letter: string }
}

export const mbtiQuestions: MBTIQuestion[] = [
  {
    id: 1,
    dimension: 'EI',
    category: 'Social Energy',
    question: "You enter a room filled with people you've never met. What's your first instinct?",
    optionA: {
      label:
        'I scan for someone interesting to connect with — people energize me, and I want to be in the middle of it all',
      letter: 'E',
    },
    optionB: {
      label:
        'I find a quiet corner first, observe the room, then choose who to approach — depth over breadth, always',
      letter: 'I',
    },
  },
  {
    id: 2,
    dimension: 'SN',
    category: 'Perception',
    question: 'When you experience a new fragrance for the first time, what do you notice?',
    optionA: {
      label:
        'The specific ingredients — "that\'s definitely bergamot layered over leather with a vanilla dry-down"',
      letter: 'S',
    },
    optionB: {
      label:
        'The feeling it evokes — "this smells like a November afternoon, or a letter I never sent"',
      letter: 'N',
    },
  },
  {
    id: 3,
    dimension: 'TF',
    category: 'Decision Making',
    question: 'Someone asks why you chose your signature scent. You answer:',
    optionA: {
      label:
        'The longevity is exceptional, the silage is perfect for my skin chemistry, and the price-to-quality ratio is unmatched',
      letter: 'T',
    },
    optionB: {
      label:
        'It reminds me of someone I loved. Wearing it feels like carrying a piece of them with me wherever I go',
      letter: 'F',
    },
  },
  {
    id: 4,
    dimension: 'JP',
    category: 'Lifestyle',
    question: 'How do you choose a fragrance for the day?',
    optionA: {
      label:
        'I have a rotation system — this one for work, that one for evenings, a specific bottle for special occasions',
      letter: 'J',
    },
    optionB: {
      label:
        'I open everything, smell them all, and go with whatever matches my mood right now — rules kill spontaneity',
      letter: 'P',
    },
  },
]

// Bonus 5th question: direct scent preference (not MBTI, adds nuance to vector)
export interface ScentQuestion {
  id: number
  category: string
  question: string
  options: { label: string; weights: OlfactoryVector }[]
}

export const scentQuestion: ScentQuestion = {
  id: 5,
  category: 'Scent Instinct',
  question: 'Close your eyes. Which scent world calls to you?',
  options: [
    {
      label: 'A midnight garden — dark roses, burning incense, velvet petals wet with dew',
      weights: [0.70, 0.20, 0.05, 0.40, 0.55, 0.05],
    },
    {
      label: 'A rain-washed forest at dawn — pine needles, cold earth, crystal-clear air',
      weights: [0.05, 0.40, 0.80, 0.05, 0.15, 0.25],
    },
    {
      label: 'A golden spice market at sunset — cardamot, saffron, warm skin, smoldering wood',
      weights: [0.10, 0.45, 0.05, 0.80, 0.40, 0.10],
    },
    {
      label: 'A sunlit citrus grove by the Mediterranean — lemon zest, sea salt, white linen',
      weights: [0.15, 0.05, 0.40, 0.05, 0.10, 0.85],
    },
  ],
}
