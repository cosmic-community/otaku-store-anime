'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { Product } from '@/types'

// Cart item interface
export interface CartItem {
  id: string
  product: Product
  quantity: number
}

// Cart state interface
interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

// Cart actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }

// Cart context interface
interface CartContextType {
  state: CartState
  addItem: (product: Product, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (productId: string) => number
  isInCart: (productId: string) => boolean
}

// Calculate totals helper
function calculateTotals(items: CartItem[]): { total: number; itemCount: number } {
  return items.reduce(
    (acc, item) => ({
      total: acc.total + (item.product.metadata.price * item.quantity),
      itemCount: acc.itemCount + item.quantity,
    }),
    { total: 0, itemCount: 0 }
  )
}

// Cart reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  let newItems: CartItem[]
  
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(
        item => item.product.id === action.payload.product.id
      )
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        )
      } else {
        // Add new item
        newItems = [
          ...state.items,
          {
            id: action.payload.product.id,
            product: action.payload.product,
            quantity: action.payload.quantity || 1,
          },
        ]
      }
      
      const totalsAfterAdd = calculateTotals(newItems)
      return {
        items: newItems,
        total: totalsAfterAdd.total,
        itemCount: totalsAfterAdd.itemCount,
      }

    case 'REMOVE_ITEM':
      newItems = state.items.filter(item => item.id !== action.payload)
      const totalsAfterRemove = calculateTotals(newItems)
      return {
        items: newItems,
        total: totalsAfterRemove.total,
        itemCount: totalsAfterRemove.itemCount,
      }

    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        // Remove item if quantity is 0 or less
        newItems = state.items.filter(item => item.id !== action.payload.id)
      } else {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      }
      
      const totalsAfterUpdate = calculateTotals(newItems)
      return {
        items: newItems,
        total: totalsAfterUpdate.total,
        itemCount: totalsAfterUpdate.itemCount,
      }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0,
      }

    case 'LOAD_CART':
      const totalsAfterLoad = calculateTotals(action.payload)
      return {
        items: action.payload,
        total: totalsAfterLoad.total,
        itemCount: totalsAfterLoad.itemCount,
      }

    default:
      return state
  }
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Initial state
const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
}

// Cart provider component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('otaku-store-cart')
    if (savedCart) {
      try {
        const cartItems: CartItem[] = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: cartItems })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
        // Clear corrupted cart data
        localStorage.removeItem('otaku-store-cart')
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('otaku-store-cart', JSON.stringify(state.items))
  }, [state.items])

  // Action functions
  const addItem = (product: Product, quantity: number = 1) => {
    if (!product.metadata.in_stock) {
      console.warn('Cannot add out of stock item to cart')
      return
    }
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getItemQuantity = (productId: string): number => {
    const item = state.items.find(item => item.product.id === productId)
    return item ? item.quantity : 0
  }

  const isInCart = (productId: string): boolean => {
    return state.items.some(item => item.product.id === productId)
  }

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}