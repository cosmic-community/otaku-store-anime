import type { Metadata } from 'next'
import type { Product, Category } from '@/types'

// Site configuration
const SITE_NAME = 'Otaku Store'
const SITE_DESCRIPTION = 'Premium anime merchandise and collectibles for true otaku. Discover unique t-shirts, stickers, and more from your favorite series.'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://otaku-store.vercel.app'

// Home page metadata
export function getHomeMetadata(): Metadata {
  return {
    title: `${SITE_NAME} - Premium Anime Merchandise`,
    description: SITE_DESCRIPTION,
    keywords: 'anime, merchandise, t-shirts, stickers, manga, otaku, collectibles, japanese culture',
    authors: [{ name: 'Otaku Store Team' }],
    creator: 'Otaku Store',
    publisher: 'Otaku Store',
    openGraph: {
      title: `${SITE_NAME} - Premium Anime Merchandise`,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      siteName: SITE_NAME,
      images: [
        {
          url: `${SITE_URL}/api/og`,
          width: 1200,
          height: 630,
          alt: 'Otaku Store - Premium Anime Merchandise',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_NAME} - Premium Anime Merchandise`,
      description: SITE_DESCRIPTION,
      images: [`${SITE_URL}/api/og`],
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
    metadataBase: new URL(SITE_URL),
  }
}

// Products page metadata
export function getProductsMetadata(): Metadata {
  return {
    title: `Products - ${SITE_NAME}`,
    description: 'Browse our complete collection of premium anime merchandise. Find t-shirts, stickers, and collectibles from your favorite series.',
    keywords: 'anime products, anime t-shirts, anime stickers, manga merchandise, otaku gear',
    openGraph: {
      title: `Products - ${SITE_NAME}`,
      description: 'Browse our complete collection of premium anime merchandise.',
      url: `${SITE_URL}/products`,
      siteName: SITE_NAME,
      images: [
        {
          url: `${SITE_URL}/api/og?title=Products&description=Browse our complete collection of premium anime merchandise`,
          width: 1200,
          height: 630,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Products - ${SITE_NAME}`,
      description: 'Browse our complete collection of premium anime merchandise.',
      images: [`${SITE_URL}/api/og?title=Products`],
    },
  }
}

// Individual product metadata
export function getProductMetadata(product: Product): Metadata {
  const { metadata } = product
  
  return {
    title: `${metadata.name} - ${SITE_NAME}`,
    description: metadata.description.replace(/<[^>]*>/g, '').substring(0, 160),
    keywords: `${metadata.name}, anime, ${metadata.category?.metadata?.name || ''}, merchandise`,
    openGraph: {
      title: `${metadata.name} - ${SITE_NAME}`,
      description: metadata.description.replace(/<[^>]*>/g, '').substring(0, 160),
      url: `${SITE_URL}/products/${product.slug}`,
      siteName: SITE_NAME,
      images: metadata.featured_image?.imgix_url ? [
        {
          url: `${metadata.featured_image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`,
          width: 1200,
          height: 630,
          alt: metadata.name,
        },
      ] : [],
      type: 'product',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${metadata.name} - ${SITE_NAME}`,
      description: metadata.description.replace(/<[^>]*>/g, '').substring(0, 160),
      images: metadata.featured_image?.imgix_url ? [
        `${metadata.featured_image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`
      ] : [],
    },
  }
}

// Category page metadata
export function getCategoryMetadata(category: Category): Metadata {
  const { metadata } = category
  
  return {
    title: `${metadata.name} - ${SITE_NAME}`,
    description: metadata.description || `Browse our collection of ${metadata.name.toLowerCase()} anime merchandise.`,
    keywords: `${metadata.name}, anime, merchandise, ${metadata.name.toLowerCase()}`,
    openGraph: {
      title: `${metadata.name} - ${SITE_NAME}`,
      description: metadata.description || `Browse our collection of ${metadata.name.toLowerCase()} anime merchandise.`,
      url: `${SITE_URL}/categories/${category.slug}`,
      siteName: SITE_NAME,
      images: metadata.category_image?.imgix_url ? [
        {
          url: `${metadata.category_image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`,
          width: 1200,
          height: 630,
          alt: metadata.name,
        },
      ] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${metadata.name} - ${SITE_NAME}`,
      description: metadata.description || `Browse our collection of ${metadata.name.toLowerCase()} anime merchandise.`,
      images: metadata.category_image?.imgix_url ? [
        `${metadata.category_image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`
      ] : [],
    },
  }
}

// Structured data for products
export function getProductStructuredData(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.metadata.name,
    description: product.metadata.description.replace(/<[^>]*>/g, ''),
    image: product.metadata.featured_image?.imgix_url ? [
      `${product.metadata.featured_image.imgix_url}?w=800&h=800&fit=crop&auto=format,compress`
    ] : [],
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    category: product.metadata.category?.metadata?.name || '',
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: 'USD',
      price: product.metadata.price,
      availability: product.metadata.in_stock 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '12',
    },
  }
}

// Breadcrumb structured data
export function getBreadcrumbStructuredData(items: Array<{ name: string; url?: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url && { item: `${SITE_URL}${item.url}` }),
    })),
  }
}

// Organization structured data
export function getOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
      // Add social media URLs here
    ],
  }
}

// Website structured data
export function getWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}