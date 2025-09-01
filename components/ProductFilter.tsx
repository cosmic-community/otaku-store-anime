'use client'

import { useState, useEffect } from 'react'
import type { Category, Tag, Product } from '@/types'

interface ProductFilterProps {
  categories: Category[]
  tags: Tag[]
  products: Product[]
  onFilterChange: (filteredProducts: Product[]) => void
}

export default function ProductFilter({ categories, tags, products, onFilterChange }: ProductFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Apply filters whenever selections change
  useEffect(() => {
    let filteredProducts = [...products]

    // Filter by category
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(product => 
        product.metadata.category?.slug === selectedCategory
      )
    }

    // Filter by tags (product must have at least one of the selected tags)
    if (selectedTags.length > 0) {
      filteredProducts = filteredProducts.filter(product => {
        const productTags = product.metadata.tags || []
        return selectedTags.some(selectedTag => 
          productTags.some(productTag => productTag.slug === selectedTag)
        )
      })
    }

    onFilterChange(filteredProducts)
  }, [selectedCategory, selectedTags, products, onFilterChange])

  const handleTagToggle = (tagSlug: string) => {
    setSelectedTags(prev => 
      prev.includes(tagSlug)
        ? prev.filter(t => t !== tagSlug)
        : [...prev, tagSlug]
    )
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedTags([])
  }

  return (
    <div className="space-y-6">
      {/* Categories Filter */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Categories</h3>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="category"
              value=""
              checked={selectedCategory === ''}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mr-3 text-primary-600"
            />
            <span className="text-secondary-700">All Categories</span>
          </label>
          {categories.map((category) => (
            <label key={category.id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category.slug}
                checked={selectedCategory === category.slug}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mr-3 text-primary-600"
              />
              <span className="text-secondary-700">{category.metadata.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags Filter */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Tags</h3>
        <div className="space-y-2">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag.slug)}
                onChange={() => handleTagToggle(tag.slug)}
                className="mr-3 text-primary-600"
              />
              <span
                className="inline-block w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: tag.metadata.color || '#6b7280' }}
              />
              <span className="text-secondary-700">{tag.metadata.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {(selectedCategory || selectedTags.length > 0) && (
        <div className="border-t pt-4">
          <div className="mb-3">
            <h4 className="font-medium text-sm text-secondary-600 mb-2">Active Filters:</h4>
            <div className="space-y-1">
              {selectedCategory && (
                <div className="text-sm text-primary-600">
                  Category: {categories.find(c => c.slug === selectedCategory)?.metadata.name}
                </div>
              )}
              {selectedTags.length > 0 && (
                <div className="text-sm text-primary-600">
                  Tags: {selectedTags.map(slug => 
                    tags.find(t => t.slug === slug)?.metadata.name
                  ).join(', ')}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={clearFilters}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium underline"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  )
}