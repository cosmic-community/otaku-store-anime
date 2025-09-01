// app/categories/[slug]/page.tsx
import { getCategory, getProductsByCategory, getCategories } from '@/lib/cosmic'
import ProductCard from '@/components/ProductCard'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCategoryMetadata, getBreadcrumbStructuredData } from '@/lib/seo'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The category you are looking for could not be found.',
    }
  }

  return getCategoryMetadata(category)
}

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((category) => ({
    slug: category.slug,
  }))
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const [category, products] = await Promise.all([
    getCategory(slug),
    getProductsByCategory(slug)
  ])

  if (!category) {
    notFound()
  }

  // Generate breadcrumb structured data
  const breadcrumbData = getBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: category.metadata.name }
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
        {/* Breadcrumb Navigation */}
        <nav className="flex text-sm text-secondary-600 mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a href="/" className="hover:text-primary-600">Home</a>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-secondary-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <a href="/products" className="ml-1 hover:text-primary-600 md:ml-2">Products</a>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-secondary-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-secondary-500 md:ml-2">{category.metadata.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Category Header */}
        <div className="mb-12">
          {category.metadata.category_image && (
            <div className="mb-8">
              <img
                src={`${category.metadata.category_image.imgix_url}?w=1200&h=300&fit=crop&auto=format,compress`}
                alt={category.metadata.name}
                className="w-full h-48 md:h-64 object-cover rounded-lg"
              />
            </div>
          )}
          
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            {category.metadata.name}
          </h1>
          
          {category.metadata.description && (
            <p className="text-lg text-secondary-600 max-w-3xl">
              {category.metadata.description}
            </p>
          )}
          
          <div className="mt-6">
            <p className="text-secondary-500">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-secondary-700 mb-4">
              No products found in this category
            </h3>
            <p className="text-secondary-500 mb-8">
              Check back soon for new arrivals!
            </p>
            <a 
              href="/products"
              className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Browse All Products
            </a>
          </div>
        )}
      </div>
    </>
  )
}