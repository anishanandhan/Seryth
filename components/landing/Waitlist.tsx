'use client'

import React, { useState } from 'react'

const Waitlist: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/mvzwnpda", {
        method: "POST",
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setStatus('success');
        form.reset();
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="waitlist" id="waitlist">
      <div className="section-label reveal" style={{ justifyContent: 'center' }}>
        Early Access
      </div>
      <h2 className="waitlist-title reveal">
        Be the first to<br /><em>find your SERYTH</em>
      </h2>
      <p className="waitlist-sub reveal">
        We&apos;re opening access to a select group of early users.<br />
        Join the waitlist — your scent identity awaits.
      </p>
      
      <form
        className="waitlist-form reveal"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          name="email"
          className="waitlist-input"
          placeholder="your@email.com"
          required
          disabled={status === 'submitting' || status === 'success'}
        />
        <button 
          type="submit" 
          className="waitlist-btn"
          disabled={status === 'submitting' || status === 'success'}
        >
          {status === 'submitting' ? 'Joining...' : 
           status === 'success' ? 'Joined!' : 
           status === 'error' ? 'Try Again' : 'Join Waitlist'}
        </button>
      </form>
      
      {status === 'success' && (
        <p className="waitlist-note reveal" style={{ color: 'var(--gold)' }}>
          Thank you! You&apos;ve been added to the waitlist.
        </p>
      )}
      {status === 'error' && (
        <p className="waitlist-note reveal" style={{ color: '#d4847a' }}>
          Oops! There was a problem submitting your email.
        </p>
      )}
      {status !== 'success' && status !== 'error' && (
        <p className="waitlist-note reveal">
          No spam. Early access only. Unsubscribe anytime.
        </p>
      )}
    </section>
  )
}

export default Waitlist
