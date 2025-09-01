// app/products/[slug]/page.tsx
import { getProduct, getProducts } from '@/lib/cosmic'
import ProductGallery from '@/components/ProductGallery'
import ProductInfo from '@/components/ProductInfo'
import RelatedProducts from '@/components/RelatedProducts'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductMetadata, getProductStructuredData, getBreadcrumbStructuredData } from '@/lib/seo'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for could not be found.',
    }
  }

  return getProductMetadata(product)
}

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getProducts()
  const filteredRelatedProducts = relatedProducts
    .filter(p => p.id !== product.id && p.metadata.category.id === product.metadata.category.id)
    .slice(0, 4)

  // Generate structured data
  const productStructuredData = getProductStructuredData(product)
  const breadcrumbData = getBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: product.metadata.category.metadata.name, url: `/categories/${product.metadata.category.slug}` },
    { name: product.metadata.name }
  ])

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData)
        }}
      />
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
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-secondary-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <a href={`/categories/${product.metadata.category.slug}`} className="ml-1 hover:text-primary-600 md:ml-2">
                  {product.metadata.category.metadata.name}
                </a>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-secondary-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-secondary-500 md:ml-2">{product.metadata.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <ProductGallery product={product} />
          <ProductInfo product={product} />
        </div>

        {filteredRelatedProducts.length > 0 && (
          <RelatedProducts products={filteredRelatedProducts} />
        )}
      </div>
    </>
  )
}