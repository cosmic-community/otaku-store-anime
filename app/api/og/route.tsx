import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'Otaku Store'
    const description = searchParams.get('description') || 'Premium anime merchandise for true fans'
    const type = searchParams.get('type') || 'website'
    
    // Different layouts based on type
    if (type === 'home') {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f8fafc',
              fontFamily: 'system-ui',
            }}
          >
            {/* Simple product showcase layout */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                height: '100%',
                padding: '60px',
              }}
            >
              {/* Left side - Text content */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  width: '55%',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: '#667eea',
                    marginBottom: '16px',
                    lineHeight: 1.1,
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    fontSize: '24px',
                    color: '#64748b',
                    lineHeight: 1.4,
                  }}
                >
                  {description}
                </div>
                
                {/* Simple feature badges */}
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '32px',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: '#667eea',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '16px',
                      fontWeight: '500',
                    }}
                  >
                    Premium Quality
                  </div>
                  <div
                    style={{
                      backgroundColor: '#764ba2',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '16px',
                      fontWeight: '500',
                    }}
                  >
                    Limited Edition
                  </div>
                </div>
              </div>
              
              {/* Right side - Product mockup */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40%',
                  height: '100%',
                }}
              >
                {/* T-shirt mockup */}
                <div
                  style={{
                    width: '280px',
                    height: '320px',
                    backgroundColor: '#667eea',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
                    position: 'relative',
                  }}
                >
                  {/* T-shirt design */}
                  <div
                    style={{
                      width: '200px',
                      height: '240px',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '20px',
                    }}
                  >
                    {/* Anime character placeholder */}
                    <div
                      style={{
                        fontSize: '60px',
                        marginBottom: '10px',
                      }}
                    >
                      🎌
                    </div>
                    <div
                      style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#667eea',
                      }}
                    >
                      Anime Collection
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                      }}
                    >
                      <div style={{ fontSize: '20px' }}>⭐</div>
                      <div style={{ fontSize: '20px' }}>🎭</div>
                      <div style={{ fontSize: '20px' }}>✨</div>
                    </div>
                  </div>
                  
                  {/* Price tag */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-10px',
                      backgroundColor: '#764ba2',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 12px rgba(118, 75, 162, 0.4)',
                    }}
                  >
                    $24.99
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        },
      )
    }
    
    // Default layout for other types
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
            backgroundColor: '#667eea',
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: 'system-ui',
          }}
        >
          {/* Simple background pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill-opacity='0.1'%3E%3Cpolygon fill='%23fff' points='36 34 24 32 12 34 12 26 24 24 36 26'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          
          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '40px',
              maxWidth: '800px',
            }}
          >
            {/* Logo/Brand */}
            <div
              style={{
                fontSize: '60px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '20px',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              }}
            >
              Otaku Store
            </div>
            
            {/* Title */}
            <div
              style={{
                fontSize: '40px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '16px',
                lineHeight: 1.2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {title}
            </div>
            
            {/* Description */}
            <div
              style={{
                fontSize: '24px',
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1.4,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              {description}
            </div>
            
            {/* Decorative elements */}
            <div
              style={{
                display: 'flex',
                gap: '20px',
                marginTop: '40px',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '30px',
                }}
              >
                👕
              </div>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '30px',
                }}
              >
                🎌
              </div>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '30px',
                }}
              >
                ✨
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}