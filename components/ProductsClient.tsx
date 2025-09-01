'use client'

import { useState, useMemo } from 'react'
import { Product, Category, Tag } from '@/types'
import ProductCard from './ProductCard'
import ProductFilter from './ProductFilter'

interface ProductsClientProps {
  products: Product[]
  categories: Category[]
  tags: Tag[]
}

export interface ProductFilterProps {
  categories: Category[]
  tags: Tag[]
  products: Product[]
  onFilterChange: (filters: {
    category: string | null
    tags: string[]
    priceRange: [number, number]
    inStock: boolean | null
  }) => void
}

export default function ProductsClient({ products, categories, tags }: ProductsClientProps) {
  const [filters, setFilters] = useState<{
    category: string | null
    tags: string[]
    priceRange: [number, number]
    inStock: boolean | null
  }>({
    category: null,
    tags: [],
    priceRange: [0, 100],
    inStock: null
  })

  // Calculate price range from products
  const priceRange = useMemo(() => {
    if (!products || products.length === 0) {
      return [0, 100]
    }
    
    const prices = products
      .map(product => product.metadata?.price)
      .filter((price): price is number => typeof price === 'number' && !isNaN(price))
    
    if (prices.length === 0) {
      return [0, 100]
    }
    
    const min = Math.floor(Math.min(...prices))
    const max = Math.ceil(Math.max(...prices))
    return [min, max]
  }, [products])

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) {
      return []
    }

    return products.filter(product => {
      if (!product || !product.metadata) {
        return false
      }

      // Category filter
      if (filters.category && product.metadata.category?.slug !== filters.category) {
        return false
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const productTags = product.metadata.tags || []
        const hasMatchingTag = filters.tags.some(filterTag =>
          productTags.some(productTag => productTag?.slug === filterTag)
        )
        if (!hasMatchingTag) {
          return false
        }
      }

      // Price range filter
      const price = product.metadata.price
      if (typeof price === 'number' && !isNaN(price)) {
        if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
          return false
        }
      }

      // Stock filter
      if (filters.inStock !== null) {
        if (filters.inStock && !product.metadata.in_stock) {
          return false
        }
        if (!filters.inStock && product.metadata.in_stock) {
          return false
        }
      }

      return true
    })
  }, [products, filters])

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Filter Sidebar */}
      <div className="lg:w-1/4">
        <ProductFilter
          categories={categories}
          tags={tags}
          products={products}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Products Grid */}
      <div className="lg:w-3/4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary-900">
            Products {filteredProducts.length > 0 && `(${filteredProducts.length})`}
          </h2>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-secondary-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-secondary-700 mb-2">No products found</h3>
            <p className="text-secondary-500 mb-4">
              Try adjusting your filters to see more results.
            </p>
            <button
              onClick={() => setFilters({
                category: null,
                tags: [],
                priceRange,
                inStock: null
              })}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}