import type { Metadata } from 'next'
import { getProducts, getCategories } from '@/lib/cosmic'
import ProductsClient from '@/components/ProductsClient'
import NewsletterSignup from '@/components/NewsletterSignup'
import { getProductsMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return getProductsMetadata()
}

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ])
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Premium Anime Merchandise
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Discover our curated collection of high-quality anime-themed products. From exclusive t-shirts to collectible stickers, find your perfect otaku gear.
          </p>
        </div>
      </div>

      {/* Products Section */}
      {/*<ProductsClient initialProducts={products} categories={categories} />*/}
      
      {/* Newsletter Section */}
      <NewsletterSignup />
    </div>
  )
}