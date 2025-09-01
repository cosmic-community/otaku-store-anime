'use client'

import { useState, useMemo } from 'react'
import ProductCard from './ProductCard'
import ProductFilter from './ProductFilter'
import type { Product, Category } from '@/types'

interface ProductsClientProps {
  initialProducts: Product[]
  categories: Category[]
}

interface FilterState {
  category: string | null
  tags: string[]
  priceRange: [number, number]
  inStock: boolean | null
}

// Define FilterOptions to match what ProductFilter expects
interface FilterOptions {
  categories: Category[]
  tags: any[] // Using any[] for tags since we don't have a Tag type defined
  priceRange: [number, number]
  availability: 'all' | 'in_stock' | 'out_of_stock'
  sortBy: 'newest' | 'oldest' | 'price_low' | 'price_high' | 'name_asc' | 'name_desc'
}

export default function ProductsClient({ initialProducts, categories }: ProductsClientProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    tags: [],
    priceRange: [0, 100],
    inStock: null
  })

  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'name'>('newest')

  // Calculate price range from products
  const priceRange: [number, number] = useMemo(() => {
    if (initialProducts.length === 0) return [0, 100]
    
    const prices = initialProducts
      .filter(product => product.metadata?.price)
      .map(product => product.metadata.price)
    
    if (prices.length === 0) return [0, 100]
    
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return [Math.floor(min), Math.ceil(max)]
  }, [initialProducts])

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    let filtered = initialProducts

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(product => 
        product.metadata?.category?.slug === filters.category
      )
    }

    // Filter by tags
    if (filters.tags.length > 0) {
      filtered = filtered.filter(product =>
        product.metadata?.tags?.some(tag => 
          filters.tags.includes(tag.slug)
        )
      )
    }

    // Filter by price range
    filtered = filtered.filter(product => {
      const price = product.metadata?.price
      if (!price) return false
      return price >= filters.priceRange[0] && price <= filters.priceRange[1]
    })

    // Filter by stock status
    if (filters.inStock !== null) {
      filtered = filtered.filter(product => 
        product.metadata?.in_stock === filters.inStock
      )
    }

    return filtered
  }, [initialProducts, filters])

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts]
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => (a.metadata?.price || 0) - (b.metadata?.price || 0))
      case 'price-high':
        return sorted.sort((a, b) => (b.metadata?.price || 0) - (a.metadata?.price || 0))
      case 'name':
        return sorted.sort((a, b) => (a.metadata?.name || a.title).localeCompare(b.metadata?.name || b.title))
      case 'newest':
      default:
        return sorted.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    }
  }, [filteredProducts, sortBy])

  // Handle filter changes - convert FilterOptions to FilterState
  const handleFilterChange = (filterOptions: FilterOptions) => {
    // Convert FilterOptions back to our internal FilterState format
    const newFilters: FilterState = {
      category: filterOptions.categories.length > 0 ? filterOptions.categories[0].slug : null,
      tags: [], // We'll need to handle tags separately if needed
      priceRange: filterOptions.priceRange,
      inStock: filterOptions.availability === 'in_stock' ? true : 
               filterOptions.availability === 'out_of_stock' ? false : null
    }
    setFilters(newFilters)
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: null,
      tags: [],
      priceRange: priceRange,
      inStock: null
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-1/4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              {(filters.category || filters.tags.length > 0 || filters.inStock !== null) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
            
            <ProductFilter
              categories={categories}
              tags={[]} // Empty array for now since we don't have tags properly set up
              onFilterChange={handleFilterChange}
            />
          </div>
        </aside>

        {/* Products Grid */}
        <main className="lg:w-3/4">
          {/* Sort and Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <p className="text-gray-600 mb-4 sm:mb-0">
              Showing {sortedProducts.length} of {initialProducts.length} products
            </p>
            
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
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
                onClick={clearFilters}
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