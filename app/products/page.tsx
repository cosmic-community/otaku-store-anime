import { Suspense } from 'react'
import { Metadata } from 'next'
import ProductsClient from '@/components/ProductsClient'
import { getProducts, getCategories } from '@/lib/cosmic'
import { getProductsPageMetadata } from '@/lib/seo'

export const metadata: Metadata = getProductsPageMetadata()

export default async function ProductsPage() {
  // Fetch data on server
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Premium Anime Collection
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Discover our curated selection of high-quality anime merchandise, from trending t-shirts to exclusive collectibles.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          }>
            <ProductsClient 
              products={products}
              categories={categories}
            />
          </Suspense>
        </div>
      </section>
    </div>
  )
}