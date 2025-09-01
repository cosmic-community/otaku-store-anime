import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-secondary-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary-600">
            Otaku Store
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
            >
              All Products
            </Link>
            <Link 
              href="/categories/t-shirts" 
              className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
            >
              T-Shirts
            </Link>
            <Link 
              href="/categories/stickers" 
              className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
            >
              Stickers
            </Link>
            <Link 
              href="/categories/limited-edition" 
              className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
            >
              Limited Edition
            </Link>
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 text-secondary-600 hover:text-primary-600 transition-colors"
            type="button"
            aria-label="Open mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}