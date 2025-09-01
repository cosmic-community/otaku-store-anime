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
  
  // Get featured product for hero background - with proper null checks
  const featuredProduct = products.find(p => 
    p.metadata?.tags?.some(tag => tag.slug === 'featured' || tag.slug === 'best-seller')
  ) || (products.length > 0 ? products[0] : null)
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Product Background */}
      <div className="relative bg-secondary-900 text-white overflow-hidden">
        {/* Background Image */}
        {featuredProduct?.metadata?.featured_image?.imgix_url && (
          <div className="absolute inset-0">
            <img
              src={`${featuredProduct.metadata.featured_image.imgix_url}?w=1920&h=600&fit=crop&auto=format,compress&blur=15&brightness=-40`}
              alt="Products hero background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
          </div>
        )}
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Premium Anime
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Collection
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-medium">
              Discover our curated collection of high-quality anime-themed products. From exclusive t-shirts to collectible stickers, find your perfect otaku gear.
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{products.length}+</div>
                <div className="text-sm text-white/70">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{categories.length}+</div>
                <div className="text-sm text-white/70">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">100%</div>
                <div className="text-sm text-white/70">Authentic</div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Product Info - with proper null checks */}
        {featuredProduct?.metadata && (
          <div className="absolute bottom-6 left-6 z-20 hidden lg:block">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 shadow-lg max-w-sm">
              <p className="text-xs text-white/70 mb-1">Featured Product</p>
              <h3 className="text-base font-semibold text-white mb-2 line-clamp-2">
                {featuredProduct.metadata.name || featuredProduct.title}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-yellow-400">
                  ${featuredProduct.metadata.price ? featuredProduct.metadata.price.toFixed(2) : '0.00'}
                </span>
                {featuredProduct.metadata.tags && featuredProduct.metadata.tags.length > 0 && featuredProduct.metadata.tags[0]?.metadata?.name && (
                  <span
                    className="text-xs px-2 py-1 rounded-full text-white font-medium"
                    style={{ backgroundColor: featuredProduct.metadata.tags[0].metadata.color || '#6B7280' }}
                  >
                    {featuredProduct.metadata.tags[0].metadata.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Section */}
      <ProductsClient initialProducts={products} categories={categories} />
      
      {/* Newsletter Section */}
      <NewsletterSignup />
    </div>
  )
}