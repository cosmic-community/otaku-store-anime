'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Category, Tag } from '@/types'

interface FilterOptions {
  categories: Category[]
  tags: Tag[]
  priceRange: [number, number]
  availability: 'all' | 'in_stock' | 'out_of_stock'
  sortBy: 'newest' | 'oldest' | 'price_low' | 'price_high' | 'name_asc' | 'name_desc'
}

interface ProductFilterProps {
  onFilterChange: (filters: FilterOptions) => void
  categories: Category[]
  tags: Tag[]
  className?: string
}

export default function ProductFilter({ onFilterChange, categories, tags, className = '' }: ProductFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [availability, setAvailability] = useState<'all' | 'in_stock' | 'out_of_stock'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price_low' | 'price_high' | 'name_asc' | 'name_desc'>('newest')

  // Memoized filter change handler to prevent unnecessary re-renders
  const handleFilterChange = useCallback(() => {
    onFilterChange({
      categories: categories.filter(cat => selectedCategories.includes(cat.id)),
      tags: tags.filter(tag => selectedTags.includes(tag.id)),
      priceRange,
      availability,
      sortBy
    })
  }, [selectedCategories, selectedTags, priceRange, availability, sortBy, categories, tags, onFilterChange])

  // Apply filters whenever state changes
  useEffect(() => {
    handleFilterChange()
  }, [handleFilterChange])

  // Event handlers with proper event stopping
  const handleToggleFilter = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }, [isOpen])

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }, [])

  const handleTagChange = useCallback((tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }, [])

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation()
    setSortBy(e.target.value as FilterOptions['sortBy'])
  }, [])

  const handleAvailabilityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    setAvailability(e.target.value as FilterOptions['availability'])
  }, [])

  const handlePriceRangeChange = useCallback((newRange: [number, number]) => {
    setPriceRange(newRange)
  }, [])

  const handleClearFilters = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedCategories([])
    setSelectedTags([])
    setPriceRange([0, 100])
    setAvailability('all')
    setSortBy('newest')
  }, [])

  const hasActiveFilters = selectedCategories.length > 0 || selectedTags.length > 0 || 
    priceRange[0] > 0 || priceRange[1] < 100 || availability !== 'all'

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={handleToggleFilter}
          className="w-full flex items-center justify-between p-4 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
          aria-expanded={isOpen}
          aria-controls="filter-panel"
        >
          <span className="font-medium text-gray-900">Filters</span>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                Active
              </span>
            )}
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Filter Panel */}
      <div
        id="filter-panel"
        className={`${
          isOpen ? 'block' : 'hidden'
        } lg:block border-t border-gray-200 lg:border-t-0`}
      >
        <div className="p-4 lg:p-6 space-y-6">
          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-sm text-gray-600">Active filters</span>
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus:underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Sort By */}
          <div className="space-y-3">
            <label htmlFor="sort-select" className="block font-semibold text-gray-900">
              Sort by
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={handleSortChange}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <fieldset className="space-y-3">
              <legend className="font-semibold text-gray-900">Categories</legend>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onChange={(e) => {
                        e.stopPropagation()
                        handleCategoryChange(category.id)
                      }}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label 
                      htmlFor={`category-${category.id}`} 
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      {category.metadata.name}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <fieldset className="space-y-3">
              <legend className="font-semibold text-gray-900">Tags</legend>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`tag-${tag.id}`}
                      checked={selectedTags.includes(tag.id)}
                      onChange={(e) => {
                        e.stopPropagation()
                        handleTagChange(tag.id)
                      }}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label 
                      htmlFor={`tag-${tag.id}`} 
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      {tag.metadata.name}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          )}

          {/* Price Range */}
          <fieldset className="space-y-3">
            <legend className="font-semibold text-gray-900">Price Range</legend>
            <div className="px-2">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-sm text-gray-600">${priceRange[0]}</span>
                <span className="text-sm text-gray-600">${priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange[1]}
                onChange={(e) => {
                  e.stopPropagation()
                  handlePriceRangeChange([priceRange[0], parseInt(e.target.value)])
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                aria-label="Maximum price"
              />
              <div className="flex items-center space-x-2 mt-3">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => {
                    e.stopPropagation()
                    handlePriceRangeChange([parseInt(e.target.value) || 0, priceRange[1]])
                  }}
                  className="w-20 p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                  max="100"
                  aria-label="Minimum price"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => {
                    e.stopPropagation()
                    handlePriceRangeChange([priceRange[0], parseInt(e.target.value) || 100])
                  }}
                  className="w-20 p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="0"
                  max="100"
                  aria-label="Maximum price"
                />
              </div>
            </div>
          </fieldset>

          {/* Availability */}
          <fieldset className="space-y-3">
            <legend className="font-semibold text-gray-900">Availability</legend>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="availability-all"
                  name="availability"
                  value="all"
                  checked={availability === 'all'}
                  onChange={handleAvailabilityChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="availability-all" className="text-sm text-gray-700 cursor-pointer">
                  All Products
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="availability-in-stock"
                  name="availability"
                  value="in_stock"
                  checked={availability === 'in_stock'}
                  onChange={handleAvailabilityChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="availability-in-stock" className="text-sm text-gray-700 cursor-pointer">
                  In Stock
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="availability-out-of-stock"
                  name="availability"
                  value="out_of_stock"
                  checked={availability === 'out_of_stock'}
                  onChange={handleAvailabilityChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <label htmlFor="availability-out-of-stock" className="text-sm text-gray-700 cursor-pointer">
                  Out of Stock
                </label>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  )
}