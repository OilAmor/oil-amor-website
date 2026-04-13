import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Oil Amor — Essential Oils That Transcend'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1a0f2e 0%, #3d2066 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        <div
          style={{
            fontSize: 120,
            color: '#c9a227',
            marginBottom: '20px',
          }}
        >
          ◈
        </div>
        <div
          style={{
            fontSize: 72,
            fontFamily: 'Georgia, serif',
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          Oil Amor
        </div>
        <div
          style={{
            fontSize: 36,
            color: '#e8d5a3',
            marginTop: '20px',
            textAlign: 'center',
          }}
        >
          Essential oils that transform into crystal jewelry
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
