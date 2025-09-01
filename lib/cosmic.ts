import { createBucketClient } from '@cosmicjs/sdk'
import type { Product, Category, Tag } from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Get all products with category and tags
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'products' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    // Sort by created date (newest first)
    return (response.objects as Product[]).sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA
    })
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch products')
  }
}

// Get single product by slug
export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await cosmic.objects
      .findOne({
        type: 'products',
        slug
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    const product = response.object as Product
    
    if (!product || !product.metadata) {
      return null
    }
    
    return product
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw error
  }
}

// Get products by category
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  try {
    // First, get the category by slug to get its ID
    const category = await getCategory(categorySlug)
    if (!category) {
      return []
    }
    
    // Then query products by the category ID
    const response = await cosmic.objects
      .find({ 
        type: 'products',
        'metadata.category': category.id
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1)
    
    return response.objects as Product[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch products by category')
  }
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'categories' })
      .props(['id', 'title', 'slug', 'metadata'])
    
    return response.objects as Category[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch categories')
  }
}

// Get single category by slug
export async function getCategory(slug: string): Promise<Category | null> {
  try {
    const response = await cosmic.objects
      .findOne({
        type: 'categories',
        slug
      })
      .props(['id', 'title', 'slug', 'metadata'])
    
    return response.object as Category
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null
    }
    throw error
  }
}

// Get all tags
export async function getTags(): Promise<Tag[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'tags' })
      .props(['id', 'title', 'slug', 'metadata'])
    
    return response.objects as Tag[]
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return []
    }
    throw new Error('Failed to fetch tags')
  }
}

// Note: Newsletter subscription is now handled via API route
// to ensure all Cosmic CMS operations remain server-side