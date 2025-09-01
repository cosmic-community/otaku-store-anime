// Cosmic object types for the anime store

// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Product type
export interface Product extends CosmicObject {
  type: 'products';
  metadata: {
    name: string;
    description: string;
    price: number;
    featured_image: {
      url: string;
      imgix_url: string;
    };
    gallery_images?: Array<{
      url: string;
      imgix_url: string;
    }>;
    category: Category;
    tags?: Tag[];
    in_stock: boolean;
    sku?: string;
  };
}

// Category type
export interface Category extends CosmicObject {
  type: 'categories';
  metadata: {
    name: string;
    description?: string;
    category_image?: {
      url: string;
      imgix_url: string;
    };
  };
}

// Tag type
export interface Tag extends CosmicObject {
  type: 'tags';
  metadata: {
    name: string;
    color?: string;
  };
}

// Newsletter subscriber type
export interface NewsletterSubscriber extends CosmicObject {
  type: 'newsletter_subscribers';
  metadata: {
    email: string;
    subscribed_at: string;
    status: 'active' | 'unsubscribed';
  };
}

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Type guards
export function isProduct(obj: CosmicObject): obj is Product {
  return obj.type === 'products';
}

export function isCategory(obj: CosmicObject): obj is Category {
  return obj.type === 'categories';
}

export function isTag(obj: CosmicObject): obj is Tag {
  return obj.type === 'tags';
}

// Component prop types
export interface ProductCardProps {
  product: Product;
  className?: string;
}

export interface CategoryCardProps {
  category: Category;
  className?: string;
}

export interface NewsletterFormData {
  email: string;
}