import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import CategoryCard from '@/components/CategoryCard'
import ProductCard from '@/components/ProductCard'
import NewsletterSignup from '@/components/NewsletterSignup'
import { getProducts, getCategories } from '@/lib/cosmic'
import { getHomeMetadata, getOrganizationStructuredData, getWebsiteStructuredData } from '@/lib/seo'
import Link from 'next/link'

export async function generateMetadata(): Promise<Metadata> {
  return getHomeMetadata()
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ])

  // Get featured products (first 3 for hero rotation)
  const featuredProducts = products.slice(0, 3)
  
  // Get latest products for display
  const latestProducts = products.slice(0, 8)

  // Generate structured data
  const organizationData = getOrganizationStructuredData()
  const websiteData = getWebsiteStructuredData()

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationData, websiteData])
        }}
      />

      <div className="min-h-screen">
        {/* Hero Section with Featured Products */}
        <Hero featuredProducts={featuredProducts} />

        {/* Categories Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                Shop by Category
              </h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                Explore our carefully curated categories to find exactly what you're looking for
              </p>
            </div>
            
            {categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {categories.slice(0, 6).map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-secondary-600">No categories available at the moment.</p>
              </div>
            )}

            {categories.length > 6 && (
              <div className="text-center">
                <Link
                  href="/categories"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
                >
                  View All Categories
                  <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                Latest Products
              </h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                Discover our newest arrivals and trending anime merchandise
              </p>
            </div>
            
            {latestProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8">
                  {latestProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                <div className="text-center">
                  <Link
                    href="/products"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-200"
                  >
                    View All Products
                    <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-secondary-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V9a2 2 0 01-2 2H9a2 2 0 01-2-2V5a2 2 0 012-2h2a2 2 0 012 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-secondary-900 mb-2">No products available</h3>
                <p className="text-secondary-600">Check back soon for new anime merchandise!</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <NewsletterSignup />
      </div>
    </>
  )
}