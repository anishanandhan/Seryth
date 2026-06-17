import { Pinecone } from '@pinecone-database/pinecone'

let pineconeClient: Pinecone | null = null

export function getPineconeClient(): Pinecone {
  if (!pineconeClient) {
    if (!process.env.PINECONE_API_KEY) {
      throw new Error('PINECONE_API_KEY is not set in environment variables')
    }
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    })
  }
  return pineconeClient
}

export function getPineconeIndex() {
  const client = getPineconeClient()
  const indexName = process.env.PINECONE_INDEX || 'seryth-aura'
  return client.index(indexName)
}
