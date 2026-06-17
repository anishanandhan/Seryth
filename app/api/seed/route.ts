import { NextResponse } from 'next/server'
import { getPineconeClient } from '@/lib/pinecone'
import { fragrances } from '@/data/fragrances'

export async function POST() {
  try {
    const client = getPineconeClient()
    const indexName = process.env.PINECONE_INDEX || 'seryth-aura'

    // Check if index exists
    const existingIndexes = await client.listIndexes()
    const indexExists = existingIndexes.indexes?.some(
      (idx) => idx.name === indexName
    )

    // Create index if it doesn't exist
    if (!indexExists) {
      await client.createIndex({
        name: indexName,
        dimension: 6,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1',
          },
        },
      })

      // Wait for index to be ready
      await new Promise((resolve) => setTimeout(resolve, 10000))
    }

    const index = client.index(indexName)

    // Upsert all fragrances in batches of 10
    const batchSize = 10
    for (let i = 0; i < fragrances.length; i += batchSize) {
      const batch = fragrances.slice(i, i + batchSize)
      const vectors = batch.map((f) => ({
        id: f.id,
        values: f.vector,
        metadata: {
          name: f.name,
          archetype: f.archetype,
          description: f.description,
          mood: f.mood,
          season: f.season,
          intensity: f.intensity,
          gender: f.gender,
          topNotes: f.notes.top.join(', '),
          heartNotes: f.notes.heart.join(', '),
          baseNotes: f.notes.base.join(', '),
        },
      }))

      await index.upsert(vectors)
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${fragrances.length} fragrances into Pinecone index "${indexName}"`,
      count: fragrances.length,
    })
  } catch (error) {
    console.error('Seed error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
