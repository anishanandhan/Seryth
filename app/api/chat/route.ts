import { streamText } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { fragrances } from '@/data/fragrances'
import { cosineSimilarity, adjustVector } from '@/lib/vectorEngine'
import {
  buildSystemPrompt,
} from '@/lib/geminiTools'
import type { OlfactoryVector } from '@/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages, userVector, matchedFragrances } = body

    // Build the context-aware system prompt
    const systemPrompt = buildSystemPrompt(userVector, matchedFragrances)

    const result = await streamText({
      model: google('gemini-2.0-flash'),
      system: systemPrompt,
      messages,
      tools: {
        search_fragrances: {
          description:
            'Search the fragrance database using a 6D olfactory vector to find the most similar fragrances by cosine similarity.',
          parameters: z.object({
            vector: z
              .array(z.number())
              .length(6)
              .describe(
                '6D olfactory vector: [floral, woody, fresh, spicy, musk, citrus], each 0-1'
              ),
            topK: z.number().min(1).max(10).default(5),
          }),
          execute: async ({ vector, topK }) => {
            // Local cosine similarity search
            const results = fragrances
              .map((f) => ({
                id: f.id,
                name: f.name,
                archetype: f.archetype,
                description: f.description,
                mood: f.mood,
                score: cosineSimilarity(vector as OlfactoryVector, f.vector),
                notes: f.notes,
              }))
              .sort((a, b) => b.score - a.score)
              .slice(0, topK)

            return results
          },
        },
        get_fragrance_details: {
          description:
            'Get detailed information about a specific fragrance by its ID.',
          parameters: z.object({
            fragranceId: z.string().describe('The fragrance ID to look up'),
          }),
          execute: async ({ fragranceId }) => {
            const fragrance = fragrances.find((f) => f.id === fragranceId)
            if (!fragrance) return { error: 'Fragrance not found' }
            return fragrance
          },
        },
        adjust_vector: {
          description:
            "Adjust the user's olfactory vector based on preferences. Returns updated vector.",
          parameters: z.object({
            adjustments: z.object({
              floral: z
                .number()
                .min(-0.5)
                .max(0.5)
                .optional()
                .describe('Adjustment to floral dimension'),
              woody: z
                .number()
                .min(-0.5)
                .max(0.5)
                .optional()
                .describe('Adjustment to woody dimension'),
              fresh: z
                .number()
                .min(-0.5)
                .max(0.5)
                .optional()
                .describe('Adjustment to fresh dimension'),
              spicy: z
                .number()
                .min(-0.5)
                .max(0.5)
                .optional()
                .describe('Adjustment to spicy dimension'),
              musk: z
                .number()
                .min(-0.5)
                .max(0.5)
                .optional()
                .describe('Adjustment to musk dimension'),
              citrus: z
                .number()
                .min(-0.5)
                .max(0.5)
                .optional()
                .describe('Adjustment to citrus dimension'),
            }),
          }),
          execute: async ({ adjustments }) => {
            const currentVector: OlfactoryVector = (userVector as OlfactoryVector) || [
              0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
            ]
            const newVector = adjustVector(currentVector, adjustments)
            return {
              previousVector: currentVector,
              newVector,
              adjustments,
            }
          },
        },
      },
      maxSteps: 5,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    
    // Return a non-streaming error response
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
