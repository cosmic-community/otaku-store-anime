import type { Metadata } from 'next'
import type { Product, Category } from '@/types'

// Base metadata configuration
export const baseMetadata: Metadata = {
  title: {
    default: 'Otaku Store - Premium Anime Merchandise & Collectibles',
    template: '%s | Otaku Store'
  },
  description: 'Discover premium anime merchandise, collectibles, and unique otaku gear. From exclusive t-shirts to rare figurines, find your perfect anime treasures at Otaku Store.',
  keywords: [
    'anime merchandise',
    'otaku store',
    'anime t-shirts',
    'anime collectibles',
    'manga accessories',
    'japanese culture',
    'anime figures',
    'cosplay items',
    'anime stickers',
    'kawaii products'
  ],
  authors: [{ name: 'Otaku Store' }],
  creator: 'Otaku Store',
  publisher: 'Otaku Store',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://otaku-store.cosmicjs.app',
    siteName: 'Otaku Store',
    title: 'Otaku Store - Premium Anime Merchandise & Collectibles',
    description: 'Discover premium anime merchandise, collectibles, and unique otaku gear. From exclusive t-shirts to rare figurines, find your perfect anime treasures.',
    images: [
      {
        url: 'https://otaku-store.cosmicjs.app/api/og',
        width: 1200,
        height: 630,
        alt: 'Otaku Store - Premium Anime Merchandise',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Otaku Store - Premium Anime Merchandise & Collectibles',
    description: 'Discover premium anime merchandise, collectibles, and unique otaku gear. From exclusive t-shirts to rare figurines, find your perfect anime treasures.',
    images: ['https://otaku-store.cosmicjs.app/api/og'],
    creator: '@otakustore',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://otaku-store.cosmicjs.app',
  },
}

// Helper function to strip HTML tags
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

// Helper function to truncate text
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

// Home page metadata
export function getHomeMetadata(): Metadata {
  return {
    title: 'Premium Anime Merchandise & Collectibles - Otaku Store',
    description: 'Discover the ultimate collection of premium anime merchandise, collectibles, and unique otaku gear. From exclusive t-shirts to rare figurines, find your perfect anime treasures at Otaku Store.',
    openGraph: {
      title: 'Premium Anime Merchandise & Collectibles - Otaku Store',
      description: 'Discover the ultimate collection of premium anime merchandise, collectibles, and unique otaku gear. From exclusive t-shirts to rare figurines, find your perfect anime treasures.',
      url: 'https://otaku-store.cosmicjs.app',
      images: [
        {
          url: 'https://otaku-store.cosmicjs.app/api/og',
          width: 1200,
          height: 630,
          alt: 'Otaku Store - Premium Anime Merchandise',
        },
      ],
    },
    twitter: {
      title: 'Premium Anime Merchandise & Collectibles - Otaku Store',
      description: 'Discover the ultimate collection of premium anime merchandise, collectibles, and unique otaku gear.',
      images: ['https://otaku-store.cosmicjs.app/api/og'],
    },
    alternates: {
      canonical: 'https://otaku-store.cosmicjs.app',
    },
  }
}

// Products page metadata
export function getProductsMetadata(): Metadata {
  return {
    title: 'All Products - Premium Anime Merchandise Collection',
    description: 'Browse our complete collection of premium anime merchandise, including t-shirts, stickers, collectibles, and more. Discover unique otaku gear and show your anime passion.',
    openGraph: {
      title: 'All Products - Premium Anime Merchandise Collection',
      description: 'Browse our complete collection of premium anime merchandise, including t-shirts, stickers, collectibles, and more.',
      url: 'https://otaku-store.cosmicjs.app/products',
      images: [
        {
          url: 'https://otaku-store.cosmicjs.app/api/og?title=All Products&description=Premium Anime Merchandise Collection',
          width: 1200,
          height: 630,
          alt: 'Otaku Store - All Products',
        },
      ],
    },
    twitter: {
      title: 'All Products - Premium Anime Merchandise Collection',
      description: 'Browse our complete collection of premium anime merchandise, including t-shirts, stickers, collectibles, and more.',
      images: ['https://otaku-store.cosmicjs.app/api/og?title=All Products&description=Premium Anime Merchandise Collection'],
    },
    alternates: {
      canonical: 'https://otaku-store.cosmicjs.app/products',
    },
  }
}

// Individual product metadata
export function getProductMetadata(product: Product): Metadata {
  const cleanDescription = stripHtmlTags(product.metadata.description)
  const shortDescription = truncateText(cleanDescription, 160)
  
  // Get product tags for keywords
  const productTags = product.metadata.tags?.map(tag => tag.metadata?.name || tag.title) || []
  const categoryKeywords = [product.metadata.category.metadata.name.toLowerCase()]
  const allKeywords = [...categoryKeywords, ...productTags, 'anime', 'merchandise', 'otaku']

  return {
    title: `${product.metadata.name} - Premium Anime Merchandise`,
    description: shortDescription,
    keywords: allKeywords,
    openGraph: {
      title: `${product.metadata.name} - Premium Anime Merchandise`,
      description: shortDescription,
      url: `https://otaku-store.cosmicjs.app/products/${product.slug}`,
      type: 'article',
      images: product.metadata.featured_image?.imgix_url ? [
        {
          url: `${product.metadata.featured_image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`,
          width: 1200,
          height: 630,
          alt: product.metadata.name,
        },
      ] : [
        {
          url: `https://otaku-store.cosmicjs.app/api/og?title=${encodeURIComponent(product.metadata.name)}&price=${product.metadata.price}`,
          width: 1200,
          height: 630,
          alt: product.metadata.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.metadata.name} - Premium Anime Merchandise`,
      description: shortDescription,
      images: product.metadata.featured_image?.imgix_url ? [
        `${product.metadata.featured_image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`
      ] : [
        `https://otaku-store.cosmicjs.app/api/og?title=${encodeURIComponent(product.metadata.name)}&price=${product.metadata.price}`
      ],
    },
    alternates: {
      canonical: `https://otaku-store.cosmicjs.app/products/${product.slug}`,
    },
  }
}

// Category page metadata
export function getCategoryMetadata(category: Category): Metadata {
  const description = category.metadata.description || `Explore our ${category.metadata.name} collection featuring premium anime merchandise and collectibles.`
  
  return {
    title: `${category.metadata.name} - Premium Anime Merchandise Collection`,
    description,
    keywords: [category.metadata.name.toLowerCase(), 'anime', 'merchandise', 'collectibles', 'otaku'],
    openGraph: {
      title: `${category.metadata.name} - Premium Anime Merchandise Collection`,
      description,
      url: `https://otaku-store.cosmicjs.app/categories/${category.slug}`,
      images: category.metadata.category_image?.imgix_url ? [
        {
          url: `${category.metadata.category_image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`,
          width: 1200,
          height: 630,
          alt: `${category.metadata.name} Collection`,
        },
      ] : [
        {
          url: `https://otaku-store.cosmicjs.app/api/og?title=${encodeURIComponent(category.metadata.name)}&description=Premium Collection`,
          width: 1200,
          height: 630,
          alt: `${category.metadata.name} Collection`,
        },
      ],
    },
    twitter: {
      title: `${category.metadata.name} - Premium Anime Merchandise Collection`,
      description,
      images: category.metadata.category_image?.imgix_url ? [
        `${category.metadata.category_image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`
      ] : [
        `https://otaku-store.cosmicjs.app/api/og?title=${encodeURIComponent(category.metadata.name)}&description=Premium Collection`
      ],
    },
    alternates: {
      canonical: `https://otaku-store.cosmicjs.app/categories/${category.slug}`,
    },
  }
}

// Structured data generators
export function getProductStructuredData(product: Product) {
  const cleanDescription = stripHtmlTags(product.metadata.description)
  
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.metadata.name,
    description: cleanDescription,
    image: product.metadata.featured_image?.imgix_url ? `${product.metadata.featured_image.imgix_url}?w=800&h=800&fit=crop&auto=format,compress` : undefined,
    brand: {
      '@type': 'Brand',
      name: 'Otaku Store'
    },
    category: product.metadata.category.metadata.name,
    sku: product.metadata.sku || product.id,
    offers: {
      '@type': 'Offer',
      price: product.metadata.price,
      priceCurrency: 'USD',
      availability: product.metadata.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Otaku Store'
      }
    },
    // Note: Removed aggregateRating since the product metadata doesn't contain rating or review_count
  }
}

export function getBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url?: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      ...(crumb.url && { item: `https://otaku-store.cosmicjs.app${crumb.url}` })
    }))
  }
}

export function getOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Otaku Store',
    description: 'Premium anime merchandise and collectibles store',
    url: 'https://otaku-store.cosmicjs.app',
    logo: 'https://otaku-store.cosmicjs.app/logo.png',
    sameAs: [
      'https://twitter.com/otakustore',
      'https://facebook.com/otakustore',
      'https://instagram.com/otakustore'
    ]
  }
}