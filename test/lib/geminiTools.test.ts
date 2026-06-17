import { describe, it, expect } from 'vitest'
import {
  searchFragrancesTool,
  getFragranceDetailsTool,
  adjustVectorTool,
  buildSystemPrompt,
} from '@/lib/geminiTools'

describe('searchFragrancesTool', () => {
  it('has correct description', () => {
    expect(searchFragrancesTool.description).toBeTruthy()
    expect(searchFragrancesTool.description).toContain('fragrance')
    expect(searchFragrancesTool.description).toContain('vector')
  })

  it('requires vector parameter with length 6', () => {
    const schema = searchFragrancesTool.parameters
    expect(schema).toBeTruthy()

    // Test valid vector
    const validResult = schema.safeParse({
      vector: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
      topK: 5,
    })
    expect(validResult.success).toBe(true)
  })

  it('rejects vector with wrong length', () => {
    const schema = searchFragrancesTool.parameters

    // Test invalid vector (too short)
    const invalidResult = schema.safeParse({
      vector: [0.5, 0.5, 0.5],
      topK: 5,
    })
    expect(invalidResult.success).toBe(false)

    // Test invalid vector (too long)
    const invalidResult2 = schema.safeParse({
      vector: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
      topK: 5,
    })
    expect(invalidResult2.success).toBe(false)
  })

  it('has topK parameter with valid range', () => {
    const schema = searchFragrancesTool.parameters

    // Test valid topK
    const valid = schema.safeParse({
      vector: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
      topK: 5,
    })
    expect(valid.success).toBe(true)

    // Test topK minimum
    const minValid = schema.safeParse({
      vector: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
      topK: 1,
    })
    expect(minValid.success).toBe(true)

    // Test topK maximum
    const maxValid = schema.safeParse({
      vector: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
      topK: 10,
    })
    expect(maxValid.success).toBe(true)
  })

  it('rejects topK outside valid range', () => {
    const schema = searchFragrancesTool.parameters

    const tooLow = schema.safeParse({
      vector: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
      topK: 0,
    })
    expect(tooLow.success).toBe(false)

    const tooHigh = schema.safeParse({
      vector: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
      topK: 11,
    })
    expect(tooHigh.success).toBe(false)
  })

  it('applies default topK value', () => {
    const schema = searchFragrancesTool.parameters

    const result = schema.parse({
      vector: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
    })
    expect(result.topK).toBe(5)
  })
})

describe('getFragranceDetailsTool', () => {
  it('has correct description', () => {
    expect(getFragranceDetailsTool.description).toBeTruthy()
    expect(getFragranceDetailsTool.description).toContain('fragrance')
    expect(getFragranceDetailsTool.description).toContain('ID')
  })

  it('requires fragranceId parameter', () => {
    const schema = getFragranceDetailsTool.parameters

    const valid = schema.safeParse({
      fragranceId: 'midnight-peony',
    })
    expect(valid.success).toBe(true)
  })

  it('rejects missing fragranceId', () => {
    const schema = getFragranceDetailsTool.parameters

    const invalid = schema.safeParse({})
    expect(invalid.success).toBe(false)
  })

  it('accepts any string as fragranceId', () => {
    const schema = getFragranceDetailsTool.parameters

    const ids = ['midnight-peony', 'the-enigma', 'ethereal-dew', 'abc-123']
    ids.forEach((id) => {
      const result = schema.safeParse({ fragranceId: id })
      expect(result.success).toBe(true)
    })
  })
})

describe('adjustVectorTool', () => {
  it('has correct description', () => {
    expect(adjustVectorTool.description).toBeTruthy()
    expect(adjustVectorTool.description.toLowerCase()).toContain('adjust')
    expect(adjustVectorTool.description).toContain('vector')
  })

  it('accepts valid adjustments', () => {
    const schema = adjustVectorTool.parameters

    const valid = schema.safeParse({
      adjustments: {
        floral: 0.2,
        woody: -0.3,
        fresh: 0.1,
      },
    })
    expect(valid.success).toBe(true)
  })

  it('accepts all six dimensions', () => {
    const schema = adjustVectorTool.parameters

    const valid = schema.safeParse({
      adjustments: {
        floral: 0.1,
        woody: -0.1,
        fresh: 0.2,
        spicy: -0.2,
        musk: 0.3,
        citrus: -0.3,
      },
    })
    expect(valid.success).toBe(true)
  })

  it('rejects adjustments outside range', () => {
    const schema = adjustVectorTool.parameters

    const tooHigh = schema.safeParse({
      adjustments: { floral: 0.6 },
    })
    expect(tooHigh.success).toBe(false)

    const tooLow = schema.safeParse({
      adjustments: { woody: -0.6 },
    })
    expect(tooLow.success).toBe(false)
  })

  it('accepts adjustments at boundaries', () => {
    const schema = adjustVectorTool.parameters

    const maxValid = schema.safeParse({
      adjustments: { floral: 0.5 },
    })
    expect(maxValid.success).toBe(true)

    const minValid = schema.safeParse({
      adjustments: { woody: -0.5 },
    })
    expect(minValid.success).toBe(true)
  })

  it('accepts empty adjustments', () => {
    const schema = adjustVectorTool.parameters

    const valid = schema.safeParse({
      adjustments: {},
    })
    expect(valid.success).toBe(true)
  })
})

