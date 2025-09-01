import { getProducts, getCategories } from '@/lib/cosmic'
import Hero from '@/components/Hero'
import ProductCard from '@/components/ProductCard'
import CategoryCard from '@/components/CategoryCard'
import NewsletterSignup from '@/components/NewsletterSignup'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getBaseMetadata, getBreadcrumbStructuredData } from '@/lib/seo'

export const metadata: Metadata = {
  ...getBaseMetadata({
    title: 'Otaku Store - Premium Anime T-Shirts & Stickers',
    description: 'Discover premium anime-themed t-shirts, kawaii stickers, and limited edition merchandise. Express your otaku spirit with our curated collection.',
    ogType: 'home'
  }),
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ])

  // Get featured products (first 6)
  const featuredProducts = products.slice(0, 6)

  // Generate breadcrumb structured data
  const breadcrumbData = getBreadcrumbStructuredData([
    { name: 'Home' }
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

      <Hero />
      
      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Explore our curated collections of premium anime merchandise
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">Featured Products</h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Discover our most popular anime-themed merchandise
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/products"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <NewsletterSignup />
    </>
  )
}