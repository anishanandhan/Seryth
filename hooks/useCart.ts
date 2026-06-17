import { useState, useEffect } from 'react'
import { CartItem } from '@/components/nexus/CartSidebar'
import { Product } from '@/components/nexus/ProductCard'

const CART_STORAGE_KEY = 'nexus-cart'

/**
 * Custom hook for managing shopping cart state with localStorage persistence
 */
export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY)
    if (saved) {
      try {
        setCart(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse cart:', e)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart)
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart))
  }

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.id === product.id)
    let newCart: CartItem[] = []

    if (existing) {
      newCart = cart.map((item) =>
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      )
    } else {
      newCart = [
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
          img: product.img,
        },
      ]
    }
    saveCart(newCart)
  }

  const updateQty = (id: number, delta: number) => {
    const item = cart.find((i) => i.id === id)
    if (!item) return

    const newQty = item.qty + delta

    if (newQty <= 0) {
      saveCart(cart.filter((i) => i.id !== id))
    } else {
      saveCart(cart.map((i) => (i.id === id ? { ...i, qty: newQty } : i)))
    }
  }

  const removeItem = (id: number) => {
    saveCart(cart.filter((i) => i.id !== id))
  }

  const clearCart = () => {
    saveCart([])
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)

  return {
    cart,
    addToCart,
    updateQty,
    removeItem,
    clearCart,
    cartTotal,
    cartCount,
  }
}
