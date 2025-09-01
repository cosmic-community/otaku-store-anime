import { getProducts, getCategories, getTags } from '@/lib/cosmic'
import ProductsClient from '@/components/ProductsClient'

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
      
      <ProductsClient 
        products={products}
        categories={categories}
        tags={tags}
      />
    </div>
  )
}