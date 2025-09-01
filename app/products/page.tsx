import { getProducts, getCategories } from '@/lib/cosmic'
import ProductsClient from '@/components/ProductsClient'
import type { Product, Category } from '@/types'

export const metadata = {
  title: 'Products - Otaku Store',
  description: 'Browse our collection of anime-themed merchandise including t-shirts, stickers, and limited edition items.',
}

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ])

  // Ensure we have valid data before passing to client component
  const validProducts: Product[] = products || []
  const validCategories: Category[] = categories || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Our Products
          </h1>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            Discover our curated collection of premium anime merchandise, from trendy apparel to collectible items.
          </p>
        </div>

        <ProductsClient 
          products={validProducts}
          categories={validCategories}
        />
      </div>
    </div>
  )
}