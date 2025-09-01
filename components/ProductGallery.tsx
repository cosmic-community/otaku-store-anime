'use client'

import { useState } from 'react'
import type { Product } from '@/types'

interface ProductGalleryProps {
  product: Product
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const featuredImage = product.metadata.featured_image
  const galleryImages = product.metadata.gallery_images || []
  
  // Combine featured image with gallery images
  const allImages = featuredImage ? [featuredImage, ...galleryImages] : galleryImages
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (allImages.length === 0) {
    return (
      <div className="aspect-square bg-secondary-100 rounded-lg flex items-center justify-center">
        <span className="text-secondary-500">No image available</span>
      </div>
    )
  }

  const currentImage = allImages[currentImageIndex]

  // Safety check for currentImage
  if (!currentImage) {
    return (
      <div className="aspect-square bg-secondary-100 rounded-lg flex items-center justify-center">
        <span className="text-secondary-500">Image not found</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square overflow-hidden rounded-lg bg-secondary-100">
        <img
          src={`${currentImage.imgix_url}?w=800&h=800&fit=crop&auto=format,compress`}
          alt={product.metadata.name}
          className="w-full h-full object-cover"
          width={600}
          height={600}
        />
      </div>

      {/* Thumbnail Navigation */}
      {allImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentImageIndex
                  ? 'border-primary-600'
                  : 'border-secondary-200 hover:border-secondary-300'
              }`}
            >
              <img
                src={`${image.imgix_url}?w=160&h=160&fit=crop&auto=format,compress`}
                alt={`${product.metadata.name} view ${index + 1}`}
                className="w-full h-full object-cover"
                width={80}
                height={80}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}