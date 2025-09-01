import type { Metadata } from 'next'
import type { Product, Category } from '@/types'

const siteConfig = {
  name: 'Otaku Store',
  description: 'Premium Anime T-Shirts & Stickers - Discover premium anime-themed t-shirts, kawaii stickers, and limited edition merchandise. Express your otaku spirit with our curated collection.',
  url: 'https://otaku-store-anime-hn95v39hq.cosmic.site',
  ogImage: 'https://otaku-store-anime-hn95v39hq.cosmic.site/api/og'
}

export function getHomeMetadata(productImageUrl?: string): Metadata {
  // Use product image if available, otherwise use default OG route
  const ogImageUrl = productImageUrl 
    ? `${productImageUrl}?w=1200&h=630&fit=crop&auto=format,compress`
    : `${siteConfig.url}/api/og`

  return {
    title: siteConfig.name,
    description: siteConfig.description,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: siteConfig.name,
      description: siteConfig.description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - Premium Anime Merchandise`,
          type: 'image/png',
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.name,
      description: siteConfig.description,
      images: [ogImageUrl]
    },
    alternates: {
      canonical: siteConfig.url
    }
  }
}

export function getProductsMetadata(): Metadata {
  const title = 'Premium Anime Products | Otaku Store'
  const description = 'Browse our complete collection of premium anime merchandise including t-shirts, stickers, and collectibles. Find your perfect otaku gear.'
  
  return {
    title,
    description,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `${siteConfig.url}/products`,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: `${siteConfig.url}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteConfig.url}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`]
    },
    alternates: {
      canonical: `${siteConfig.url}/products`
    }
  }
}

export function getProductMetadata(product: Product): Metadata {
  const title = `${product.metadata.name} | Otaku Store`
  const description = `${product.metadata.description.replace(/<[^>]*>/g, '').slice(0, 155)}...`
  const productUrl = `${siteConfig.url}/products/${product.slug}`
  
  // Use the product's featured image for OG
  const ogImage = product.metadata.featured_image?.imgix_url
    ? `${product.metadata.featured_image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`
    : `${siteConfig.url}/api/og?title=${encodeURIComponent(product.metadata.name)}&description=${encodeURIComponent(description)}`

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: productUrl,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: product.metadata.name,
          type: 'image/png',
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage]
    },
    alternates: {
      canonical: productUrl
    }
  }
}

export function getCategoryMetadata(category: Category): Metadata {
  const title = `${category.metadata.name} | Otaku Store`
  const description = category.metadata.description || `Browse our ${category.metadata.name.toLowerCase()} collection of premium anime merchandise.`
  const categoryUrl = `${siteConfig.url}/categories/${category.slug}`
  
  // Use category image if available, otherwise use default OG
  const ogImage = category.metadata.category_image?.imgix_url
    ? `${category.metadata.category_image.imgix_url}?w=1200&h=630&fit=crop&auto=format,compress`
    : `${siteConfig.url}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: categoryUrl,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage]
    },
    alternates: {
      canonical: categoryUrl
    }
  }
}

// Structured Data Helpers
export function getProductStructuredData(product: Product) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.metadata.name,
    "image": product.metadata.featured_image?.imgix_url,
    "description": product.metadata.description.replace(/<[^>]*>/g, ''),
    "sku": product.metadata.sku,
    "brand": {
      "@type": "Brand",
      "name": "Otaku Store"
    },
    "offers": {
      "@type": "Offer",
      "url": `${siteConfig.url}/products/${product.slug}`,
      "priceCurrency": "USD",
      "price": product.metadata.price,
      "availability": product.metadata.in_stock 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock"
    },
    "category": product.metadata.category.metadata.name
  }
}

export function getBreadcrumbStructuredData(items: Array<{ name: string; url?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      ...(item.url && { "item": `${siteConfig.url}${item.url}` })
    }))
  }
}