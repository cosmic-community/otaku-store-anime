import { getProducts, getCategories, getTags } from '@/lib/cosmic'
import ProductCard from '@/components/ProductCard'
import ProductFilter from '@/components/ProductFilter'

export const metadata = {
  title: 'All Products - Otaku Store',
  description: 'Browse our complete collection of anime t-shirts, stickers, and limited edition merchandise.',
}

export default async function ProductsPage() {
  const [products, categories, tags] = await Promise.all([
    getProducts(),
    getCategories(),
    getTags()
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">All Products</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-1/4">
          <ProductFilter categories={categories} tags={tags} />
        </aside>
        
        {/* Products Grid */}
        <main className="lg:w-3/4">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl text-secondary-600 mb-4">No products found</h3>
              <p className="text-secondary-500">Check back soon for new arrivals!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}