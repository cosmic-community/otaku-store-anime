import type { Metadata } from 'next'
import type { Product, Category } from '@/types'

const SITE_NAME = 'Otaku Store'
const SITE_DESCRIPTION = 'Premium anime t-shirts, kawaii stickers, and exclusive limited edition merchandise. Express your otaku spirit with our curated collection.'
const SITE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://otaku-store-anime.cosmic.site' 
  : 'http://localhost:3000'

interface BaseMetadataOptions {
  title?: string
  description?: string
  ogType?: 'website' | 'home' | 'products' | 'product' | 'category'
}

export function getBaseMetadata(options?: BaseMetadataOptions): Metadata {
  const title = options?.title || SITE_NAME
  const description = options?.description || SITE_DESCRIPTION
  const ogType = options?.ogType || 'website'
  
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: [
      'anime merchandise',
      'otaku store', 
      'anime t-shirts',
      'kawaii stickers',
      'limited edition anime',
      'manga merch',
      'anime clothing',
      'japanese culture',
      'anime gifts',
      'cosplay accessories'
    ],
    authors: [{ name: 'Otaku Store' }],
    creator: 'Otaku Store',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: SITE_URL,
      title,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&type=${ogType}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&type=${ogType}`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'google-site-verification-code', // Replace with actual verification code
      yandex: 'yandex-verification-code', // Replace with actual verification code  
      yahoo: 'yahoo-verification-code', // Replace with actual verification code
    },
  }
}

export function getProductsMetadata(): Metadata {
  const title = 'Premium Anime Merchandise - Shop Otaku Store'
  const description = 'Browse our curated collection of high-quality anime t-shirts, kawaii stickers, and exclusive limited edition merchandise. Express your otaku spirit with premium gear.'

  return {
    title,
    description,
    keywords: [
      'anime merchandise',
      'otaku store', 
      'anime t-shirts',
      'kawaii stickers',
      'limited edition anime',
      'manga merch',
      'anime clothing',
      'japanese culture',
      'anime gifts',
      'cosplay accessories'
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${SITE_URL}/products`,
      images: [
        {
          url: `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&type=products`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&type=products`],
    },
  }
}

export function getProductMetadata(product: Product): Metadata {
  const title = `${product.metadata.name} - ${product.metadata.category.metadata.name}`
  const description = product.metadata.description.replace(/<[^>]*>/g, '').substring(0, 155) + '...'
  const imageUrl = product.metadata.featured_image?.imgix_url 
    ? `${product.metadata.featured_image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`
    : `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&type=product`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${SITE_URL}/products/${product.slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.metadata.name,
        },
      ],
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export function getCategoryMetadata(category: Category): Metadata {
  const title = `${category.metadata.name} - Shop Anime Merchandise`
  const description = category.metadata.description || `Browse our collection of ${category.metadata.name.toLowerCase()} anime merchandise and otaku gear.`
  const imageUrl = category.metadata.category_image?.imgix_url 
    ? `${category.metadata.category_image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`
    : `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&type=category`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${SITE_URL}/categories/${category.slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: category.metadata.name,
        },
      ],
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

// Structured Data for SEO
export function getProductStructuredData(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.metadata.name,
    description: product.metadata.description.replace(/<[^>]*>/g, ''),
    image: product.metadata.featured_image?.imgix_url 
      ? `${product.metadata.featured_image.imgix_url}?w=800&h=800&fit=crop&auto=format,compress`
      : undefined,
    sku: product.metadata.sku,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    category: product.metadata.category.metadata.name,
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: 'USD',
      price: product.metadata.price.toFixed(2),
      availability: product.metadata.in_stock 
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
  }
}

export function getBreadcrumbStructuredData(items: Array<{ name: string; url?: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${SITE_URL}${item.url}` : undefined,
    })),
  }
}

export function getOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: `${SITE_URL}/api/og?title=${encodeURIComponent(SITE_NAME)}&description=${encodeURIComponent('Premium Anime Merchandise')}&type=website`,
    sameAs: [
      // Add social media URLs here when available
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
  }
}