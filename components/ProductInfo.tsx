import type { Product } from '@/types'

interface ProductInfoProps {
  product: Product
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const category = product.metadata.category
  const tags = product.metadata.tags || []

  return (
    <div className="space-y-6">
      {/* Category */}
      {category && (
        <div>
          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
            {category.metadata.name}
          </span>
        </div>
      )}

      {/* Product Name */}
      <h1 className="text-3xl md:text-4xl font-bold text-secondary-900">
        {product.metadata.name}
      </h1>

      {/* Price */}
      <div className="text-3xl font-bold text-primary-600">
        ${product.metadata.price.toFixed(2)}
      </div>

      {/* Stock Status */}
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${product.metadata.in_stock ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className={`font-medium ${product.metadata.in_stock ? 'text-green-700' : 'text-red-700'}`}>
          {product.metadata.in_stock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      {/* SKU */}
      {product.metadata.sku && (
        <p className="text-secondary-600">
          SKU: {product.metadata.sku}
        </p>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="tag text-sm font-medium text-white px-3 py-1 rounded-full"
                style={{ backgroundColor: tag.metadata.color || '#6b7280' }}
              >
                {tag.metadata.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="prose prose-secondary max-w-none">
        <h3 className="text-lg font-semibold mb-3">Description</h3>
        <div 
          dangerouslySetInnerHTML={{ __html: product.metadata.description }}
          className="text-secondary-700"
        />
      </div>

      {/* Add to Cart Button */}
      <div className="pt-6">
        <button
          disabled={!product.metadata.in_stock}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
            product.metadata.in_stock
              ? 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-4 focus:ring-primary-300'
              : 'bg-secondary-300 text-secondary-500 cursor-not-allowed'
          }`}
        >
          {product.metadata.in_stock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  )
}