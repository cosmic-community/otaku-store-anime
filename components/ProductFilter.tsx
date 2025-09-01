'use client'

import { useState, useEffect } from 'react'
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
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    tags: [],
    priceRange: [0, 100],
    availability: 'all',
    sortBy: 'newest'
  })
  const [isExpanded, setIsExpanded] = useState(false)

  // Apply filters whenever state changes
  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  const updateFilter = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleCategory = (category: Category) => {
    const isSelected = filters.categories.some(cat => cat.id === category.id)
    if (isSelected) {
      updateFilter('categories', filters.categories.filter(cat => cat.id !== category.id))
    } else {
      updateFilter('categories', [...filters.categories, category])
    }
  }

  const toggleTag = (tag: Tag) => {
    const isSelected = filters.tags.some(t => t.id === tag.id)
    if (isSelected) {
      updateFilter('tags', filters.tags.filter(t => t.id !== tag.id))
    } else {
      updateFilter('tags', [...filters.tags, tag])
    }
  }

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      tags: [],
      priceRange: [0, 100],
      availability: 'all',
      sortBy: 'newest'
    })
  }

  const hasActiveFilters = filters.categories.length > 0 || 
    filters.tags.length > 0 || 
    filters.priceRange[0] > 0 || 
    filters.priceRange[1] < 100 || 
    filters.availability !== 'all'

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Mobile Toggle */}
      <div className="block lg:hidden">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 rounded-t-lg border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
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
              className={`w-5 h-5 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <div className="p-4 lg:p-6 space-y-6">
          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Active filters</span>
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium focus:outline-none"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Sort By */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Sort by</h3>
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value as FilterOptions['sortBy'])}
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

          {/* Categories */}
          {categories.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Categories</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto pl-1">
                {categories.map((category) => {
                  const isSelected = filters.categories.some(cat => cat.id === category.id)
                  return (
                    <div key={category.id} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        checked={isSelected}
                        onChange={() => toggleCategory(category)}
                        className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                      />
                      <label
                        htmlFor={`category-${category.id}`}
                        className="text-sm text-gray-700 cursor-pointer select-none"
                      >
                        {category.metadata?.name || category.title}
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Tags</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto pl-1">
                {tags.map((tag) => {
                  const isSelected = filters.tags.some(t => t.id === tag.id)
                  return (
                    <div key={tag.id} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={`tag-${tag.id}`}
                        checked={isSelected}
                        onChange={() => toggleTag(tag)}
                        className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                      />
                      <label
                        htmlFor={`tag-${tag.id}`}
                        className="text-sm text-gray-700 cursor-pointer select-none"
                      >
                        {tag.metadata?.name || tag.title}
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Price Range */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Price Range</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
              
              <input
                type="range"
                min="0"
                max="100"
                value={filters.priceRange[1]}
                onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${filters.priceRange[1]}%, #e5e7eb ${filters.priceRange[1]}%, #e5e7eb 100%)`
                }}
              />
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Min</label>
                  <input
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0
                      updateFilter('priceRange', [value, filters.priceRange[1]])
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Max</label>
                  <input
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 100
                      updateFilter('priceRange', [filters.priceRange[0], value])
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
            <div className="space-y-2 pl-1">
              {[
                { value: 'all', label: 'All Products' },
                { value: 'in_stock', label: 'In Stock' },
                { value: 'out_of_stock', label: 'Out of Stock' }
              ].map(({ value, label }) => (
                <div key={value} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="availability"
                    id={`availability-${value}`}
                    value={value}
                    checked={filters.availability === value}
                    onChange={(e) => updateFilter('availability', e.target.value as FilterOptions['availability'])}
                    className="w-4 h-4 text-primary-600 bg-white border-gray-300 focus:ring-primary-500 focus:ring-2"
                  />
                  <label
                    htmlFor={`availability-${value}`}
                    className="text-sm text-gray-700 cursor-pointer select-none"
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles for slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #dc2626;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #dc2626;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )
}