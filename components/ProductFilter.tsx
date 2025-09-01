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
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [availability, setAvailability] = useState<'all' | 'in_stock' | 'out_of_stock'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price_low' | 'price_high' | 'name_asc' | 'name_desc'>('newest')

  // Apply filters whenever state changes
  useEffect(() => {
    const filteredCategories = categories.filter(cat => selectedCategories.includes(cat.id))
    const filteredTags = tags.filter(tag => selectedTags.includes(tag.id))
    
    onFilterChange({
      categories: filteredCategories,
      tags: filteredTags,
      priceRange,
      availability,
      sortBy
    })
  }, [selectedCategories, selectedTags, priceRange, availability, sortBy, categories, tags, onFilterChange])

  const handleCategoryToggle = useCallback((categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }, [])

  const handleTagToggle = useCallback((tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }, [])

  const handleClearFilters = useCallback(() => {
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
      {/* Mobile Toggle Button */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full flex items-center justify-between p-4 text-left bg-white rounded-t-lg border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          aria-expanded={isMobileOpen}
          aria-controls="mobile-filter-panel"
        >
          <span className="font-medium text-gray-900 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            Filters
          </span>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                Active
              </span>
            )}
            <svg
              className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                isMobileOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Filter Content */}
      <div
        id="mobile-filter-panel"
        className={`
          ${isMobileOpen ? 'block' : 'hidden'} lg:block
          bg-white rounded-b-lg lg:rounded-lg
        `}
      >
        <div className="p-4 lg:p-6 space-y-6">
          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Active filters applied</span>
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus:underline transition-colors"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Sort By */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Sort by</h3>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as FilterOptions['sortBy'])}
                className="w-full appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Categories</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                      {category.metadata?.name || category.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Tags</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {tags.map((tag) => (
                  <label key={tag.id} className="flex items-center space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={() => handleTagToggle(tag.id)}
                      className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                      {tag.metadata?.name || tag.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Price Range */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Price Range</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
              
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                aria-label="Maximum price"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Min</label>
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Max</label>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100])}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Availability</h3>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All Products' },
                { value: 'in_stock', label: 'In Stock' },
                { value: 'out_of_stock', label: 'Out of Stock' }
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="availability"
                    value={value}
                    checked={availability === value}
                    onChange={(e) => setAvailability(e.target.value as FilterOptions['availability'])}
                    className="w-4 h-4 text-primary-600 bg-white border-gray-300 focus:ring-primary-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}