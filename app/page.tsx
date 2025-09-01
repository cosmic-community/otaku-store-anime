import { getProducts, getCategories } from '@/lib/cosmic'
import ProductCard from '@/components/ProductCard'
import CategoryCard from '@/components/CategoryCard'
import Hero from '@/components/Hero'
import NewsletterSignup from '@/components/NewsletterSignup'

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ])

  // Get featured products (first 6)
  const featuredProducts = products.slice(0, 6)

  return (
    <div>
      {/* Hero Section */}
      <Hero />
      
      {/* Categories Section */}
      <section className="py-16 bg-secondary-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {products.length > 6 && (
            <div className="text-center mt-12">
              <a 
                href="/products" 
                className="btn-primary"
              >
                View All Products
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSignup />
    </div>
  )
}