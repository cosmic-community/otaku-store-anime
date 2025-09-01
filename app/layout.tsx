import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CosmicBadge from '@/components/CosmicBadge'
import { CartProvider } from '@/contexts/CartContext'
import { getBaseMetadata, getOrganizationStructuredData } from '@/lib/seo'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = getBaseMetadata()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Access environment variable on server side
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  // Generate structured data
  const organizationData = getOrganizationStructuredData()

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Console capture script for dashboard debugging */}
        <script src="/dashboard-console-capture.js" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationData)
          }}
        />

        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#667eea" />
        <meta name="msapplication-TileColor" content="#667eea" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          as="style"
        />
      </head>
      <body className={inter.className}>
        <CartProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          {/* Pass bucket slug as prop to client component */}
          <CosmicBadge bucketSlug={bucketSlug} />
        </CartProvider>
      </body>
    </html>
  )
}