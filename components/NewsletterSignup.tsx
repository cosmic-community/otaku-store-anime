'use client'

import { useState } from 'react'
import { subscribeToNewsletter } from '@/lib/cosmic'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setMessage('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const success = await subscribeToNewsletter(email)
      
      if (success) {
        setIsSubscribed(true)
        setMessage('Thanks for subscribing! You\'ll hear from us soon.')
        setEmail('')
      } else {
        setMessage('Something went wrong. Please try again.')
      }
    } catch (error) {
      setMessage('Failed to subscribe. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubscribed) {
    return (
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4">You're All Set! 🎉</h2>
            <p className="text-xl text-primary-100 mb-6">
              {message}
            </p>
            <button
              onClick={() => setIsSubscribed(false)}
              className="text-primary-200 hover:text-white underline"
            >
              Subscribe another email
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-primary-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Stay in the Loop!</h2>
          <p className="text-xl text-primary-100 mb-8">
            Get the latest updates on new arrivals, exclusive deals, and special anime collections delivered straight to your inbox.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg text-secondary-900 placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
              disabled={isLoading}
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Subscribing...
                </div>
              ) : (
                'Subscribe'
              )}
            </button>
          </form>
          
          {message && (
            <div className={`mt-4 p-4 rounded-lg ${
              message.includes('Thanks') || message.includes('success') 
                ? 'bg-green-500/20 text-green-100 border border-green-400/30' 
                : 'bg-red-500/20 text-red-100 border border-red-400/30'
            }`}>
              {message}
            </div>
          )}
          
          <p className="text-sm text-primary-200 mt-6">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  )
}