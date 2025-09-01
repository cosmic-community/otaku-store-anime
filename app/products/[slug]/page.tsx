// app/products/[slug]/page.tsx
import { getProduct, getProducts } from '@/lib/cosmic'
import { notFound } from 'next/navigation'
import ProductGallery from '@/components/ProductGallery'
import ProductInfo from '@/components/ProductInfo'
import RelatedProducts from '@/components/RelatedProducts'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)
  
  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }
  
  return {
    title: `${product.metadata.name} - Otaku Store`,
    description: product.metadata.description?.replace(/<[^>]*>/g, '') || 'Premium anime merchandise',
  }
}

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProduct(slug)
  
  if (!product) {
    notFound()
  }

  // Get related products from the same category
  const allProducts = await getProducts()
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && p.metadata.category?.slug === product.metadata.category?.slug)
    .slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <ProductGallery product={product} />
        
        {/* Product Info */}
        <ProductInfo product={product} />
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </div>
  )
}