import { NextResponse } from 'next/server'
import { getPineconeIndex } from '@/lib/pinecone'
import { fragrances } from '@/data/fragrances'
import { determineArchetype } from '@/lib/vectorEngine'
import type { OlfactoryVector, FragranceMatch } from '@/types'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { vector, topK = 5 } = body as {
      vector: OlfactoryVector
      topK?: number
    }

    // Validate vector
    if (!vector || !Array.isArray(vector) || vector.length !== 6) {
      return NextResponse.json(
        { error: 'Invalid vector. Must be a 6D array of numbers.' },
        { status: 400 }
      )
    }

    // Validate each value is between 0 and 1
    for (const v of vector) {
      if (typeof v !== 'number' || v < 0 || v > 1) {
        return NextResponse.json(
          { error: 'Each vector value must be a number between 0 and 1.' },
          { status: 400 }
        )
      }
    }

    let matches: FragranceMatch[] = []

    try {
      // Try Pinecone first
      const index = getPineconeIndex()
      const queryResult = await index.query({
        vector: vector,
        topK,
        includeMetadata: true,
      })

      // Map Pinecone results to our Fragrance type
      matches = (queryResult.matches || [])
        .map((match) => {
          // Find the full fragrance data from our local database
          const fragrance = fragrances.find((f) => f.id === match.id)
          if (!fragrance) return null
          return {
            fragrance,
            score: match.score || 0,
          }
        })
        .filter((m): m is FragranceMatch => m !== null)
    } catch (pineconeError) {
      console.warn('Pinecone unavailable, falling back to local similarity:', pineconeError)
      
      // Fallback: compute cosine similarity locally
      const { cosineSimilarity } = await import('@/lib/vectorEngine')
      
      matches = fragrances
        .map((f) => ({
          fragrance: f,
          score: cosineSimilarity(vector, f.vector),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
    }

    // Determine archetype
    const archetype = determineArchetype(vector)

    return NextResponse.json({
      matches,
      userVector: vector,
      archetype,
    })
  } catch (error) {
    console.error('Match error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
