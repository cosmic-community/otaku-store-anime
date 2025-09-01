import Link from 'next/link'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { metadata } = product
  
  if (!metadata) return null

  return (
    <div className={`group ${className}`}>
      <Link href={`/products/${product.slug}`} className="block">
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden bg-gray-100">
            {metadata.featured_image?.imgix_url ? (
              <img
                src={`${metadata.featured_image.imgix_url}?w=600&h=600&fit=crop&auto=format,compress`}
                alt={metadata.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                width={300}
                height={300}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {metadata.name}
            </h3>
            
            {/* Tags */}
            {metadata.tags && metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {metadata.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-block px-2 py-1 text-xs font-medium rounded-full text-white"
                    style={{ backgroundColor: tag.metadata?.color || '#6B7280' }}
                  >
                    {tag.metadata?.name || tag.title}
                  </span>
                ))}
              </div>
            )}

            {/* Price and Stock */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary-600">
                  ${metadata.price?.toFixed(2) || '0.00'}
                </span>
                <span className={`text-sm ${metadata.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                  {metadata.in_stock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}