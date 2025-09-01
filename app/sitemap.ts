import { MetadataRoute } from 'next'
import { getProducts, getCategories } from '@/lib/cosmic'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://otaku-store.vercel.app'

// Helper function to safely create a Date object
function createSafeDate(dateString?: string): Date {
  if (!dateString) {
    return new Date()
  }
  
  const date = new Date(dateString)
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return new Date()
  }
  
  return date
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [products, categories] = await Promise.all([
      getProducts(),
      getCategories(),
    ])

    const productUrls = products.map((product) => ({
      url: `${BASE_URL}/products/${product.slug}`,
      lastModified: createSafeDate(product.modified_at || product.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    const categoryUrls = categories.map((category) => ({
      url: `${BASE_URL}/categories/${category.slug}`,
      lastModified: createSafeDate(category.modified_at || category.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${BASE_URL}/products`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      ...productUrls,
      ...categoryUrls,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ]
  }
}