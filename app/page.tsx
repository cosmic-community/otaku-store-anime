import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import ProductCard from '@/components/ProductCard'
import CategoryCard from '@/components/CategoryCard'
import NewsletterSignup from '@/components/NewsletterSignup'
import { getProducts, getCategories } from '@/lib/cosmic'
import { getHomeMetadata } from '@/lib/seo'
import { getWebsiteStructuredData, getOrganizationStructuredData } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return getHomeMetadata()
}

export default async function Home() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ])

  // Get featured products (limit to first 8)
  const featuredProducts = products.slice(0, 8)

  // Generate structured data
  const websiteStructuredData = getWebsiteStructuredData()
  const organizationStructuredData = getOrganizationStructuredData()

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([websiteStructuredData, organizationStructuredData])
        }}
      />

      <main className="min-h-screen">
        {/* Hero Section */}
        <Hero />

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                  Featured Products
                </h2>
                <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                  Discover our most popular anime-themed merchandise, carefully selected for true otaku fans.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* View All Products Link */}
              <div className="text-center mt-12">
                <a
                  href="/products"
                  className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  View All Products
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Categories Section */}
        {categories.length > 0 && (
          <section className="py-20 bg-secondary-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                  Shop by Category
                </h2>
                <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                  Explore our diverse collection of anime merchandise organized by category.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Stats Section */}
        <section className="py-20 bg-secondary-900 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">
                  {products.length}+
                </div>
                <div className="text-lg text-white/80">Premium Products</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">
                  {categories.length}+
                </div>
                <div className="text-lg text-white/80">Categories</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">
                  100%
                </div>
                <div className="text-lg text-white/80">Authentic</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">
                  24/7
                </div>
                <div className="text-lg text-white/80">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <NewsletterSignup />
      </main>
    </>
  )
}