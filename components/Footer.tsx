import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-primary-400 mb-4">Otaku Store</h3>
            <p className="text-secondary-300 mb-4">
              Premium anime merchandise for true fans. Express your otaku spirit with our curated collection.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-secondary-300 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories/t-shirts" className="text-secondary-300 hover:text-white transition-colors">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/categories/stickers" className="text-secondary-300 hover:text-white transition-colors">
                  Stickers
                </Link>
              </li>
              <li>
                <Link href="/categories/limited-edition" className="text-secondary-300 hover:text-white transition-colors">
                  Limited Edition
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><span className="text-secondary-300">New Arrivals</span></li>
              <li><span className="text-secondary-300">Best Sellers</span></li>
              <li><span className="text-secondary-300">Trending</span></li>
              <li><span className="text-secondary-300">Exclusive Items</span></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <p className="text-secondary-300 mb-2">
              Join our community of anime fans
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-secondary-300 hover:text-primary-400 transition-colors"
                aria-label="Follow us on social media"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-secondary-700 mt-8 pt-8 text-center">
          <p className="text-secondary-400">
            © 2025 Otaku Store. All rights reserved. Built with Cosmic CMS.
          </p>
        </div>
      </div>
    </footer>
  )
}