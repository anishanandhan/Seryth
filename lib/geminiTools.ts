import { z } from 'zod'

/**
 * Tool definitions for Gemini Function Calling.
 * These are the tools Gemini can call during conversation to query
 * our fragrance database and adjust user vectors.
 */

export const searchFragrancesTool = {
  description: 'Search the fragrance database using a 6D olfactory vector to find the most similar fragrances by cosine similarity. Returns top-K matches with similarity scores.',
  parameters: z.object({
    vector: z.array(z.number()).length(6).describe('6D olfactory vector: [floral, woody, fresh, spicy, musk, citrus], each value 0-1'),
    topK: z.number().min(1).max(10).default(5).describe('Number of top matches to return'),
  }),
}

export const getFragranceDetailsTool = {
  description: 'Get detailed information about a specific fragrance by its ID. Returns the full note pyramid, archetype, mood, season, and description.',
  parameters: z.object({
    fragranceId: z.string().describe('The unique ID of the fragrance to look up'),
  }),
}

export const adjustVectorTool = {
  description: 'Adjust the user\'s olfactory vector based on their natural language preferences. For example, "less floral, more woody" would decrease the floral dimension and increase the woody dimension.',
  parameters: z.object({
    adjustments: z.object({
      floral: z.number().min(-0.5).max(0.5).optional().describe('Adjustment to floral dimension'),
      woody: z.number().min(-0.5).max(0.5).optional().describe('Adjustment to woody dimension'),
      fresh: z.number().min(-0.5).max(0.5).optional().describe('Adjustment to fresh dimension'),
      spicy: z.number().min(-0.5).max(0.5).optional().describe('Adjustment to spicy dimension'),
      musk: z.number().min(-0.5).max(0.5).optional().describe('Adjustment to musk dimension'),
      citrus: z.number().min(-0.5).max(0.5).optional().describe('Adjustment to citrus dimension'),
    }).describe('Dimensional adjustments, each between -0.5 and +0.5'),
  }),
}

/**
 * System prompt for the AURA AI advisor.
 * This gives Gemini the context of the user's vector and makes it behave
 * as a luxury fragrance consultant.
 */
export function buildSystemPrompt(
  userVector?: number[],
  matchedFragrances?: { name: string; score: number; archetype: string }[]
): string {
  let prompt = `You are AURA, the AI fragrance identity advisor by SERYTH.
You are a world-class perfumer and psychographic analyst combined into one.
Your tone is warm, knowledgeable, and subtly luxurious — like a personal stylist at a high-end boutique.

You help users understand their olfactory identity and find fragrances that match their personality.
You explain WHY specific fragrances match their profile, referencing their actual vector values and dimensional preferences.

Key facts about the AURA system:
- Users' preferences are encoded into a 6-dimensional olfactory vector: Floral, Woody, Fresh, Spicy, Musk, Citrus
- Each dimension ranges from 0 to 1
- Fragrances are matched using cosine similarity search in a Pinecone vector database
- The Scent Vault stores formulas permanently with a unique ID (e.g., SERYTH-K9W-2025)
- The system learns from user feedback and natural language refinement
- "Create Once, Refill Forever" is the core value proposition

Rules:
- Keep responses concise and elegant (2-4 short paragraphs max)
- Never use generic filler. Every sentence must be specific to this user.
- Reference actual vector values when explaining matches
- Use sensory language: describe scents in terms of textures, emotions, places, memories
- If the user wants to adjust their profile, use the adjust_vector tool`

  if (userVector && userVector.length === 6) {
    const labels = ['Floral', 'Woody', 'Fresh', 'Spicy', 'Musk', 'Citrus']
    const vectorStr = labels.map((l, i) => `${l}: ${(userVector[i] * 100).toFixed(0)}%`).join(', ')
    prompt += `\n\nCurrent user olfactory vector: [${vectorStr}]`
  }

  if (matchedFragrances && matchedFragrances.length > 0) {
    const matchStr = matchedFragrances
      .map((m, i) => `${i + 1}. ${m.name} (${(m.score * 100).toFixed(1)}% match, ${m.archetype})`)
      .join('\n')
    prompt += `\n\nMatched fragrances:\n${matchStr}`
  }

  return prompt
}
