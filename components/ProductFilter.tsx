'use client'

import { useState, useMemo } from 'react'
import type { Category, Product, Tag } from '@/types'

interface FilterState {
  category: string | null
  tags: string[]
  priceRange: [number, number]
  inStock: boolean | null
}

interface ProductFilterProps {
  categories: Category[]
  products: Product[]
  filters: FilterState
  priceRange: [number, number]
  onFilterChange: (filters: FilterState) => void
}

export default function ProductFilter({
  categories,
  products,
  filters,
  priceRange,
  onFilterChange
}: ProductFilterProps) {
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(filters.priceRange)

  // Extract all unique tags from products
  const availableTags = useMemo(() => {
    const tagSet = new Set<Tag>()
    
    products.forEach(product => {
      if (product.metadata?.tags) {
        product.metadata.tags.forEach(tag => tagSet.add(tag))
      }
    })
    
    return Array.from(tagSet)
  }, [products])

  const handleCategoryChange = (categorySlug: string | null) => {
    onFilterChange({
      ...filters,
      category: categorySlug
    })
  }

  const handleTagToggle = (tagSlug: string) => {
    const newTags = filters.tags.includes(tagSlug)
      ? filters.tags.filter(tag => tag !== tagSlug)
      : [...filters.tags, tagSlug]
    
    onFilterChange({
      ...filters,
      tags: newTags
    })
  }

  const handlePriceRangeChange = (newRange: [number, number]) => {
    setLocalPriceRange(newRange)
    onFilterChange({
      ...filters,
      priceRange: newRange
    })
  }

  const handleStockFilterChange = (inStock: boolean | null) => {
    onFilterChange({
      ...filters,
      inStock
    })
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              checked={filters.category === null}
              onChange={() => handleCategoryChange(null)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">All Categories</span>
          </label>
          
          {categories.map((category) => (
            <label key={category.id} className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={filters.category === category.slug}
                onChange={() => handleCategoryChange(category.slug)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">
                {category.metadata?.name || category.title}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags Filter */}
      {availableTags.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
          <div className="space-y-2">
            {availableTags.map((tag) => (
              <label key={tag.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.tags.includes(tag.slug)}
                  onChange={() => handleTagToggle(tag.slug)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  {tag.metadata?.name || tag.title}
                  {tag.metadata?.color && (
                    <span
                      className="ml-2 w-3 h-3 rounded-full border border-gray-200"
                      style={{ backgroundColor: tag.metadata.color }}
                      aria-label={`Color: ${tag.metadata.color}`}
                    />
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>${localPriceRange[0]}</span>
            <span>${localPriceRange[1]}</span>
          </div>
          
          <div className="relative">
            <input
              type="range"
              min={priceRange[0]}
              max={priceRange[1]}
              value={localPriceRange[0]}
              onChange={(e) => {
                const newMin = Math.min(parseInt(e.target.value), localPriceRange[1])
                const newRange: [number, number] = [newMin, localPriceRange[1]]
                handlePriceRangeChange(newRange)
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="range"
              min={priceRange[0]}
              max={priceRange[1]}
              value={localPriceRange[1]}
              onChange={(e) => {
                const newMax = Math.max(parseInt(e.target.value), localPriceRange[0])
                const newRange: [number, number] = [localPriceRange[0], newMax]
                handlePriceRangeChange(newRange)
              }}
              className="absolute top-0 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              min={priceRange[0]}
              max={priceRange[1]}
              value={localPriceRange[0]}
              onChange={(e) => {
                const newMin = Math.min(parseInt(e.target.value) || priceRange[0], localPriceRange[1])
                const newRange: [number, number] = [newMin, localPriceRange[1]]
                handlePriceRangeChange(newRange)
              }}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Min"
            />
            <input
              type="number"
              min={priceRange[0]}
              max={priceRange[1]}
              value={localPriceRange[1]}
              onChange={(e) => {
                const newMax = Math.max(parseInt(e.target.value) || priceRange[1], localPriceRange[0])
                const newRange: [number, number] = [localPriceRange[0], newMax]
                handlePriceRangeChange(newRange)
              }}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* Stock Filter */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Availability</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="stock"
              checked={filters.inStock === null}
              onChange={() => handleStockFilterChange(null)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">All Products</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              name="stock"
              checked={filters.inStock === true}
              onChange={() => handleStockFilterChange(true)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">In Stock</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="radio"
              name="stock"
              checked={filters.inStock === false}
              onChange={() => handleStockFilterChange(false)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Out of Stock</span>
          </label>
        </div>
      </div>
    </div>
  )
}