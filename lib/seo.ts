import type { Metadata } from 'next'
import type { Product } from '@/types'

const siteName = 'Otaku Store'
const siteDescription = 'Premium anime merchandise including t-shirts, stickers, and collectibles for true otaku fans.'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://otaku-store.com'

// Base metadata for the site
export function getBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteName,
      template: `%s | ${siteName}`
    },
    description: siteDescription,
    keywords: ['anime', 'manga', 'otaku', 'merchandise', 't-shirts', 'stickers', 'collectibles'],
    authors: [{ name: 'Otaku Store' }],
    creator: 'Otaku Store',
    publisher: 'Otaku Store',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      title: siteName,
      description: siteDescription,
      siteName,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: siteName
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: siteDescription,
      images: ['/og-image.png']
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
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION
    }
  }
}

// Home page specific metadata
export function getHomeMetadata(): Metadata {
  return {
    title: 'Premium Anime Merchandise for True Otaku',
    description: 'Discover our curated collection of high-quality anime t-shirts, stickers, and collectibles. Express your otaku passion with premium merchandise.',
    openGraph: {
      title: 'Premium Anime Merchandise for True Otaku',
      description: 'Discover our curated collection of high-quality anime t-shirts, stickers, and collectibles.',
      url: siteUrl,
      images: [
        {
          url: '/og-home.png',
          width: 1200,
          height: 630,
          alt: 'Otaku Store - Premium Anime Merchandise'
        }
      ]
    }
  }
}

// Products page metadata
export function getProductsMetadata(): Metadata {
  return {
    title: 'All Products',
    description: 'Browse our complete collection of anime merchandise including t-shirts, stickers, and collectibles.',
    openGraph: {
      title: 'All Products | Otaku Store',
      description: 'Browse our complete collection of anime merchandise including t-shirts, stickers, and collectibles.',
      url: `${siteUrl}/products`
    }
  }
}

// Individual product metadata
export function getProductMetadata(product: Product): Metadata {
  const title = product.metadata.name
  const description = product.metadata.description.replace(/<[^>]*>/g, '').substring(0, 160)
  const imageUrl = product.metadata.featured_image?.imgix_url 
    ? `${product.metadata.featured_image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`
    : '/og-product.png'

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Otaku Store`,
      description,
      url: `${siteUrl}/products/${product.slug}`,
      type: 'product',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Otaku Store`,
      description,
      images: [imageUrl]
    }
  }
}

// Category page metadata
export function getCategoryMetadata(categoryName: string, categoryDescription?: string): Metadata {
  const title = `${categoryName} - Anime Merchandise`
  const description = categoryDescription || `Shop our ${categoryName.toLowerCase()} collection of premium anime merchandise.`

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Otaku Store`,
      description,
      url: `${siteUrl}/categories/${categoryName.toLowerCase().replace(/\s+/g, '-')}`
    }
  }
}

// Structured data generators
export function getOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    description: siteDescription,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@otaku-store.com'
    },
    sameAs: [
      'https://twitter.com/otakustore',
      'https://instagram.com/otakustore',
      'https://facebook.com/otakustore'
    ]
  }
}

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
      name: siteName
    },
    category: product.metadata.category.metadata.name,
    offers: {
      '@type': 'Offer',
      price: product.metadata.price.toString(),
      priceCurrency: 'USD',
      availability: product.metadata.in_stock 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: siteName
      }
    }
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
      item: item.url ? `${siteUrl}${item.url}` : undefined
    }))
  }
}