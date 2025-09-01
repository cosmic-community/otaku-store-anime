import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import ProductCard from '@/components/ProductCard'
import CategoryCard from '@/components/CategoryCard'
import NewsletterSignup from '@/components/NewsletterSignup'
import { getProducts, getCategories } from '@/lib/cosmic'
import { getHomeMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  // Get the first featured product for OG image
  const products = await getProducts()
  const featuredProduct = products.find(p => 
    p.metadata?.tags?.some(tag => tag.slug === 'best-seller')
  ) || products[0] // Fallback to first product if no best seller

  return getHomeMetadata(featuredProduct?.metadata?.featured_image?.imgix_url)
}

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ])
  
  // Get featured products (limit to 6 for display)
  const featuredProducts = products.slice(0, 6)
  
  return (
    <main>
      <Hero />
      
      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-secondary-900 mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <a
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              View All Products
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-secondary-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-secondary-900 mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>
      
      <NewsletterSignup />
    </main>
  )
}