'use client'

import React, { useState, useEffect } from 'react'
import { NexusNavigation } from '@/components/nexus/NexusNavigation'
import { CartSidebar } from '@/components/nexus/CartSidebar'
import { ProductCard, Product } from '@/components/nexus/ProductCard'
import { HeroSection } from '@/components/nexus/HeroSection'
import { CategoryFilter } from '@/components/nexus/CategoryFilter'
import { FeaturesSection } from '@/components/nexus/FeaturesSection'
import { TestimonialsSection } from '@/components/nexus/TestimonialsSection'
import { NewsletterSection } from '@/components/nexus/NewsletterSection'
import { Footer } from '@/components/nexus/Footer'
import { QuickViewModal } from '@/components/nexus/QuickViewModal'
import { products } from '@/data/nexus-products'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/hooks/useToast'
import './nexus.scss'

export default function NexusPage() {
  const { cart, addToCart, updateQty, removeItem, clearCart, cartCount } = useCart()
  const { toastMessage, showToast } = useToast()

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [emailInput, setEmailInput] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [buttonAddedId, setButtonAddedId] = useState<number | null>(null)

  // Scroll and keyboard listeners
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setQuickViewProduct(null)
        setIsCartOpen(false)
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Handle add to cart with visual feedback
  const handleAddToCart = (product: Product) => {
    addToCart(product)
    showToast(`✓ ${product.name} added to cart!`)
    setButtonAddedId(product.id)
    setTimeout(() => setButtonAddedId(null), 2000)
  }

  // Handle cart item quantity update
  const handleUpdateQty = (id: number, delta: number) => {
    const item = cart.find((i) => i.id === id)
    updateQty(id, delta)
    if (item && item.qty + delta <= 0) {
      showToast('Item removed from cart')
    }
  }

  // Handle cart item removal
  const handleRemoveItem = (id: number) => {
    const item = cart.find((i) => i.id === id)
    removeItem(id)
    if (item) {
      showToast(`${item.name} removed from cart`)
    }
  }

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length === 0) return
    showToast('🚀 Redirecting to secure checkout...')
    setTimeout(() => {
      clearCart()
      setIsCartOpen(false)
      showToast('✓ Order placed successfully! Thank you!')
    }, 1800)
  }

  // Handle newsletter subscription
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailInput || !emailRegex.test(emailInput.trim())) {
      showToast('⚠️ Please enter a valid email address')
      return
    }
    setIsSubscribed(true)
    setEmailInput('')
    showToast('🎉 Welcome to NEXUS! Check your inbox.')
    setTimeout(() => setIsSubscribed(false), 4000)
  }

  const filteredProducts =
    categoryFilter === 'all'
      ? products
      : products.filter((p) => p.category === categoryFilter)

  return (
    <div className="nexus-theme">
      {/* Animated background particles */}
      <div className="bg-particles" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* Navigation */}
      <NexusNavigation
        isScrolled={isScrolled}
        isMobileMenuOpen={isMobileMenuOpen}
        cartCount={cartCount}
        onSearchClick={() => showToast('🔍 Search coming soon!')}
        onCartClick={() => setIsCartOpen(!isCartOpen)}
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Cart Sidebar */}
      <CartSidebar
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Category Filter */}
      <CategoryFilter activeCategory={categoryFilter} onCategoryChange={setCategoryFilter} />

      {/* Products Section */}
      <section className="products" id="products" aria-labelledby="products-heading">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Featured Products</div>
            <h2 className="section-title" id="products-heading">
              Our <span className="gradient-text">Bestsellers</span>
            </h2>
            <p className="section-subtitle">Curated tech that redefines the premium experience</p>
          </div>
          <div className="products-grid" role="list">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
                onAddToCart={handleAddToCart}
                isAdded={buttonAddedId === product.id}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Marquee Banner */}
      <div className="marquee-section" aria-hidden="true">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <span>✦ FREE SHIPPING ON ORDERS OVER $99</span>
              <span>✦ 2-YEAR WARRANTY ON ALL PRODUCTS</span>
              <span>✦ 30-DAY HASSLE-FREE RETURNS</span>
              <span>✦ SAME-DAY DELIVERY AVAILABLE</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Newsletter */}
      <NewsletterSection
        emailInput={emailInput}
        isSubscribed={isSubscribed}
        onEmailChange={setEmailInput}
        onSubmit={handleSubscribe}
      />

      {/* Footer */}
      <Footer />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Toast notification */}
      <div className={`toast ${toastMessage ? 'show' : ''}`} role="status" aria-live="polite">
        {toastMessage}
      </div>
    </div>
  )
}
