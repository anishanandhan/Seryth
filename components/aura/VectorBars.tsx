'use client'

import React from 'react'
import { motion } from 'framer-motion'
import type { OlfactoryVector } from '@/types'

const LABELS = ['Floral', 'Woody', 'Fresh', 'Spicy', 'Musk', 'Citrus']

interface VectorBarsProps {
  vector: OlfactoryVector
}

const VectorBars: React.FC<VectorBarsProps> = ({ vector }) => {
  return (
    <div className="vector-bars">
      {LABELS.map((label, i) => (
        <motion.div
          key={label}
          className="vector-bar-item"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        >
          <div className="vector-bar-label">{label}</div>
          <div className="vector-bar-track">
            <motion.div
              className="vector-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${vector[i] * 100}%` }}
              transition={{ delay: 0.5 + i * 0.12, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <div className="vector-bar-value">{(vector[i] * 100).toFixed(0)}%</div>
        </motion.div>
      ))}
    </div>
  )
}

export default VectorBars
