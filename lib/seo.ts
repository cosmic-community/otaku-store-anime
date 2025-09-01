import type { Metadata } from 'next'
import type { Product } from '@/types'

const SITE_NAME = 'Otaku Store'
const SITE_URL = 'https://otaku-store.vercel.app'
const SITE_DESCRIPTION = 'Premium anime-themed products including t-shirts, stickers, and collectibles for otaku culture enthusiasts.'

// Base metadata for the site
export const baseMetadata: Metadata = {
  title: {
    template: `%s | ${SITE_NAME}`,
    default: SITE_NAME,
  },
  description: SITE_DESCRIPTION,
  keywords: ['anime', 'manga', 'otaku', 't-shirts', 'stickers', 'collectibles', 'japanese culture'],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
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
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    creator: '@otakustore',
  },
  metadataBase: new URL(SITE_URL),
}

// Home page metadata
export function getHomeMetadata(): Metadata {
  return {
    title: 'Premium Anime Collection - Japanese Culture Products',
    description: 'Discover premium anime-themed products including exclusive t-shirts, collectible stickers, and authentic otaku merchandise. Shop the best Japanese culture collection.',
    openGraph: {
      title: 'Premium Anime Collection - Japanese Culture Products',
      description: 'Discover premium anime-themed products including exclusive t-shirts, collectible stickers, and authentic otaku merchandise.',
      url: SITE_URL,
      images: [
        {
          url: '/og-home.png',
          width: 1200,
          height: 630,
          alt: 'Otaku Store - Premium Anime Collection',
        },
      ],
    },
    twitter: {
      title: 'Premium Anime Collection - Japanese Culture Products',
      description: 'Discover premium anime-themed products including exclusive t-shirts, collectible stickers, and authentic otaku merchandise.',
      images: ['/og-home.png'],
    },
  }
}

// Products page metadata
export function getProductsMetadata(): Metadata {
  return {
    title: 'All Products - Anime T-Shirts, Stickers & Collectibles',
    description: 'Browse our complete collection of anime-themed products. High-quality t-shirts, waterproof stickers, and exclusive collectibles for every otaku.',
    openGraph: {
      title: 'All Products - Anime T-Shirts, Stickers & Collectibles',
      description: 'Browse our complete collection of anime-themed products. High-quality t-shirts, waterproof stickers, and exclusive collectibles.',
      url: `${SITE_URL}/products`,
      images: [
        {
          url: '/og-products.png',
          width: 1200,
          height: 630,
          alt: 'Otaku Store Products Collection',
        },
      ],
    },
    twitter: {
      title: 'All Products - Anime T-Shirts, Stickers & Collectibles',
      description: 'Browse our complete collection of anime-themed products. High-quality t-shirts, waterproof stickers, and exclusive collectibles.',
      images: ['/og-products.png'],
    },
  }
}

// Individual product metadata
export function getProductMetadata(product: Product): Metadata {
  const { metadata } = product
  const imageUrl = metadata.featured_image?.imgix_url 
    ? `${metadata.featured_image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`
    : '/og-product-default.png'

  const price = metadata.price ? `$${metadata.price.toFixed(2)}` : ''
  const availability = metadata.in_stock ? 'In Stock' : 'Out of Stock'
  const category = metadata.category?.metadata?.name || ''
  
  const title = `${metadata.name} - ${price} | ${SITE_NAME}`
  const description = `${metadata.name} ${price && `for ${price}`}. ${category ? `${category} category. ` : ''}${availability}. Premium anime merchandise with fast shipping.`

  return {
    title,
    description,
    openGraph: {
      title: metadata.name,
      description,
      url: `${SITE_URL}/products/${product.slug}`,
      type: 'article',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: metadata.name,
        },
      ],
    },
    twitter: {
      title: metadata.name,
      description,
      images: [imageUrl],
      card: 'summary_large_image',
    },
  }
}

// Category page metadata
export function getCategoryMetadata(categoryName: string, categorySlug: string): Metadata {
  const title = `${categoryName} - Anime Products | ${SITE_NAME}`
  const description = `Shop premium ${categoryName.toLowerCase()} in our anime collection. High-quality products with authentic designs for otaku culture enthusiasts.`

  return {
    title,
    description,
    openGraph: {
      title: `${categoryName} - Anime Products`,
      description,
      url: `${SITE_URL}/categories/${categorySlug}`,
      images: [
        {
          url: `/og-category-${categorySlug}.png`,
          width: 1200,
          height: 630,
          alt: `${categoryName} Category`,
        },
      ],
    },
    twitter: {
      title: `${categoryName} - Anime Products`,
      description,
      images: [`/og-category-${categorySlug}.png`],
    },
  }
}

// Structured data for products
export function getProductStructuredData(product: Product) {
  const { metadata } = product

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: metadata.name,
    description: metadata.description.replace(/<[^>]*>/g, ''), // Strip HTML tags
    image: metadata.featured_image?.imgix_url 
      ? `${metadata.featured_image.imgix_url}?w=800&h=800&fit=crop&auto=format,compress`
      : undefined,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    category: metadata.category?.metadata?.name,
    sku: metadata.sku,
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: 'USD',
      price: metadata.price?.toFixed(2),
      availability: metadata.in_stock 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
    aggregateRating: metadata.rating ? {
      '@type': 'AggregateRating',
      ratingValue: metadata.rating,
      reviewCount: metadata.review_count || 1,
    } : undefined,
  }
}

// Breadcrumb structured data interface
interface BreadcrumbItem {
  name: string
  url?: string
}

// Breadcrumb structured data
export function getBreadcrumbStructuredData(items: BreadcrumbItem[]) {
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
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    sameAs: [
      'https://twitter.com/otakustore',
      'https://instagram.com/otakustore',
      'https://facebook.com/otakustore',
    ],
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
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-OTAKU-01',
      contactType: 'customer service',
      availableLanguage: ['English', 'Japanese'],
    },
    sameAs: [
      'https://twitter.com/otakustore',
      'https://instagram.com/otakustore',
      'https://facebook.com/otakustore',
    ],
  }
}

// FAQ structured data
export function getFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}