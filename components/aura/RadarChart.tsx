'use client'

import React, { useRef, useEffect } from 'react'
import type { OlfactoryVector } from '@/types'

const LABELS = ['Floral', 'Woody', 'Fresh', 'Spicy', 'Musk', 'Citrus']
const COLORS = {
  fill: 'rgba(201, 169, 110, 0.15)',
  stroke: 'rgba(201, 169, 110, 0.8)',
  grid: 'rgba(242, 237, 232, 0.06)',
  gridAccent: 'rgba(201, 169, 110, 0.12)',
  label: 'rgba(201, 169, 110, 0.7)',
  dot: '#c9a96e',
  glow: 'rgba(201, 169, 110, 0.4)',
}

interface RadarChartProps {
  vector: OlfactoryVector
}

const RadarChart: React.FC<RadarChartProps> = ({ vector }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationProgress = useRef(0)
  const animationFrame = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // High DPI support
    const dpr = window.devicePixelRatio || 1
    const size = 320
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const maxR = size / 2 - 50

    const n = 6
    const angleStep = (Math.PI * 2) / n
    const startAngle = -Math.PI / 2 // Start from top

    function getPoint(index: number, radius: number): [number, number] {
      const angle = startAngle + index * angleStep
      return [
        cx + radius * Math.cos(angle),
        cy + radius * Math.sin(angle),
      ]
    }

    function draw(progress: number) {
      if (!ctx) return
      ctx.clearRect(0, 0, size, size)

      // Draw grid rings
      const rings = [0.2, 0.4, 0.6, 0.8, 1.0]
      for (const ring of rings) {
        ctx.beginPath()
        for (let i = 0; i <= n; i++) {
          const [px, py] = getPoint(i % n, maxR * ring)
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.strokeStyle = ring === 1.0 ? COLORS.gridAccent : COLORS.grid
        ctx.lineWidth = ring === 1.0 ? 1.5 : 0.8
        ctx.stroke()
      }

      // Draw grid lines (spokes)
      for (let i = 0; i < n; i++) {
        const [px, py] = getPoint(i, maxR)
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(px, py)
        ctx.strokeStyle = COLORS.grid
        ctx.lineWidth = 0.8
        ctx.stroke()
      }

      // Draw data shape with animation
      const animatedVector = vector.map(v => v * progress)

      // Glow effect
      ctx.shadowColor = COLORS.glow
      ctx.shadowBlur = 12

      // Fill
      ctx.beginPath()
      for (let i = 0; i <= n; i++) {
        const [px, py] = getPoint(i % n, maxR * animatedVector[i % n])
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fillStyle = COLORS.fill
      ctx.fill()

      // Stroke
      ctx.beginPath()
      for (let i = 0; i <= n; i++) {
        const [px, py] = getPoint(i % n, maxR * animatedVector[i % n])
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.strokeStyle = COLORS.stroke
      ctx.lineWidth = 2
      ctx.stroke()

      // Data points
      ctx.shadowBlur = 0
      for (let i = 0; i < n; i++) {
        const [px, py] = getPoint(i, maxR * animatedVector[i])
        ctx.beginPath()
        ctx.arc(px, py, 4, 0, Math.PI * 2)
        ctx.fillStyle = COLORS.dot
        ctx.fill()

        // Point glow
        ctx.beginPath()
        ctx.arc(px, py, 8, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(201, 169, 110, 0.15)'
        ctx.fill()
      }

      // Labels
      ctx.shadowBlur = 0
      ctx.font = '10px Jost, sans-serif'
      ctx.fillStyle = COLORS.label
      ctx.textAlign = 'center'

      for (let i = 0; i < n; i++) {
        const labelR = maxR + 28
        const [lx, ly] = getPoint(i, labelR)

        // Adjust text baseline for top/bottom labels
        const angle = startAngle + i * angleStep
        const yOffset = Math.sin(angle) > 0.3 ? 4 : Math.sin(angle) < -0.3 ? -2 : 1

        ctx.fillText(LABELS[i].toUpperCase(), lx, ly + yOffset)
      }
    }

    // Animate in
    animationProgress.current = 0
    const animate = () => {
      animationProgress.current += 0.025
      if (animationProgress.current > 1) animationProgress.current = 1

      // Ease out cubic
      const eased = 1 - Math.pow(1 - animationProgress.current, 3)
      draw(eased)

      if (animationProgress.current < 1) {
        animationFrame.current = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrame.current)
    }
  }, [vector])

  return (
    <div className="radar-wrapper">
      <div className="radar-title">Scent DNA</div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <canvas
          ref={canvasRef}
          style={{ width: 320, height: 320 }}
        />
      </div>
    </div>
  )
}

export default RadarChart