describe('buildSystemPrompt', () => {
  it('returns a non-empty string', () => {
    const prompt = buildSystemPrompt()
    expect(prompt).toBeTruthy()
    expect(typeof prompt).toBe('string')
    expect(prompt.length).toBeGreaterThan(100)
  })

  it('includes AURA branding', () => {
    const prompt = buildSystemPrompt()
    expect(prompt).toContain('AURA')
    expect(prompt).toContain('SERYTH')
  })

  it('describes AI personality', () => {
    const prompt = buildSystemPrompt()
    expect(prompt).toContain('fragrance')
    expect(prompt).toContain('advisor')
  })

  it('mentions 6-dimensional vector', () => {
    const prompt = buildSystemPrompt()
    expect(prompt).toContain('6-dimensional')
    expect(prompt).toContain('Floral')
    expect(prompt).toContain('Woody')
    expect(prompt).toContain('Citrus')
  })

  it('includes user vector when provided', () => {
    const vector = [0.8, 0.2, 0.5, 0.3, 0.6, 0.4]
    const prompt = buildSystemPrompt(vector)
    expect(prompt).toContain('Current user')
    expect(prompt).toContain('80%')
    expect(prompt).toContain('20%')
  })

  it('formats vector percentages correctly', () => {
    const vector = [0.75, 0.5, 0.25, 1.0, 0.0, 0.33]
    const prompt = buildSystemPrompt(vector)
    expect(prompt).toContain('75%')
    expect(prompt).toContain('50%')
    expect(prompt).toContain('25%')
    expect(prompt).toContain('100%')
    expect(prompt).toContain('0%')
    expect(prompt).toContain('33%')
  })

  it('includes matched fragrances when provided', () => {
    const matches = [
      { name: 'Midnight Peony', score: 0.95, archetype: 'Romantic & Soft' },
      { name: 'The Enigma', score: 0.87, archetype: 'Sophisticated & Bold' },
    ]
    const prompt = buildSystemPrompt(undefined, matches)
    expect(prompt).toContain('Midnight Peony')
    expect(prompt).toContain('The Enigma')
    expect(prompt).toContain('95.0%')
    expect(prompt).toContain('87.0%')
  })

  it('includes both vector and matches when both provided', () => {
    const vector = [0.8, 0.2, 0.5, 0.3, 0.6, 0.4]
    const matches = [
      { name: 'Midnight Peony', score: 0.95, archetype: 'Romantic & Soft' },
    ]
    const prompt = buildSystemPrompt(vector, matches)
    expect(prompt).toContain('Current user')
    expect(prompt).toContain('Midnight Peony')
    expect(prompt.length).toBeGreaterThan(500)
  })

  it('mentions Scent Vault feature', () => {
    const prompt = buildSystemPrompt()
    expect(prompt).toContain('Scent Vault')
    expect(prompt).toContain('SERYTH')
  })

  it('mentions Pinecone vector database', () => {
    const prompt = buildSystemPrompt()
    expect(prompt).toContain('Pinecone')
  })

  it('provides guidance on tone', () => {
    const prompt = buildSystemPrompt()
    expect(prompt).toContain('warm')
    expect(prompt).toContain('elegant')
  })

  it('handles empty matches array', () => {
    const prompt = buildSystemPrompt(undefined, [])
    expect(prompt).toBeTruthy()
    expect(typeof prompt).toBe('string')
  })

  it('handles invalid vector length gracefully', () => {
    const invalidVector = [0.5, 0.5] // Too short
    const prompt = buildSystemPrompt(invalidVector as any)
    expect(prompt).toBeTruthy()
    expect(typeof prompt).toBe('string')
  })
})
