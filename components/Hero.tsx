'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/types'

interface HeroProps {
  featuredProducts?: Product[]
}

export default function Hero({ featuredProducts = [] }: HeroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  // Get background images from featured products
  const backgroundImages = featuredProducts
    .filter(product => product.metadata?.featured_image?.imgix_url)
    .map(product => ({
      url: `${product.metadata.featured_image.imgix_url}?w=1920&h=1080&fit=crop&auto=format,compress&blur=20&brightness=-30`,
      product: product
    }))
    .slice(0, 3) // Limit to 3 images for rotation

  // Default fallback if no products available
  const defaultImages = [
    {
      url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop&auto=format,compress&blur=20&brightness=-30',
      product: null
    }
  ]

  const images = backgroundImages.length > 0 ? backgroundImages : defaultImages

  useEffect(() => {
    setMounted(true)
    
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
      }, 5000) // Change image every 5 seconds

      return () => clearInterval(interval)
    }
  }, [images.length])

  if (!mounted) {
    return (
      <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Premium Anime
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Merchandise
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-primary-100 mb-8 leading-relaxed max-w-2xl mx-auto">
              Discover exclusive collection of high-quality anime-themed products crafted for true otaku enthusiasts.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-secondary-900 text-white overflow-hidden min-h-[600px] lg:min-h-[700px]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.url}
              alt="Hero background"
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/70" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Premium Anime
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-lg">
              Merchandise
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto font-medium drop-shadow-md">
            Discover our exclusive collection of high-quality anime-themed products crafted for true otaku enthusiasts.
          </p>

          {/* Features List */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10 text-sm md:text-base">
            {[
              '🎌 Authentic Designs',
              '⚡ Premium Quality',
              '🚚 Fast Shipping',
              '💝 Limited Edition'
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 font-medium border border-white/20 shadow-lg"
              >
                {feature}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/products"
              className="group bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg min-w-[200px] backdrop-blur-sm"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>Shop Collection</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            
            <Link
              href="/categories"
              className="group bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 border border-white/30 hover:border-white/50 min-w-[200px]"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>Browse Categories</span>
                <svg className="w-5 h-5 group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Image Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? 'bg-white shadow-lg scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Featured Product Preview (if available) */}
      {featuredProducts.length > 0 && (
        <div className="absolute bottom-6 right-6 z-20 hidden lg:block">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 shadow-lg max-w-xs">
            <p className="text-xs text-white/70 mb-2">Featured Product</p>
            <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">
              {featuredProducts[currentImageIndex]?.metadata?.name || 'Premium Collection'}
            </h3>
            <p className="text-lg font-bold text-yellow-400">
              ${featuredProducts[currentImageIndex]?.metadata?.price?.toFixed(2) || '24.99'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}