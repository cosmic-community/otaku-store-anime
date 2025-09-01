import type { Metadata } from 'next'
import type { Product } from '@/types'

// Base site configuration
const siteConfig = {
  name: 'Otaku Store',
  description: 'Premium anime merchandise and collectibles. Discover high-quality t-shirts, stickers, and exclusive items for true otaku fans.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://otaku-store.vercel.app',
  ogImage: '/og-image.jpg',
  creator: '@otaku_store',
}

// Generate base metadata that can be extended
export function getBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [
      'anime',
      'manga',
      'otaku',
      'merchandise',
      't-shirts',
      'stickers',
      'collectibles',
      'japanese',
      'kawaii',
      'cosplay',
    ],
    authors: [
      {
        name: siteConfig.name,
        url: siteConfig.url,
      },
    ],
    creator: siteConfig.creator,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteConfig.url,
      title: siteConfig.name,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.name,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
      creator: siteConfig.creator,
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
  }
}

// Home page specific metadata
export function getHomeMetadata(): Metadata {
  return {
    title: 'Premium Anime Merchandise & Collectibles',
    description: 'Discover the ultimate collection of anime merchandise. From exclusive t-shirts to limited edition collectibles, find your perfect otaku gear at Otaku Store.',
    openGraph: {
      title: 'Premium Anime Merchandise & Collectibles | Otaku Store',
      description: 'Discover the ultimate collection of anime merchandise. From exclusive t-shirts to limited edition collectibles, find your perfect otaku gear.',
      url: siteConfig.url,
      images: [
        {
          url: `${siteConfig.url}/og-home.jpg`,
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
    title: 'All Products - Premium Anime Merchandise',
    description: 'Browse our complete collection of premium anime merchandise. High-quality t-shirts, collectible stickers, and exclusive items for true otaku fans.',
    openGraph: {
      title: 'All Products - Premium Anime Merchandise | Otaku Store',
      description: 'Browse our complete collection of premium anime merchandise. High-quality t-shirts, collectible stickers, and exclusive items.',
      url: `${siteConfig.url}/products`,
      images: [
        {
          url: `${siteConfig.url}/og-products.jpg`,
          width: 1200,
          height: 630,
          alt: 'Otaku Store Products',
        },
      ],
    },
  }
}

// Product page metadata
export function getProductMetadata(product: Product): Metadata {
  const images = product.metadata.featured_image
    ? [
        {
          url: `${product.metadata.featured_image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`,
          width: 1200,
          height: 630,
          alt: product.metadata.name,
        },
      ]
    : [
        {
          url: `${siteConfig.url}/og-product-default.jpg`,
          width: 1200,
          height: 630,
          alt: product.metadata.name,
        },
      ]

  // Clean HTML from description for meta description
  const cleanDescription = product.metadata.description
    .replace(/<[^>]*>/g, '')
    .replace(/&[^;]+;/g, ' ')
    .trim()
    .substring(0, 155)

  return {
    title: `${product.metadata.name} - ${product.metadata.category.metadata.name}`,
    description: cleanDescription || `Premium ${product.metadata.category.metadata.name.toLowerCase()} featuring ${product.metadata.name}. Available now at Otaku Store.`,
    openGraph: {
      title: `${product.metadata.name} | Otaku Store`,
      description: cleanDescription,
      url: `${siteConfig.url}/products/${product.slug}`,
      images,
      type: 'product',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.metadata.name,
      description: cleanDescription,
      images: [images[0].url],
    },
  }
}

// Category page metadata
export function getCategoryMetadata(categoryName: string, categorySlug: string): Metadata {
  return {
    title: `${categoryName} - Premium Anime Merchandise`,
    description: `Shop our collection of premium anime ${categoryName.toLowerCase()}. High-quality designs and exclusive items for true otaku fans.`,
    openGraph: {
      title: `${categoryName} - Premium Anime Merchandise | Otaku Store`,
      description: `Shop our collection of premium anime ${categoryName.toLowerCase()}. High-quality designs and exclusive items.`,
      url: `${siteConfig.url}/categories/${categorySlug}`,
      images: [
        {
          url: `${siteConfig.url}/og-category-${categorySlug}.jpg`,
          width: 1200,
          height: 630,
          alt: `${categoryName} at Otaku Store`,
        },
      ],
    },
  }
}

// Structured data generators
export function getOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
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

export function getWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function getProductStructuredData(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.metadata.name,
    description: product.metadata.description.replace(/<[^>]*>/g, '').trim(),
    image: product.metadata.featured_image?.imgix_url,
    sku: product.metadata.sku,
    category: product.metadata.category.metadata.name,
    offers: {
      '@type': 'Offer',
      price: product.metadata.price.toString(),
      priceCurrency: 'USD',
      availability: product.metadata.in_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${siteConfig.url}/products/${product.slug}`,
    },
    brand: {
      '@type': 'Brand',
      name: siteConfig.name,
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
      ...(item.url && { item: `${siteConfig.url}${item.url}` }),
    })),
  }
}

export function getCollectionPageStructuredData(
  name: string,
  description: string,
  url: string,
  products: Product[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: `${siteConfig.url}${url}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.metadata.name,
          image: product.metadata.featured_image?.imgix_url,
          offers: {
            '@type': 'Offer',
            price: product.metadata.price.toString(),
            priceCurrency: 'USD',
          },
        },
      })),
    },
  }
}