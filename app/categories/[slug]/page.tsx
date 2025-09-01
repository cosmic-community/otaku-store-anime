// app/categories/[slug]/page.tsx
import { getCategory, getProductsByCategory, getCategories } from '@/lib/cosmic'
import { notFound } from 'next/navigation'
import ProductCard from '@/components/ProductCard'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategory(slug)
  
  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }
  
  return {
    title: `${category.metadata.name} - Otaku Store`,
    description: category.metadata.description || `Browse our collection of ${category.metadata.name.toLowerCase()}`,
  }
}

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((category) => ({
    slug: category.slug,
  }))
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
      <div className="text-center mb-12">
        {category.metadata.category_image && (
          <div className="mb-6">
            <img
              src={`${category.metadata.category_image.imgix_url}?w=400&h=200&fit=crop&auto=format,compress`}
              alt={category.metadata.name}
              className="w-80 h-40 object-cover rounded-lg mx-auto shadow-lg"
              width={320}
              height={160}
            />
          </div>
        )}
        <h1 className="text-4xl font-bold mb-4">{category.metadata.name}</h1>
        {category.metadata.description && (
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            {category.metadata.description}
          </p>
        )}
      </div>
      
      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl text-secondary-600 mb-4">No products found</h3>
          <p className="text-secondary-500">Check back soon for new arrivals in this category!</p>
        </div>
      )}
    </div>
  )
}