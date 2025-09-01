// app/categories/[slug]/page.tsx
import { getCategory, getProductsByCategory } from '@/lib/cosmic'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/ProductCard'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  
  const [category, products] = await Promise.all([
    getCategory(slug),
    getProductsByCategory(slug)
  ])

  if (!category) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-12 text-center">
        {category.metadata.category_image && (
          <div className="relative mb-8 max-w-2xl mx-auto">
            <img
              src={`${category.metadata.category_image.imgix_url}?w=800&h=400&fit=crop&auto=format,compress`}
              alt={category.metadata.name}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
              width={800}
              height={256}
            />
            <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
                {category.metadata.name}
              </h1>
            </div>
          </div>
        )}
        
        {!category.metadata.category_image && (
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-secondary-900">
            {category.metadata.name}
          </h1>
        )}

        {category.metadata.description && (
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            {category.metadata.description}
          </p>
        )}
      </div>

      {/* Products Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-secondary-900">
          {products.length} {products.length === 1 ? 'Product' : 'Products'} in {category.metadata.name}
        </h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl text-secondary-600 mb-4">No products found</h3>
            <p className="text-secondary-500 mb-6">
              We're currently restocking this category. Check back soon for new arrivals!
            </p>
            <a 
              href="/products" 
              className="btn-primary"
            >
              Browse All Products
            </a>
          </div>
        )}
      </div>

      {/* Back to Categories */}
      <div className="text-center">
        <a 
          href="/products" 
          className="btn-secondary"
        >
          Browse All Categories
        </a>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    return {
      title: 'Category Not Found - Otaku Store'
    }
  }

  return {
    title: `${category.metadata.name} - Otaku Store`,
    description: category.metadata.description || `Browse our collection of ${category.metadata.name.toLowerCase()} at Otaku Store.`
  }
}