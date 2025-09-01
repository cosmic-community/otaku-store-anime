import type { Metadata } from 'next'

// Site configuration
const SITE_CONFIG = {
  name: 'Otaku Anime Store',
  description: 'Premium anime merchandise and collectibles for true otaku enthusiasts. Discover exclusive t-shirts, stickers, and more.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://otaku-anime-store.vercel.app',
  ogImage: '/og-image.jpg',
  creator: '@otakuanimestore',
  keywords: [
    'anime merchandise',
    'anime t-shirts',
    'anime stickers',
    'otaku store',
    'japanese culture',
    'manga merchandise',
    'anime collectibles',
    'kawaii products'
  ]
}

// Base metadata that can be extended
export function getBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: SITE_CONFIG.name,
      template: `%s | ${SITE_CONFIG.name}`
    },
    description: SITE_CONFIG.description,
    keywords: SITE_CONFIG.keywords,
    authors: [
      {
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url
      }
    ],
    creator: SITE_CONFIG.creator,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      title: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      images: [
        {
          url: SITE_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: SITE_CONFIG.name,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      creator: SITE_CONFIG.creator,
      images: [SITE_CONFIG.ogImage]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  }
}

// Home page metadata
export function getHomeMetadata(): Metadata {
  return {
    ...getBaseMetadata(),
    title: `${SITE_CONFIG.name} - Premium Anime Merchandise`,
    openGraph: {
      type: 'website',
      url: SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      title: `${SITE_CONFIG.name} - Premium Anime Merchandise`,
      description: SITE_CONFIG.description,
      images: [
        {
          url: SITE_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: SITE_CONFIG.name,
        }
      ]
    }
  }
}

// Products page metadata
export function getProductsMetadata(): Metadata {
  return {
    ...getBaseMetadata(),
    title: 'Products',
    description: 'Browse our complete collection of premium anime merchandise, including t-shirts, stickers, and exclusive collectibles.',
    openGraph: {
      type: 'website',
      url: `${SITE_CONFIG.url}/products`,
      siteName: SITE_CONFIG.name,
      title: `Products | ${SITE_CONFIG.name}`,
      description: 'Browse our complete collection of premium anime merchandise, including t-shirts, stickers, and exclusive collectibles.',
      images: [
        {
          url: SITE_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: 'Otaku Anime Store Products',
        }
      ]
    }
  }
}

// Product page metadata
export function getProductMetadata(product: {
  title: string
  metadata?: {
    name?: string
    description?: string
    price?: number
    featured_image?: {
      imgix_url: string
    }
  }
  slug: string
}): Metadata {
  const productName = product.metadata?.name || product.title
  const description = product.metadata?.description || `Check out ${productName} - premium anime merchandise from Otaku Anime Store.`
  const price = product.metadata?.price
  const imageUrl = product.metadata?.featured_image?.imgix_url 
    ? `${product.metadata.featured_image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`
    : SITE_CONFIG.ogImage

  return {
    ...getBaseMetadata(),
    title: productName,
    description: description,
    openGraph: {
      type: 'website', // Changed from 'product' to 'website'
      url: `${SITE_CONFIG.url}/products/${product.slug}`,
      siteName: SITE_CONFIG.name,
      title: `${productName} | ${SITE_CONFIG.name}`,
      description: description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: productName,
        }
      ]
    },
    ...(price && {
      other: {
        'product:price:amount': price.toString(),
        'product:price:currency': 'USD'
      }
    })
  }
}

// Category page metadata
export function getCategoryMetadata(category: {
  title: string
  metadata?: {
    name?: string
    description?: string
    category_image?: {
      imgix_url: string
    }
  }
  slug: string
}): Metadata {
  const categoryName = category.metadata?.name || category.title
  const description = category.metadata?.description || `Shop ${categoryName} - premium anime merchandise from Otaku Anime Store.`
  const imageUrl = category.metadata?.category_image?.imgix_url
    ? `${category.metadata.category_image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`
    : SITE_CONFIG.ogImage

  return {
    ...getBaseMetadata(),
    title: categoryName,
    description: description,
    openGraph: {
      type: 'website',
      url: `${SITE_CONFIG.url}/categories/${category.slug}`,
      siteName: SITE_CONFIG.name,
      title: `${categoryName} | ${SITE_CONFIG.name}`,
      description: description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: categoryName,
        }
      ]
    }
  }
}

// Structured data helpers
export function getOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    sameAs: [
      // Add social media URLs here when available
    ]
  }
}

export function getWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/products?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }
}

export function getProductStructuredData(product: {
  title: string
  metadata?: {
    name?: string
    description?: string
    price?: number
    featured_image?: {
      imgix_url: string
    }
    sku?: string
    in_stock?: boolean
  }
  slug: string
}) {
  const productName = product.metadata?.name || product.title
  const description = product.metadata?.description || `${productName} - premium anime merchandise`
  const price = product.metadata?.price || 0
  const imageUrl = product.metadata?.featured_image?.imgix_url || SITE_CONFIG.ogImage
  const sku = product.metadata?.sku || product.slug
  const inStock = product.metadata?.in_stock !== false

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: description,
    image: imageUrl,
    sku: sku,
    brand: {
      '@type': 'Brand',
      name: SITE_CONFIG.name
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_CONFIG.url}/products/${product.slug}`,
      priceCurrency: 'USD',
      price: price.toString(),
      availability: inStock 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SITE_CONFIG.name
      }
    }
  }
}