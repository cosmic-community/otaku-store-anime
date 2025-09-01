// app/categories/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategory, getProductsByCategory, getCategories } from '@/lib/cosmic'
import ProductCard from '@/components/ProductCard'
import NewsletterSignup from '@/components/NewsletterSignup'
import { getCategoryMetadata, getBreadcrumbStructuredData } from '@/lib/seo'
import Link from 'next/link'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const categories = await getCategories()
  
  return categories.map((category) => ({
    slug: category.slug,
  }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  // IMPORTANT: In Next.js 15+, params are now Promises and MUST be awaited
  const { slug } = await params
  
  const category = await getCategory(slug)
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    }
  }

  return getCategoryMetadata(category)
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // IMPORTANT: In Next.js 15+, params are now Promises and MUST be awaited
  const { slug } = await params
  
  const category = await getCategory(slug)

  if (!category) {
    notFound()
  }

  const products = await getProductsByCategory(slug)

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

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative bg-secondary-900 text-white overflow-hidden">
          {/* Background Image */}
          {category.metadata.category_image?.imgix_url && (
            <div className="absolute inset-0">
              <img
                src={`${category.metadata.category_image.imgix_url}?w=1920&h=600&fit=crop&auto=format,compress&blur=10&brightness=-30`}
                alt={`${category.metadata.name} category background`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
            </div>
          )}
          
          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 py-20">
            {/* Breadcrumb */}
            <nav className="mb-8" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-white/70">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li>
                  <Link href="/products" className="hover:text-white transition-colors">
                    Products
                  </Link>
                </li>
                <li>
                  <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </li>
                <li className="text-white font-medium">
                  {category.metadata.name}
                </li>
              </ol>
            </nav>

            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                {category.metadata.name}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Collection
                </span>
              </h1>
              {category.metadata.description && (
                <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-medium">
                  {category.metadata.description}
                </p>
              )}
              
              {/* Product count */}
              <div className="flex justify-center mt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{products.length}</div>
                  <div className="text-sm text-white/70">Products Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-4 py-16">
          {products.length > 0 ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-secondary-900 mb-4">
                  {category.metadata.name} Products
                </h2>
                <p className="text-secondary-600">
                  Showing {products.length} product{products.length !== 1 ? 's' : ''} in this category
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-6">
                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V9a2 2 0 01-2 2H9a2 2 0 01-2-2V5a2 2 0 012-2h2a2 2 0 012 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-4">
                No products in this category yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We're constantly adding new products. Check back soon for amazing {category.metadata.name.toLowerCase()} items!
              </p>
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Browse All Products
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsletterSignup />
    </>
  )
}