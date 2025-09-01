# Otaku Store - Anime E-commerce Store

![Store Preview](https://imgix.cosmicjs.com/8bcd2790-86c6-11f0-8af5-6d65ce6e8553-photo-1574180045827-681f8a1a9622-1756684774789.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A modern Next.js e-commerce website designed for anime fans, featuring premium t-shirts, stickers, and exclusive merchandise. Built with Cosmic CMS for seamless content management and real-time product updates.

## ✨ Features

- **Product Catalog** - Dynamic product listings with categories and filtering
- **Product Details** - Individual product pages with image galleries and descriptions  
- **Newsletter Signup** - Email capture system for promotional updates
- **Category Browsing** - Browse products by T-Shirts, Stickers, and Limited Edition
- **Tag System** - Filter products by trending, best seller, and new arrival tags
- **Responsive Design** - Mobile-first design optimized for all devices
- **SEO Optimized** - Meta tags and structured data for better search rankings
- **Fast Loading** - Optimized images with imgix and efficient data fetching

<!-- CLONE_PROJECT_BUTTON -->

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> An anime fandom e-commerce store selling tshirts and stickers

### Code Generation Prompt

> Build a Next.js website for anime fandom selling tshirts and stickers and a newsletter subscription capture

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠️ Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Cosmic CMS** - Headless CMS for content management
- **Bun** - Fast package manager and runtime

## 🚀 Getting Started

### Prerequisites

- Bun installed on your machine
- A Cosmic account with bucket access

### Installation

1. Install dependencies:
```bash
bun install
```

2. Set up environment variables:
Create a `.env.local` file with your Cosmic credentials:
```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

3. Run the development server:
```bash
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Cosmic SDK Examples

### Fetching Products
```typescript
import { cosmic } from '@/lib/cosmic'

// Get all products with category and tags
const response = await cosmic.objects
  .find({ type: 'products' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)

const products = response.objects
```

### Newsletter Subscription
```typescript
// Create newsletter subscriber
await cosmic.objects.insertOne({
  type: 'newsletter_subscribers',
  title: email,
  metadata: {
    email: email,
    subscribed_at: new Date().toISOString(),
    status: 'active'
  }
})
```

## 🎯 Cosmic CMS Integration

This application uses three main content types:

- **Products** - T-shirts, stickers with pricing, images, and descriptions
- **Categories** - Product organization (T-Shirts, Stickers, Limited Edition)
- **Tags** - Product labels (Trending, Best Seller, New Arrival)

Each product includes:
- Name and description
- Pricing information
- Featured image and gallery
- Category relationship
- Tag associations
- Stock status and SKU

## 🚀 Deployment Options

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Netlify
1. Build the application: `bun run build`
2. Deploy the `out` folder to Netlify
3. Set environment variables in Netlify dashboard

### Environment Variables for Production
Set these in your hosting platform:
- `COSMIC_BUCKET_SLUG`
- `COSMIC_READ_KEY` 
- `COSMIC_WRITE_KEY`

The application will automatically use your Cosmic content and be ready for your anime-loving customers!