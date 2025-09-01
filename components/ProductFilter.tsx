'use client'

import { useState } from 'react'
import type { Category, Tag } from '@/types'

interface ProductFilterProps {
  categories: Category[]
  tags: Tag[]
}

export default function ProductFilter({ categories, tags }: ProductFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleTagToggle = (tagSlug: string) => {
    setSelectedTags(prev => 
      prev.includes(tagSlug)
        ? prev.filter(t => t !== tagSlug)
        : [...prev, tagSlug]
    )
  }

  return (
    <div className="space-y-6">
      {/* Categories Filter */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Categories</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              value=""
              checked={selectedCategory === ''}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mr-3 text-primary-600"
            />
            All Categories
          </label>
          {categories.map((category) => (
            <label key={category.id} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category.slug}
                checked={selectedCategory === category.slug}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mr-3 text-primary-600"
              />
              {category.metadata.name}
            </label>
          ))}
        </div>
      </div>

      {/* Tags Filter */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Tags</h3>
        <div className="space-y-2">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center">
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
              {tag.metadata.name}
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedCategory || selectedTags.length > 0) && (
        <button
          onClick={() => {
            setSelectedCategory('')
            setSelectedTags([])
          }}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          Clear All Filters
        </button>
      )}
    </div>
  )
}