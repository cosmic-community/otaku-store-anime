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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [availability, setAvailability] = useState<'all' | 'in_stock' | 'out_of_stock'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price_low' | 'price_high' | 'name_asc' | 'name_desc'>('newest')
  const [isExpanded, setIsExpanded] = useState(false)

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

  const handleCategoryToggle = useCallback((categoryId: string, event: React.MouseEvent) => {
    // Prevent event bubbling that might interfere with links
    event.stopPropagation()
    
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }, [])

  const handleTagToggle = useCallback((tagId: string, event: React.MouseEvent) => {
    // Prevent event bubbling
    event.stopPropagation()
    
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }, [])

  const handleClearFilters = useCallback((event: React.MouseEvent) => {
    // Prevent event bubbling
    event.stopPropagation()
    
    setSelectedCategories([])
    setSelectedTags([])
    setPriceRange([0, 100])
    setAvailability('all')
    setSortBy('newest')
  }, [])

  const handleSortChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    // Prevent event bubbling
    event.stopPropagation()
    setSortBy(event.target.value as FilterOptions['sortBy'])
  }, [])

  const handleAvailabilityChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent event bubbling
    event.stopPropagation()
    setAvailability(event.target.value as FilterOptions['availability'])
  }, [])

  const handlePriceRangeChange = useCallback((type: 'min' | 'max', value: number, event: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent event bubbling
    event.stopPropagation()
    
    if (type === 'min') {
      setPriceRange([value, priceRange[1]])
    } else {
      setPriceRange([priceRange[0], value])
    }
  }, [priceRange])

  const handleSliderChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent event bubbling
    event.stopPropagation()
    setPriceRange([priceRange[0], parseInt(event.target.value)])
  }, [priceRange])

  const toggleExpansion = useCallback((event: React.MouseEvent) => {
    // Prevent event bubbling
    event.stopPropagation()
    setIsExpanded(!isExpanded)
  }, [isExpanded])

  const hasActiveFilters = selectedCategories.length > 0 || selectedTags.length > 0 || 
    priceRange[0] > 0 || priceRange[1] < 100 || availability !== 'all'

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm relative ${className}`}>
      {/* Mobile Toggle - Simplified */}
      <div className="block lg:hidden">
        <button
          type="button"
          onClick={toggleExpansion}
          className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 rounded-t-lg border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
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
                isExpanded ? 'rotate-180' : ''
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

      {/* Filter Content - Properly scoped */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block bg-white rounded-b-lg lg:rounded-lg`}>
        <div 
          className="p-4 lg:p-6 space-y-6"
          onClick={(e) => e.stopPropagation()} // Prevent click events from bubbling
        >
          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Active filters</span>
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium focus:outline-none focus:underline transition-colors px-2 py-1 rounded"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Sort By Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Sort by</h3>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
          </div>

          {/* Categories Section */}
          {categories.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Categories</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {categories.map((category) => (
                  <div 
                    key={category.id} 
                    className="flex items-center space-x-3 cursor-pointer group p-1 rounded hover:bg-gray-50"
                    onClick={(e) => handleCategoryToggle(category.id, e)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => {}} // Controlled by parent click
                      className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 focus:ring-2 pointer-events-none"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors select-none">
                      {category.metadata?.name || category.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags Section */}
          {tags.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Tags</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {tags.map((tag) => (
                  <div 
                    key={tag.id} 
                    className="flex items-center space-x-3 cursor-pointer group p-1 rounded hover:bg-gray-50"
                    onClick={(e) => handleTagToggle(tag.id, e)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={() => {}} // Controlled by parent click
                      className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 focus:ring-2 pointer-events-none"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors select-none">
                      {tag.metadata?.name || tag.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Range Section */}
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
                onChange={handleSliderChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Min</label>
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceRangeChange('min', parseInt(e.target.value) || 0, e)}
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
                    onChange={(e) => handlePriceRangeChange('max', parseInt(e.target.value) || 100, e)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Availability Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Availability</h3>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All Products' },
                { value: 'in_stock', label: 'In Stock' },
                { value: 'out_of_stock', label: 'Out of Stock' }
              ].map(({ value, label }) => (
                <div 
                  key={value} 
                  className="flex items-center space-x-3 cursor-pointer group p-1 rounded hover:bg-gray-50"
                  onClick={(e) => {
                    e.stopPropagation()
                    setAvailability(value as FilterOptions['availability'])
                  }}
                >
                  <input
                    type="radio"
                    name="availability"
                    value={value}
                    checked={availability === value}
                    onChange={() => {}} // Controlled by parent click
                    className="w-4 h-4 text-primary-600 bg-white border-gray-300 focus:ring-primary-500 focus:ring-2 pointer-events-none"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors select-none">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}