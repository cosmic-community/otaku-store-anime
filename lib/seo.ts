import type { Metadata } from 'next'
import type { Product, Category } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://otaku-store.vercel.app'
const SITE_NAME = 'Otaku Store'
const DEFAULT_DESCRIPTION = 'Discover premium anime-themed t-shirts, kawaii stickers, and limited edition merchandise. Express your otaku spirit with our curated collection.'

// Generate OpenGraph image URL with dynamic content
export function generateOGImage({
  title,
  description,
  type = 'website',
  image,
}: {
  title: string
  description?: string
  type?: string
  image?: string
}): string {
  const params = new URLSearchParams({
    title: title.slice(0, 60), // Limit title length
    description: description?.slice(0, 120) || DEFAULT_DESCRIPTION.slice(0, 120),
    type,
  })

  if (image) {
    // Use product image if available
    return `${image}?w=1200&h=630&fit=crop&auto=format,compress`
  }

  // Generate dynamic OpenGraph image
  return `${BASE_URL}/api/og?${params.toString()}`
}

// Base metadata for the site
export function getBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: `${SITE_NAME} - Premium Anime T-Shirts & Stickers`,
      template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    keywords: [
      'anime',
      'manga',
      't-shirts',
      'stickers',
      'otaku',
      'japanese',
      'kawaii',
      'merchandise',
      'clothing',
      'accessories',
      'anime store',
      'anime merchandise',
    ],
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
      url: BASE_URL,
      siteName: SITE_NAME,
      title: `${SITE_NAME} - Premium Anime T-Shirts & Stickers`,
      description: DEFAULT_DESCRIPTION,
      images: [
        {
          url: generateOGImage({
            title: SITE_NAME,
            description: DEFAULT_DESCRIPTION,
            type: 'website',
          }),
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} - Premium anime merchandise`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@otakustore',
      creator: '@otakustore',
      title: `${SITE_NAME} - Premium Anime T-Shirts & Stickers`,
      description: DEFAULT_DESCRIPTION,
      images: [
        generateOGImage({
          title: SITE_NAME,
          description: DEFAULT_DESCRIPTION,
        }),
      ],
    },
    alternates: {
      canonical: BASE_URL,
    },
  }
}

// Generate metadata for product pages
export function getProductMetadata(product: Product): Metadata {
  const title = product.metadata.name
  const description = stripHtml(product.metadata.description).slice(0, 160)
  const image = product.metadata.featured_image?.imgix_url
  const url = `${BASE_URL}/products/${product.slug}`
  
  const ogImage = generateOGImage({
    title,
    description,
    type: 'product',
    image,
  })

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: [
        {
          url: ogImage,
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
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
    other: {
      'product:price:amount': product.metadata.price.toString(),
      'product:price:currency': 'USD',
      'product:availability': product.metadata.in_stock ? 'in stock' : 'out of stock',
      'product:condition': 'new',
    },
  }
}

// Generate metadata for category pages
export function getCategoryMetadata(category: Category): Metadata {
  const title = `${category.metadata.name} - Anime Merchandise`
  const description = category.metadata.description || `Browse our ${category.metadata.name.toLowerCase()} collection featuring premium anime-themed items.`
  const image = category.metadata.category_image?.imgix_url
  const url = `${BASE_URL}/categories/${category.slug}`
  
  const ogImage = generateOGImage({
    title,
    description,
    type: 'category',
    image,
  })

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: [
        {
          url: ogImage,
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
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  }
}

// Generate metadata for products listing page
export function getProductsMetadata(): Metadata {
  const title = 'All Products - Anime Merchandise Collection'
  const description = 'Browse our complete collection of premium anime t-shirts, kawaii stickers, and limited edition merchandise. Find your perfect otaku gear.'
  const url = `${BASE_URL}/products`
  
  const ogImage = generateOGImage({
    title,
    description,
    type: 'collection',
  })

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: [
        {
          url: ogImage,
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
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  }
}

// Generate structured data for products
export function getProductStructuredData(product: Product) {
  const baseUrl = BASE_URL

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.metadata.name,
    description: stripHtml(product.metadata.description),
    image: product.metadata.featured_image?.imgix_url ? 
      `${product.metadata.featured_image.imgix_url}?w=800&h=600&auto=format,compress` : 
      undefined,
    url: `${baseUrl}/products/${product.slug}`,
    sku: product.metadata.sku || product.id,
    category: product.metadata.category?.metadata?.name,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      price: product.metadata.price.toString(),
      priceCurrency: 'USD',
      availability: product.metadata.in_stock 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      url: `${baseUrl}/products/${product.slug}`,
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
  }
}

// Generate structured data for the organization
export function getOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: BASE_URL,
    description: DEFAULT_DESCRIPTION,
    sameAs: [
      // Add social media URLs when available
    ],
  }
}

// Utility function to strip HTML tags
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

// Generate breadcrumb structured data
export function getBreadcrumbStructuredData(items: Array<{ name: string; url?: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${BASE_URL}${item.url}` : undefined,
    })),
  }
}