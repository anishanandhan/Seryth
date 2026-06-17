'use client'

import React, { useState, useEffect, useRef } from 'react'
import type { OlfactoryVector, FragranceMatch } from '@/types'

interface StreamingNarrativeProps {
  userVector: OlfactoryVector
  archetype: string
  matches: FragranceMatch[]
}

const StreamingNarrative: React.FC<StreamingNarrativeProps> = ({
  userVector,
  archetype,
  matches,
}) => {
  const [narrative, setNarrative] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (hasStarted || matches.length === 0) return
    setHasStarted(true)

    const fetchNarrative = async () => {
      setIsStreaming(true)

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              {
                role: 'user',
                content: `I just completed the AURA quiz. My olfactory archetype is "${archetype}". 
My top 3 matches are: ${matches.slice(0, 3).map((m, i) => `${i + 1}. ${m.fragrance.name} (${(m.score * 100).toFixed(1)}% match, ${m.fragrance.archetype})`).join(', ')}.
Give me a personalized narrative about my scent identity — why these fragrances match me, what my vector says about my personality, and what makes my olfactory fingerprint unique. Be poetic but specific. Reference the actual scent notes.`,
              },
            ],
            userVector,
            matchedFragrances: matches.slice(0, 3).map(m => ({
              name: m.fragrance.name,
              score: m.score,
              archetype: m.fragrance.archetype,
            })),
          }),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let fullText = ''

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n')
            for (const line of lines) {
              if (line.startsWith('0:')) {
                try {
                  const text = JSON.parse(line.slice(2))
                  fullText += text
                  setNarrative(fullText)
                } catch {
                  // skip
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Narrative error:', error)
        // Fallback narrative
        setNarrative(
          `Your olfactory profile reveals ${archetype} — a rare combination that bridges ${matches[0]?.fragrance?.archetype || 'multiple worlds'}. ` +
          `Your strongest affinity is toward ${matches[0]?.fragrance?.name || 'complex compositions'}, ` +
          `which mirrors your preference for scents that are both ${matches[0]?.fragrance?.mood || 'layered'} and distinctive. ` +
          `This vector signature is uniquely yours — among the millions of possible combinations in 6-dimensional olfactory space, ` +
          `this exact coordinate has never existed before.\n\n` +
          `*Connect your Gemini API key to unlock personalized AI narratives.*`
        )
      } finally {
        setIsStreaming(false)
      }
    }

    // Delay to let the results UI render first
    const timer = setTimeout(fetchNarrative, 1500)
    return () => clearTimeout(timer)
  }, [hasStarted, matches, archetype, userVector])

  return (
    <div className="narrative-container" ref={containerRef}>
      <div className="narrative-header">
        {isStreaming ? 'AURA IS COMPOSING YOUR NARRATIVE' : 'YOUR SCENT NARRATIVE'}
      </div>
      <div className="narrative-text">
        {narrative || (isStreaming ? '' : 'Preparing your personalized narrative...')}
        {isStreaming && <span className="narrative-cursor" />}
      </div>
    </div>
  )
}

export default StreamingNarrative
