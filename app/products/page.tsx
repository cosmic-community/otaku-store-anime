import { getProducts, getCategories } from '@/lib/cosmic'
import ProductsClient from '@/components/ProductsClient'
import type { Metadata } from 'next'
import { getProductsMetadata, getBreadcrumbStructuredData } from '@/lib/seo'

export const metadata: Metadata = getProductsMetadata()

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ])

  // Generate breadcrumb structured data
  const breadcrumbData = getBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Products' }
  ])

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData)
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">All Products</h1>
          <p className="text-lg text-secondary-600">
            Browse our complete collection of premium anime merchandise
          </p>
        </div>
        
        <ProductsClient initialProducts={products} categories={categories} />
      </div>
    </>
  )
}