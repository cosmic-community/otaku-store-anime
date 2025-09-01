'use client'

import { useState } from 'react'
import { subscribeToNewsletter } from '@/lib/cosmic'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setStatus('error')
      setMessage('Please enter your email address')
      return
    }

    setStatus('loading')
    
    try {
      const success = await subscribeToNewsletter(email)
      
      if (success) {
        setStatus('success')
        setMessage('Thanks for subscribing! You\'ll receive our latest updates.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Failed to subscribe. Please try again later.')
    }
  }

  return (
    <section className="bg-gradient-to-r from-primary-600 to-accent-600 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Stay Updated with New Arrivals
        </h2>
        <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
          Be the first to know about new anime merchandise, exclusive deals, and limited edition releases. Join our otaku community!
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={status === 'loading'}
              className="flex-1 px-4 py-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary bg-white text-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
          
          {message && (
            <p className={`mt-4 text-sm ${
              status === 'success' ? 'text-accent-200' : 'text-red-200'
            }`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}