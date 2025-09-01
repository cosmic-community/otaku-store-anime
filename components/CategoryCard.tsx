import Link from 'next/link'
import type { Category } from '@/types'

interface CategoryCardProps {
  category: Category
  className?: string
}

export default function CategoryCard({ category, className = '' }: CategoryCardProps) {
  const categoryImage = category.metadata.category_image

  return (
    <Link 
      href={`/categories/${category.slug}`} 
      className={`card hover:shadow-lg transition-all duration-200 group ${className}`}
    >
      {/* Category Image */}
      {categoryImage && (
        <div className="relative overflow-hidden h-48">
          <img
            src={`${categoryImage.imgix_url}?w=600&h=400&fit=crop&auto=format,compress`}
            alt={category.metadata.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            width={300}
            height={192}
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
          
          {/* Category Info Overlay */}
          <div className="absolute inset-0 flex items-center justify-center text-center p-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {category.metadata.name}
              </h3>
              {category.metadata.description && (
                <p className="text-white/90 text-sm">
                  {category.metadata.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Fallback without image */}
      {!categoryImage && (
        <div className="p-6 text-center bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <h3 className="text-2xl font-bold mb-2">
            {category.metadata.name}
          </h3>
          {category.metadata.description && (
            <p className="text-primary-100 text-sm">
              {category.metadata.description}
            </p>
          )}
        </div>
      )}
    </Link>
  )
}