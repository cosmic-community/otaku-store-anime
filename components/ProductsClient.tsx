'use client'

import { useState, useCallback } from 'react'
import type { Product, Category, Tag } from '@/types'
import ProductCard from '@/components/ProductCard'
import ProductFilter from '@/components/ProductFilter'

interface ProductsClientProps {
  products: Product[]
  categories: Category[]
  tags: Tag[]
}

export default function ProductsClient({ products, categories, tags }: ProductsClientProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)

  const handleFilterChange = useCallback((filtered: Product[]) => {
    setFilteredProducts(filtered)
  }, [])

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Filters Sidebar */}
      <aside className="lg:w-1/4">
        <div className="sticky top-24">
          <ProductFilter 
            categories={categories} 
            tags={tags}
            products={products}
            onFilterChange={handleFilterChange}
          />
        </div>
      </aside>
      
      {/* Products Grid */}
      <main className="lg:w-3/4">
        {/* Results count */}
        <div className="mb-6">
          <p className="text-secondary-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl text-secondary-600 mb-4">No products found</h3>
            <p className="text-secondary-500">Try adjusting your filters or check back soon for new arrivals!</p>
          </div>
        )}
      </main>
    </div>
  )
}