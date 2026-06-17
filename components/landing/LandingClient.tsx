'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import Hero from './Hero'
import HowItWorks from './HowItWorks'
import Features from './Features'
import ScentVault from './ScentVault'
import Waitlist from './Waitlist'
import Footer from './Footer'
import ChatWidget from './ChatWidget'

const LandingClient: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // ── Custom Cursor ──
    const cursor = cursorRef.current
    const ring = ringRef.current
    if (!cursor || !ring) return

    let mx = 0, my = 0, rx = 0, ry = 0

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      cursor.style.left = mx + 'px'
      cursor.style.top = my + 'px'
    }

    const animateRing = () => {
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      ring.style.left = rx + 'px'
      ring.style.top = ry + 'px'
      requestAnimationFrame(animateRing)
    }

    document.addEventListener('mousemove', onMouseMove)
    animateRing()

    // Cursor hover effect
    const interactiveElements = document.querySelectorAll('button,a,input')
    const onEnter = () => {
      ring.style.transform = 'translate(-50%,-50%) scale(1.8)'
      ring.style.borderColor = 'rgba(201,169,110,0.8)'
    }
    const onLeave = () => {
      ring.style.transform = 'translate(-50%,-50%) scale(1)'
      ring.style.borderColor = 'rgba(201,169,110,0.5)'
    }
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    // ── Scroll Reveal ──
    const reveals = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.12 }
    )
    reveals.forEach(r => observer.observe(r))

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      observer.disconnect()
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  return (
    <>
      {/* Custom Cursor */}
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

      {/* Navbar */}
      <nav>
        <img src="/logo.png" alt="SERYTH" className="nav-logo-img" />
        <ul className="nav-links">
          <li><a href="#how">How It Works</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#vault">Scent Vault</a></li>
          <li><Link href="/aura">AURA Experience</Link></li>
          <li><Link href="/nexus" style={{ color: 'var(--gold-light)' }}>NEXUS Store</Link></li>
          <li><Link href="/analytics" style={{ fontSize: '13px', opacity: 0.7 }}>Analytics</Link></li>
        </ul>
        <Link href="/aura" className="nav-cta">Discover Your Scent</Link>
      </nav>

      {/* Sections */}
      <Hero />
      <div className="divider-line" />
      <HowItWorks />
      <div className="divider-line" />
      <Features />
      <div className="divider-line" />
      <ScentVault />
      <div className="divider-line" />
      <Waitlist />
      <Footer />
      <ChatWidget />
    </>
  )
}

export default LandingClient
