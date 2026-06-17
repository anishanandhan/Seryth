import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer-logo">Seryth</div>
      <div className="footer-tagline">Your Scent · Your Signature · Forever</div>
      <div className="footer-copy">© {new Date().getFullYear()} SERYTH. All rights reserved.</div>
    </footer>
  )
}

export default Footer
