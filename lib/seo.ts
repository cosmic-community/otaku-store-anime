import type { Metadata } from 'next'

const SITE_NAME = 'Otaku Store'
const SITE_DESCRIPTION = 'Premium anime merchandise and collectibles for true otaku fans'
const SITE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'

// Base metadata for all pages
export function getBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: `%s | ${SITE_NAME}`,
      default: SITE_NAME,
    },
    description: SITE_DESCRIPTION,
    keywords: ['anime', 'merchandise', 'collectibles', 'manga', 'otaku', 'japanese culture'],
    authors: [{ name: 'Otaku Store' }],
    creator: 'Otaku Store',
    publisher: 'Otaku Store',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: SITE_URL,
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: [
        {
          url: `${SITE_URL}/api/og`,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: [`${SITE_URL}/api/og`],
      creator: '@otakustore',
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
      google: 'your-google-verification-code',
    },
  }
}

// Home page metadata
export function getHomeMetadata(): Metadata {
  return {
    ...getBaseMetadata(),
    title: 'Premium Anime Merchandise & Collectibles',
    description: 'Discover authentic anime merchandise, collectibles, and exclusive items for true otaku fans. Shop premium quality products from your favorite series.',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: SITE_URL,
      siteName: SITE_NAME,
      title: 'Premium Anime Merchandise & Collectibles',
      description: 'Discover authentic anime merchandise, collectibles, and exclusive items for true otaku fans.',
      images: [
        {
          url: `${SITE_URL}/api/og?title=Premium Anime Merchandise`,
          width: 1200,
          height: 630,
          alt: 'Otaku Store - Premium Anime Merchandise',
        },
      ],
    },
  }
}

// Products page metadata
export function getProductsMetadata(): Metadata {
  return {
    ...getBaseMetadata(),
    title: 'All Products',
    description: 'Browse our complete collection of anime merchandise, from exclusive t-shirts to collectible figures and accessories.',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `${SITE_URL}/products`,
      siteName: SITE_NAME,
      title: 'All Products - Otaku Store',
      description: 'Browse our complete collection of anime merchandise, from exclusive t-shirts to collectible figures and accessories.',
      images: [
        {
          url: `${SITE_URL}/api/og?title=All Products`,
          width: 1200,
          height: 630,
          alt: 'Otaku Store - All Products',
        },
      ],
    },
  }
}

// Product detail page metadata
export function getProductMetadata(product: {
  metadata?: {
    name?: string
    description?: string
    price?: number
    featured_image?: {
      imgix_url?: string
    }
  }
  title?: string
  slug?: string
}): Metadata {
  const productName = product.metadata?.name || product.title || 'Product'
  const productDescription = product.metadata?.description || 'Premium anime merchandise'
  const productPrice = product.metadata?.price ? `$${product.metadata.price.toFixed(2)}` : ''
  const productImage = product.metadata?.featured_image?.imgix_url

  return {
    ...getBaseMetadata(),
    title: productName,
    description: `${productDescription} ${productPrice ? `Starting at ${productPrice}` : ''}`.trim(),
    openGraph: {
      type: 'website', // Changed from 'product' to 'website' to fix TypeScript error
      locale: 'en_US',
      url: `${SITE_URL}/products/${product.slug}`,
      siteName: SITE_NAME,
      title: `${productName} - Otaku Store`,
      description: productDescription,
      images: productImage ? [
        {
          url: `${productImage}?w=1200&h=630&fit=crop&auto=format,compress`,
          width: 1200,
          height: 630,
          alt: productName,
        },
      ] : [
        {
          url: `${SITE_URL}/api/og?title=${encodeURIComponent(productName)}`,
          width: 1200,
          height: 630,
          alt: productName,
        },
      ],
    },
  }
}

// Category page metadata
export function getCategoryMetadata(category: {
  metadata?: {
    name?: string
    description?: string
  }
  title?: string
  slug?: string
}): Metadata {
  const categoryName = category.metadata?.name || category.title || 'Category'
  const categoryDescription = category.metadata?.description || `Browse ${categoryName} products`

  return {
    ...getBaseMetadata(),
    title: categoryName,
    description: categoryDescription,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `${SITE_URL}/categories/${category.slug}`,
      siteName: SITE_NAME,
      title: `${categoryName} - Otaku Store`,
      description: categoryDescription,
      images: [
        {
          url: `${SITE_URL}/api/og?title=${encodeURIComponent(categoryName)}`,
          width: 1200,
          height: 630,
          alt: `${categoryName} - Otaku Store`,
        },
      ],
    },
  }
}

// Structured data helpers
export function getOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      'https://twitter.com/otakustore',
      'https://instagram.com/otakustore',
      'https://facebook.com/otakustore',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-0123',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
  }
}

export function getWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function getProductStructuredData(product: {
  metadata?: {
    name?: string
    description?: string
    price?: number
    featured_image?: {
      imgix_url?: string
    }
    sku?: string
    in_stock?: boolean
  }
  title?: string
  slug?: string
}) {
  const productName = product.metadata?.name || product.title || 'Product'
  const productDescription = product.metadata?.description || 'Premium anime merchandise'
  const productPrice = product.metadata?.price || 0
  const productImage = product.metadata?.featured_image?.imgix_url
  const productSku = product.metadata?.sku || product.slug
  const inStock = product.metadata?.in_stock ?? true

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: productDescription,
    sku: productSku,
    image: productImage ? [`${productImage}?w=800&h=800&fit=crop&auto=format,compress`] : [],
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: 'USD',
      price: productPrice.toFixed(2),
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
  }
}