'use client'

import { useState, useMemo } from 'react'
import ProductCard from './ProductCard'
import ProductFilter from './ProductFilter'
import type { Product, Category, Tag } from '@/types'

interface ProductsClientProps {
  initialProducts: Product[]
  categories: Category[]
}

// Define FilterOptions to match what ProductFilter expects
interface FilterOptions {
  categories: Category[]
  tags: Tag[]
  priceRange: [number, number]
  availability: 'all' | 'in_stock' | 'out_of_stock'
  sortBy: 'newest' | 'oldest' | 'price_low' | 'price_high' | 'name_asc' | 'name_desc'
}

export default function ProductsClient({ initialProducts, categories }: ProductsClientProps) {
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({
    categories: [],
    tags: [],
    priceRange: [0, 100],
    availability: 'all',
    sortBy: 'newest'
  })

  // Filter and sort products based on current filters
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...initialProducts]

    // Filter by categories
    if (currentFilters.categories.length > 0) {
      const categoryIds = currentFilters.categories.map(cat => cat.id)
      filtered = filtered.filter(product => 
        product.metadata?.category && categoryIds.includes(product.metadata.category.id)
      )
    }

    // Filter by tags
    if (currentFilters.tags.length > 0) {
      const tagIds = currentFilters.tags.map(tag => tag.id)
      filtered = filtered.filter(product =>
        product.metadata?.tags?.some(tag => tagIds.includes(tag.id))
      )
    }

    // Filter by price range
    filtered = filtered.filter(product => {
      const price = product.metadata?.price
      if (!price) return false
      return price >= currentFilters.priceRange[0] && price <= currentFilters.priceRange[1]
    })

    // Filter by availability
    if (currentFilters.availability === 'in_stock') {
      filtered = filtered.filter(product => product.metadata?.in_stock === true)
    } else if (currentFilters.availability === 'out_of_stock') {
      filtered = filtered.filter(product => product.metadata?.in_stock === false)
    }

    // Sort products
    switch (currentFilters.sortBy) {
      case 'price_low':
        return filtered.sort((a, b) => (a.metadata?.price || 0) - (b.metadata?.price || 0))
      case 'price_high':
        return filtered.sort((a, b) => (b.metadata?.price || 0) - (a.metadata?.price || 0))
      case 'name_asc':
        return filtered.sort((a, b) => (a.metadata?.name || a.title).localeCompare(b.metadata?.name || b.title))
      case 'name_desc':
        return filtered.sort((a, b) => (b.metadata?.name || b.title).localeCompare(a.metadata?.name || a.title))
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      case 'newest':
      default:
        return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
  }, [initialProducts, currentFilters])

  // Handle filter changes from ProductFilter component
  const handleFilterChange = (filters: FilterOptions) => {
    setCurrentFilters(filters)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-1/4">
          // <ProductFilter
          //   categories={categories}
          //   tags={[]} // Empty array for now since we don't have tags properly set up
          //   onFilterChange={handleFilterChange}
          //   className="sticky top-4"
          // />
        </aside>

        {/* Products Grid */}
        <main className="lg:w-3/4">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <p className="text-gray-600 mb-4 sm:mb-0">
              Showing {filteredAndSortedProducts.length} of {initialProducts.length} products
            </p>
          </div>

          {/* Products Grid */}
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V9a2 2 0 01-2 2H9a2 2 0 01-2-2V5a2 2 0 012-2h2a2 2 0 012 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters to see more results.</p>
              <button
                onClick={() => handleFilterChange({
                  categories: [],
                  tags: [],
                  priceRange: [0, 100],
                  availability: 'all',
                  sortBy: 'newest'
                })}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Clear Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}