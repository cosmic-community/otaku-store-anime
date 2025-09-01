'use client'

import { useCart } from '@/contexts/CartContext'
import { useState, useEffect } from 'react'

interface CartIconProps {
  onClick: () => void
}

export default function CartIcon({ onClick }: CartIconProps) {
  const { state } = useCart()
  const [mounted, setMounted] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        onClick={onClick}
        className="relative p-2 text-secondary-700 hover:text-primary-600 transition-colors"
        aria-label="Open shopping cart"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-secondary-700 hover:text-primary-600 transition-colors"
      aria-label={`Open shopping cart (${state.itemCount} items)`}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      
      {/* Cart Badge */}
      {state.itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {state.itemCount > 99 ? '99+' : state.itemCount}
        </span>
      )}
    </button>
  )
}