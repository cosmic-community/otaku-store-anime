import type { Metadata } from 'next'
import type { Product, Category } from '@/types'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://otaku-anime-store.vercel.app'
const siteName = 'Otaku Anime Store'
const siteDescription = 'Premium anime-themed merchandise including t-shirts, stickers, and collectibles for true otaku fans.'

// Base metadata configuration
export const defaultMetadata: Metadata = {
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    'anime',
    'manga',
    'otaku',
    't-shirts',
    'stickers',
    'collectibles',
    'anime merchandise',
    'anime store',
    'japan',
    'kawaii'
  ],
  authors: [{ name: 'Otaku Anime Store' }],
  creator: 'Otaku Anime Store',
  publisher: 'Otaku Anime Store',
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
    url: baseUrl,
    siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: `${baseUrl}/api/og`,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: siteDescription,
    images: [`${baseUrl}/api/og`],
    creator: '@otakuanimestore',
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
  },
  alternates: {
    canonical: baseUrl,
  },
}

// Home page metadata
export function getHomeMetadata(): Metadata {
  return {
    title: 'Premium Anime Merchandise & Collectibles',
    description: siteDescription,
    openGraph: {
      title: `${siteName} - Premium Anime Merchandise & Collectibles`,
      description: siteDescription,
      url: baseUrl,
      images: [
        {
          url: `https://imgix.cosmicjs.com/b08b9bd0-86d9-11f0-8af5-6d65ce6e8553-generated-image.png`,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      title: `${siteName} - Premium Anime Merchandise & Collectibles`,
      description: siteDescription,
      images: [`${baseUrl}/api/og?title=${encodeURIComponent('Premium Anime Merchandise')}`],
    },
  }
}

// Products page metadata
export function getProductsMetadata(): Metadata {
  return {
    title: 'All Products',
    description: 'Browse our complete collection of premium anime-themed products including t-shirts, stickers, and collectibles.',
    openGraph: {
      title: `All Products | ${siteName}`,
      description: 'Browse our complete collection of premium anime-themed products including t-shirts, stickers, and collectibles.',
      url: `${baseUrl}/products`,
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent('All Products')}`,
          width: 1200,
          height: 630,
          alt: 'All Products',
        },
      ],
    },
    twitter: {
      title: `All Products | ${siteName}`,
      description: 'Browse our complete collection of premium anime-themed products including t-shirts, stickers, and collectibles.',
      images: [`${baseUrl}/api/og?title=${encodeURIComponent('All Products')}`],
    },
  }
}

// Product detail page metadata
export function getProductMetadata(product: Product): Metadata {
  const title = product.metadata.name
  const description = product.metadata.description
    ? product.metadata.description.replace(/<[^>]*>/g, '').substring(0, 160)
    : `${product.metadata.name} - Premium anime merchandise available at ${siteName}`
  
  const imageUrl = product.metadata.featured_image?.imgix_url
    ? `${product.metadata.featured_image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`
    : `${baseUrl}/api/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url: `${baseUrl}/products/${product.slug}`,
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      title: `${title} | ${siteName}`,
      description,
      images: [imageUrl],
    },
  }
}

// Category page metadata
export function getCategoryMetadata(category: Category): Metadata {
  const title = `${category.metadata.name} Collection`
  const description = category.metadata.description || `Browse our ${category.metadata.name.toLowerCase()} collection of premium anime merchandise.`
  
  const imageUrl = category.metadata.category_image?.imgix_url
    ? `${category.metadata.category_image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`
    : `${baseUrl}/api/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      url: `${baseUrl}/categories/${category.slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      title: `${title} | ${siteName}`,
      description,
      images: [imageUrl],
    },
  }
}

// Website structured data for homepage
export function getWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    description: siteDescription,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/products?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    sameAs: [
      'https://twitter.com/otakuanimestore',
      'https://instagram.com/otakuanimestore',
      'https://facebook.com/otakuanimestore'
    ]
  }
}

// Organization structured data
export function getOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    description: siteDescription,
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      'https://twitter.com/otakuanimestore',
      'https://instagram.com/otakuanimestore',
      'https://facebook.com/otakuanimestore'
    ]
  }
}

// Product structured data
export function getProductStructuredData(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.metadata.name,
    description: product.metadata.description?.replace(/<[^>]*>/g, '') || '',
    image: product.metadata.featured_image?.imgix_url ? 
      `${product.metadata.featured_image.imgix_url}?w=800&h=800&fit=crop&auto=format,compress` : '',
    sku: product.metadata.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: siteName
    },
    category: product.metadata.category?.metadata?.name || 'Anime Merchandise',
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/products/${product.slug}`,
      priceCurrency: 'USD',
      price: product.metadata.price.toString(),
      availability: product.metadata.in_stock ? 
        'https://schema.org/InStock' : 
        'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: siteName
      }
    }
  }
}

// Breadcrumb structured data
interface BreadcrumbItem {
  name: string
  url?: string
}

export function getBreadcrumbStructuredData(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${baseUrl}${item.url}` : undefined
    }))
  }
}

// FAQ structured data (if needed for product pages)
export function getFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}