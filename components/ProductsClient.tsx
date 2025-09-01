'use client'

import { useState, useMemo } from 'react'
import ProductCard from '@/components/ProductCard'
import ProductFilter from '@/components/ProductFilter'
import type { Product, Category } from '@/types'

interface ProductsClientProps {
  products: Product[]
  categories: Category[]
}

interface FilterState {
  category: string | null
  tags: string[]
  priceRange: [number, number]
  inStock: boolean | null
}

export default function ProductsClient({ products, categories }: ProductsClientProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    tags: [],
    priceRange: [0, 100],
    inStock: null,
  })

  const [sortBy, setSortBy] = useState<string>('newest')

  // Calculate price range from products
  const priceRange = useMemo(() => {
    if (!products || products.length === 0) {
      return [0, 100] as [number, number]
    }

    const prices = products
      .filter(product => product?.metadata?.price != null)
      .map(product => product.metadata.price)
    
    if (prices.length === 0) {
      return [0, 100] as [number, number]
    }

    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return [Math.floor(min), Math.ceil(max)] as [number, number]
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
        const productTagSlugs = productTags.map(tag => tag?.slug).filter(Boolean)
        const hasMatchingTag = filters.tags.some(filterTag => 
          productTagSlugs.includes(filterTag)
        )
        if (!hasMatchingTag) {
          return false
        }
      }

      // Price range filter
      const price = product.metadata.price
      if (price != null && (price < filters.priceRange[0] || price > filters.priceRange[1])) {
        return false
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

  // Sort filtered products
  const sortedProducts = useMemo(() => {
    if (!filteredProducts || filteredProducts.length === 0) {
      return []
    }

    const sorted = [...filteredProducts]
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => (a.metadata?.price || 0) - (b.metadata?.price || 0))
      case 'price-high':
        return sorted.sort((a, b) => (b.metadata?.price || 0) - (a.metadata?.price || 0))
      case 'name':
        return sorted.sort((a, b) => (a.metadata?.name || '').localeCompare(b.metadata?.name || ''))
      case 'newest':
      default:
        return sorted.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    }
  }, [filteredProducts, sortBy])

  // Handle filter updates - fixed parameter type
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  // Get unique tags from all products
  const availableTags = useMemo(() => {
    if (!products || products.length === 0) {
      return []
    }

    const tagMap = new Map()
    products.forEach(product => {
      if (product?.metadata?.tags) {
        product.metadata.tags.forEach(tag => {
          if (tag && tag.slug && tag.metadata?.name) {
            tagMap.set(tag.slug, {
              slug: tag.slug,
              name: tag.metadata.name,
              color: tag.metadata.color || '#6b7280'
            })
          }
        })
      }
    })
    return Array.from(tagMap.values())
  }, [products])

  // Handle price range update - ensure it's always a tuple
  const handlePriceRangeChange = (range: number[]) => {
    // Ensure we have exactly 2 elements for the tuple
    const priceRange: [number, number] = [
      range[0] ?? 0,
      range[1] ?? 100
    ]
    setFilters(prev => ({ ...prev, priceRange }))
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-secondary-600">No products available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Filters Sidebar */}
      <div className="lg:w-80 flex-shrink-0">
        <ProductFilter
          categories={categories}
          tags={availableTags}
          priceRange={priceRange}
          onFiltersChange={handleFiltersChange}
          onPriceRangeChange={handlePriceRangeChange}
        />
      </div>

      {/* Products Grid */}
      <div className="flex-1">
        {/* Sort Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <p className="text-secondary-600">
            Showing {sortedProducts.length} of {products.length} products
          </p>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-secondary-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="newest">Newest First</option>
            <option value="name">Name A-Z</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-secondary-600">
              No products match your current filters.
            </p>
            <button
              onClick={() => setFilters({
                category: null,
                tags: [],
                priceRange: [0, 100],
                inStock: null,
              })}
              className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Clear Filters
            </summary>
          </div>
        )}
      </div>
    </div>
  )
}