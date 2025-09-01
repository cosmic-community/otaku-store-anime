import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const title = searchParams.get('title') || 'Otaku Store'
    const description = searchParams.get('description') || 'Premium anime merchandise'
    const type = searchParams.get('type') || 'website'

    // Different styles based on type
    const isProduct = type === 'product'
    const isCategory = type === 'category'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              opacity: 0.3,
            }}
          />

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px',
              textAlign: 'center',
              maxWidth: '900px',
              zIndex: 1,
            }}
          >
            {/* Logo/Brand */}
            <div
              style={{
                fontSize: '40px',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '20px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              🎌 OTAKU STORE
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: isProduct ? '56px' : '64px',
                fontWeight: 'bold',
                color: '#ffffff',
                lineHeight: 1.2,
                marginBottom: '30px',
                textAlign: 'center',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              }}
            >
              {title}
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: '28px',
                color: '#e2e8f0',
                lineHeight: 1.4,
                maxWidth: '800px',
                textAlign: 'center',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              {description}
            </p>

            {/* Type Badge */}
            {(isProduct || isCategory) && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '30px',
                  padding: '12px 24px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: '25px',
                  fontSize: '20px',
                  color: '#ffffff',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {isProduct ? '👕 Product' : '📁 Category'}
              </div>
            )}
          </div>

          {/* Bottom Accent */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '8px',
              background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3)',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: unknown) {
    console.log(`Failed to generate the image: ${e}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}