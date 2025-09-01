import Link from 'next/link'
import type { Category } from '@/types'

interface CategoryCardProps {
  category: Category
  className?: string
}

export default function CategoryCard({ category, className = '' }: CategoryCardProps) {
  const { metadata } = category
  
  if (!metadata) return null

  return (
    <Link href={`/categories/${category.slug}`} className={`group block ${className}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Category Image */}
        <div className="aspect-video overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600">
          {metadata.category_image?.imgix_url ? (
            <img
              src={`${metadata.category_image.imgix_url}?w=800&h=450&fit=crop&auto=format,compress`}
              alt={metadata.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              width={400}
              height={225}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Category Info */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                {metadata.name}
              </h3>
              {metadata.description && (
                <p className="text-secondary-600 line-clamp-2">
                  {metadata.description}
                </p>
              )}
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
  )
}