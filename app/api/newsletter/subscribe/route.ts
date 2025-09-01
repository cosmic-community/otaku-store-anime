import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Valid email address is required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Check if email already exists
    try {
      const emailSlug = email.toLowerCase().replace(/[@.]/g, '')
      const existingSubscriber = await cosmic.objects.findOne({
        type: 'newsletter_subscribers',
        slug: emailSlug
      })
      
      if (existingSubscriber.object) {
        return NextResponse.json(
          { success: false, error: 'This email is already subscribed to our newsletter' },
          { status: 409 }
        )
      }
    } catch (error) {
      // If 404, subscriber doesn't exist - this is expected for new subscribers
      if (error && typeof error === 'object' && 'status' in error && error.status !== 404) {
        throw error
      }
    }

    // Create new newsletter subscriber
    const emailSlug = email.toLowerCase().replace(/[@.]/g, '')
    
    await cosmic.objects.insertOne({
      type: 'newsletter_subscribers',
      title: email,
      slug: emailSlug,
      metadata: {
        email: email,
        subscribed_at: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        status: 'Active' // Use exact value from select-dropdown metafield
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    )
  }
}