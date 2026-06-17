import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AURA by SERYTH — AI Fragrance Identity Engine',
  description:
    'AURA encodes your personality into a 6-dimensional olfactory vector and matches you to fragrances using AI-powered vector similarity search. Your scent has a fingerprint. AURA finds it.',
  keywords: [
    'fragrance',
    'AI',
    'personalization',
    'scent',
    'olfactory',
    'SERYTH',
    'AURA',
    'vector search',
  ],
  openGraph: {
    title: 'AURA by SERYTH',
    description: 'Your scent has a fingerprint. AURA finds it.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/logo.png?v=2" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
