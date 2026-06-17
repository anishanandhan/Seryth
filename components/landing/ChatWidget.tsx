'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Sparkles } from 'lucide-react'
import './ChatWidget.css'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const SYSTEM_PROMPT = `You are the AURA Assistant by SERYTH, an AI guide for a luxury AI-powered fragrance personalization engine.
You help users understand how AURA uses AI and psychographic assessments to create personalized, refillable fragrances stored in a digital Scent Vault.
AURA encodes preferences into a 6-dimensional olfactory vector (Floral, Woody, Fresh, Spicy, Musk, Citrus) and uses vector similarity search to match users to fragrances.
Keep your answers concise, elegant, and maintain a premium, advisory brand tone. Avoid overly long responses. Use short paragraphs.
If asked about the technology, mention: Gemini AI, Pinecone vector database, 6D olfactory vectors, cosine similarity search.
If asked about the Scent Vault, explain: permanent formula storage with a unique ID, refillable anywhere, "Create Once, Refill Forever."`

const PRESET_QUESTIONS = [
  "What is AURA?",
  "How does it work?",
  "Find my scent",
  "What's the Scent Vault?"
]

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello. I'm AURA's AI guide — here to help you discover your scent identity. What brings you here today?"
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen, isLoading])

  const fetchAIResponse = async (userText: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userText }
          ]
        })
      })

      if (!response.ok) {
        throw new Error(`API error ${response.status}`)
      }

      // Read streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      if (reader) {
        const assistantMsgId = Date.now().toString()
        setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }])

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          // Parse SSE data lines from Vercel AI SDK
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (line.startsWith('0:')) {
              // Text delta from AI SDK data stream protocol
              try {
                const text = JSON.parse(line.slice(2))
                fullText += text
                setMessages(prev =>
                  prev.map(m => m.id === assistantMsgId ? { ...m, content: fullText } : m)
                )
              } catch {
                // skip non-JSON lines
              }
            }
          }
        }
      }

      if (!fullText) {
        // Fallback if streaming didn't work
        const data = await response.text()
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: data || "I apologize, but I'm unable to respond at this moment."
        }])
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      console.error("Chat error:", error)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: `I'm currently in demo mode. Visit the AURA Experience to discover your scent identity! (${message})`
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = (text: string) => {
    if (!text.trim() || isLoading) return

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim()
    }
    setMessages(prev => [...prev, newUserMsg])
    setInputValue('')
    fetchAIResponse(newUserMsg.content)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(inputValue)
  }

  return (
    <div className="chat-widget-container">
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="chat-bot-avatar">
                <Sparkles size={18} />
              </div>
              <div className="chat-header-info">
                <div className="chat-header-title">AURA Assistant</div>
                <div className="chat-header-status">
                  <span className="status-dot"></span>
                  POWERED BY GEMINI
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button 
                className="chat-close-btn" 
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="chat-body">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`chat-message-row ${msg.role === 'user' ? 'user' : ''}`}
              >
                <div className="chat-message-avatar">
                  {msg.role === 'assistant' ? <Sparkles size={12} /> : 'U'}
                </div>
                <div className="chat-bubble">
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="chat-message-row">
                <div className="chat-message-avatar">
                  <Sparkles size={12} />
                </div>
                <div className="chat-bubble">
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Controls */}
          <div className="chat-controls">
            {messages.length === 1 && (
              <div className="preset-prompts">
                {PRESET_QUESTIONS.map(q => (
                  <button 
                    key={q} 
                    className="preset-btn"
                    onClick={() => handleSendMessage(q)}
                    disabled={isLoading}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <form className="chat-input-area" onSubmit={handleSubmit}>
              <input 
                type="text" 
                className="chat-input" 
                placeholder="Ask anything about AURA..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className="chat-submit-btn"
                disabled={!inputValue.trim() || isLoading}
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

      {!isOpen && (
        <button 
          className="chat-toggle-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  )
}

export default ChatWidget
