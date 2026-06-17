'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { OlfactoryVector, QuizAnswer } from '@/types'
import {
  MBTI_WEIGHTS,
  MBTI_ARCHETYPES,
  mbtiQuestions,
  scentQuestion,
} from '@/data/quiz-data'

interface QuizProps {
  onComplete: (
    answers: QuizAnswer[],
    weights: OlfactoryVector[],
    mbtiType: string,
    archetype: string
  ) => void
}

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [selectedWeights, setSelectedWeights] = useState<OlfactoryVector[]>([])
  const [mbtiLetters, setMbtiLetters] = useState<string[]>([])

  const totalQuestions = mbtiQuestions.length + 1 // 4 MBTI + 1 scent
  const isMBTI = currentQ < mbtiQuestions.length
  const isScent = currentQ === mbtiQuestions.length

  const handleMBTISelect = (letter: string) => {
    const question = mbtiQuestions[currentQ]
    const weights = MBTI_WEIGHTS[letter]

    const newAnswer: QuizAnswer = {
      questionId: question.id,
      selectedOption: letter === question.optionA.letter ? 0 : 1,
      label: letter === question.optionA.letter ? question.optionA.label : question.optionB.label,
    }

    const updatedAnswers = [...answers, newAnswer]
    const updatedWeights = [...selectedWeights, weights]
    const updatedMBTI = [...mbtiLetters, letter]

    setAnswers(updatedAnswers)
    setSelectedWeights(updatedWeights)
    setMbtiLetters(updatedMBTI)

    setTimeout(() => setCurrentQ(currentQ + 1), 400)
  }

  const handleScentSelect = (optionIndex: number) => {
    const option = scentQuestion.options[optionIndex]

    const newAnswer: QuizAnswer = {
      questionId: scentQuestion.id,
      selectedOption: optionIndex,
      label: option.label,
    }

    const updatedAnswers = [...answers, newAnswer]
    const updatedWeights = [...selectedWeights, option.weights]

    // Compute MBTI type
    const mbtiType = mbtiLetters.join('')
    const archetype = MBTI_ARCHETYPES[mbtiType] || 'The Enigma'

    setTimeout(() => onComplete(updatedAnswers, updatedWeights, mbtiType, archetype), 600)
  }

  return (
    <div className="quiz-container">
      {/* Progress dots */}
      <div
        className="quiz-progress"
        role="progressbar"
        aria-valuenow={currentQ + 1}
        aria-valuemin={1}
        aria-valuemax={totalQuestions}
        aria-label={`Question ${currentQ + 1} of ${totalQuestions}`}
      >
        {Array.from({ length: totalQuestions }).map((_, i) => (
          <div
            key={i}
            className={`quiz-progress-dot ${
              i === currentQ ? 'active' : i < currentQ ? 'done' : ''
            }`}
            aria-hidden="true"
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ─── MBTI Questions (binary choice) ─── */}
        {isMBTI && (
          <motion.div
            key={`mbti-${currentQ}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <div className="quiz-category">
              {mbtiQuestions[currentQ].category}
              <span
                style={{
                  marginLeft: 12,
                  fontSize: 9,
                  letterSpacing: 2,
                  opacity: 0.5,
                  textTransform: 'uppercase',
                }}
                aria-hidden="true"
              >
                {mbtiQuestions[currentQ].dimension[0]} / {mbtiQuestions[currentQ].dimension[1]}
              </span>
            </div>
            <h2 className="quiz-question">{mbtiQuestions[currentQ].question}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Option A */}
              <motion.button
                className="quiz-option"
                onClick={() => handleMBTISelect(mbtiQuestions[currentQ].optionA.letter)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                style={{ position: 'relative' }}
                aria-label={`Option A: ${mbtiQuestions[currentQ].optionA.label}`}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 16,
                    fontSize: 10,
                    letterSpacing: 3,
                    color: 'var(--gold)',
                    opacity: 0.4,
                  }}
                  aria-hidden="true"
                >
                  {mbtiQuestions[currentQ].optionA.letter}
                </span>
                {mbtiQuestions[currentQ].optionA.label}
              </motion.button>

              {/* Divider */}
              <div
                style={{
                  textAlign: 'center',
                  fontSize: 10,
                  letterSpacing: 4,
                  color: 'rgba(201, 169, 110, 0.3)',
                  textTransform: 'uppercase',
                }}
                aria-hidden="true"
              >
                or
              </div>

              {/* Option B */}
              <motion.button
                className="quiz-option"
                onClick={() => handleMBTISelect(mbtiQuestions[currentQ].optionB.letter)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                style={{ position: 'relative' }}
                aria-label={`Option B: ${mbtiQuestions[currentQ].optionB.label}`}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 16,
                    fontSize: 10,
                    letterSpacing: 3,
                    color: 'var(--gold)',
                    opacity: 0.4,
                  }}
                  aria-hidden="true"
                >
                  {mbtiQuestions[currentQ].optionB.letter}
                </span>
                {mbtiQuestions[currentQ].optionB.label}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ─── Scent Instinct Question (4 options) ─── */}
        {isScent && (
          <motion.div
            key="scent"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
          >
            <div className="quiz-category">{scentQuestion.category}</div>
            <h2 className="quiz-question">{scentQuestion.question}</h2>
            <div className="quiz-options">
              {scentQuestion.options.map((option, i) => (
                <motion.button
                  key={i}
                  className="quiz-option"
                  onClick={() => handleScentSelect(i)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label={`Option ${i + 1}: ${option.label}`}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question counter + MBTI letters building */}
      <div
        style={{
          textAlign: 'center',
          marginTop: 32,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <span
          style={{ fontSize: 12, color: 'var(--white-faint)', letterSpacing: 2 }}
          aria-label={`Question ${currentQ + 1} of ${totalQuestions}`}
        >
          {currentQ + 1} / {totalQuestions}
        </span>
        {mbtiLetters.length > 0 && (
          <span
            style={{
              fontSize: 14,
              letterSpacing: 6,
              color: 'var(--gold)',
              fontFamily: 'Jost, sans-serif',
              fontWeight: 400,
            }}
            aria-label={`Your personality type so far: ${mbtiLetters.join('')}`}
          >
            {mbtiLetters.join('')}
            <span style={{ opacity: 0.2 }} aria-hidden="true">
              {'_'.repeat(4 - mbtiLetters.length)}
            </span>
          </span>
        )}
      </div>
    </div>
  )
}

export default Quiz
