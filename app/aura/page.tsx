import type { Metadata } from 'next'
import AuraExperience from '@/components/aura/AuraExperience'

export const metadata: Metadata = {
  title: 'AURA Experience — Discover Your Scent Identity | SERYTH',
  description:
    'Take the AURA psychographic quiz to discover your 6-dimensional olfactory vector. AI-powered fragrance matching using cosine similarity search in real-time.',
}

export default function AuraPage() {
  return <AuraExperience />
}
