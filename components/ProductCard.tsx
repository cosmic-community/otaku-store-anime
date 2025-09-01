import Link from 'next/link'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const featuredImage = product.metadata.featured_image
  const category = product.metadata.category
  const tags = product.metadata.tags || []

  return (
    <Link href={`/products/${product.slug}`} className={`card hover:shadow-lg transition-all duration-200 group ${className}`}>
      {/* Product Image */}
      <div className="relative overflow-hidden">
        {featuredImage && (
          <img
            src={`${featuredImage.imgix_url}?w=600&h=400&fit=crop&auto=format,compress`}
            alt={product.metadata.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            width={300}
            height={256}
          />
        )}
        
        {/* Stock status */}
        {!product.metadata.in_stock && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
            Out of Stock
          </div>
        )}
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="absolute top-2 right-2">
            {tags.slice(0, 1).map((tag) => (
              <span 
                key={tag.id}
                className="tag text-xs font-medium text-white px-2 py-1 rounded"
                style={{ backgroundColor: tag.metadata.color || '#6b7280' }}
              >
                {tag.metadata.name}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        {category && (
          <p className="text-sm text-primary-600 font-medium mb-2">
            {category.metadata.name}
          </p>
        )}
        
        {/* Product Name */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.metadata.name}
        </h3>
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-secondary-900">
            ${product.metadata.price.toFixed(2)}
          </span>
          
          {product.metadata.sku && (
            <span className="text-xs text-secondary-500">
              SKU: {product.metadata.sku}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}