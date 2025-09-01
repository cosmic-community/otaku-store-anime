'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import type { Product } from '@/types'

interface ProductInfoProps {
  product: Product
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { addItem, getItemQuantity, isInCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const category = product.metadata.category
  const tags = product.metadata.tags || []
  const currentQuantityInCart = mounted ? getItemQuantity(product.id) : 0
  const productIsInCart = mounted ? isInCart(product.id) : false

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddToCart = async () => {
    if (!product.metadata.in_stock || isAdding) return

    setIsAdding(true)
    
    try {
      addItem(product, quantity)
      setShowSuccess(true)
      
      // Reset success message after 2 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 2000)
    } catch (error) {
      console.error('Error adding item to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1)
  }

  const decrementQuantity = () => {
    setQuantity(prev => prev > 1 ? prev - 1 : 1)
  }

  return (
    <div className="space-y-6">
      {/* Category */}
      {category && (
        <div>
          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
            {category.metadata.name}
          </span>
        </div>
      )}

      {/* Product Name */}
      <h1 className="text-3xl md:text-4xl font-bold text-secondary-900">
        {product.metadata.name}
      </h1>

      {/* Price */}
      <div className="text-3xl font-bold text-primary-600">
        ${product.metadata.price.toFixed(2)}
      </div>

      {/* Stock Status */}
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${product.metadata.in_stock ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className={`font-medium ${product.metadata.in_stock ? 'text-green-700' : 'text-red-700'}`}>
          {product.metadata.in_stock ? 'In Stock' : 'Out of Stock'}
        </span>
        {mounted && productIsInCart && (
          <span className="text-sm text-secondary-600 ml-2">
            ({currentQuantityInCart} in cart)
          </span>
        )}
      </div>

      {/* SKU */}
      {product.metadata.sku && (
        <p className="text-secondary-600">
          SKU: {product.metadata.sku}
        </p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="tag text-sm font-medium text-white px-3 py-1 rounded-full"
                style={{ backgroundColor: tag.metadata.color || '#6b7280' }}
              >
                {tag.metadata.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="prose prose-secondary max-w-none">
        <h3 className="text-lg font-semibold mb-3">Description</h3>
        <div 
          dangerouslySetInnerHTML={{ __html: product.metadata.description }}
          className="text-secondary-700"
        />
      </div>

      {/* Add to Cart Section */}
      <div className="pt-6 space-y-4">
        {/* Quantity Selector */}
        {product.metadata.in_stock && (
          <div className="flex items-center space-x-4">
            <span className="font-medium text-secondary-900">Quantity:</span>
            <div className="flex items-center border border-secondary-300 rounded-lg">
              <button
                onClick={decrementQuantity}
                className="p-3 hover:bg-secondary-100 transition-colors"
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="px-6 py-3 font-medium text-lg">{quantity}</span>
              <button
                onClick={incrementQuantity}
                className="p-3 hover:bg-secondary-100 transition-colors"
                aria-label="Increase quantity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.metadata.in_stock || isAdding}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
            product.metadata.in_stock
              ? showSuccess
                ? 'bg-green-600 text-white'
                : 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-4 focus:ring-primary-300'
              : 'bg-secondary-300 text-secondary-500 cursor-not-allowed'
          } ${isAdding ? 'opacity-75' : ''}`}
        >
          {isAdding ? (
            <div className="flex items-center justify-center space-x-2">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Adding...</span>
            </div>
          ) : showSuccess ? (
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Added to Cart!</span>
            </div>
          ) : product.metadata.in_stock ? (
            `Add ${quantity > 1 ? `${quantity} ` : ''}to Cart`
          ) : (
            'Out of Stock'
          )}
        </button>

        {/* Total Price Display */}
        {product.metadata.in_stock && quantity > 1 && (
          <div className="text-center">
            <p className="text-lg font-semibold text-secondary-900">
              Total: <span className="text-primary-600">${(product.metadata.price * quantity).toFixed(2)}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}