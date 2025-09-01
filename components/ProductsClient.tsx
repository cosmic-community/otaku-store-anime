'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Product, Category } from '@/types'
import ProductCard from '@/components/ProductCard'
import ProductFilter from '@/components/ProductFilter'

export interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductsClient({ initialProducts, categories }: ProductsClientProps) {
  const searchParams = useSearchParams()
  const [products] = useState<Product[]>(initialProducts)
  
  // Get filter parameters from URL
  const categoryFilter = searchParams.get('category')
  const tagFilter = searchParams.get('tag')
  const sortBy = searchParams.get('sort') || 'newest'
  const searchQuery = searchParams.get('search') || ''

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product => 
        product.metadata.name.toLowerCase().includes(query) ||
        product.metadata.description.toLowerCase().includes(query) ||
        product.metadata.category?.metadata?.name.toLowerCase().includes(query) ||
        product.metadata.tags?.some(tag => 
          tag.metadata?.name.toLowerCase().includes(query)
        )
      )
    }

    // Filter by category
    if (categoryFilter) {
      filtered = filtered.filter(product => 
        product.metadata.category?.slug === categoryFilter
      )
    }

    // Filter by tag
    if (tagFilter) {
      filtered = filtered.filter(product =>
        product.metadata.tags?.some(tag => tag.slug === tagFilter)
      )
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.metadata.price - b.metadata.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.metadata.price - a.metadata.price)
        break
      case 'name':
        filtered.sort((a, b) => a.metadata.name.localeCompare(b.metadata.name))
        break
      case 'newest':
      default:
        filtered.sort((a, b) => {
          const dateA = new Date(a.created_at).getTime()
          const dateB = new Date(b.created_at).getTime()
          return dateB - dateA
        })
        break
    }

    return filtered
  }, [products, categoryFilter, tagFilter, sortBy, searchQuery])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          All Products
        </h1>
        <p className="text-secondary-600">
          Discover our complete collection of premium anime merchandise
        </p>
      </div>

      {/* Filters */}
      <ProductFilter categories={categories} />

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-secondary-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 bg-secondary-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              No products found
            </h3>
            <p className="text-secondary-600 mb-4">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}