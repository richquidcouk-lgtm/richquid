import { ImageResponse } from 'next/og'
import { getTool, TOOLS } from '@/lib/tools'

export const runtime = 'edge'
export const alt = 'RichQuid calculator'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const PAPER = '#FAFAF7'
const INK = '#1A1A1A'
const INK_3 = '#6B6B6B'
const GREEN = '#0F4F3A'
const GOLD = '#C9A961'

export async function generateImageMetadata({ params }: { params: { tool: string } }) {
  const tool = getTool(params.tool)
  return [{ id: 'default', alt: tool?.title ?? 'RichQuid calculator', size, contentType }]
}

export function generateStaticParams() {
  return TOOLS.map(t => ({ tool: t.slug }))
}

export default async function Image({ params }: { params: { tool: string } }) {
  const tool = getTool(params.tool)
  const title = tool?.title ?? 'Calculator'
  const description = tool?.description ?? ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: PAPER,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 28,
            fontWeight: 600,
            color: INK,
          }}
        >
          Rich<span style={{ color: GREEN }}>Quid</span>
          <span style={{ marginLeft: 16, color: GOLD, fontSize: 22 }}>·</span>
          <span style={{ marginLeft: 16, color: GOLD, fontSize: 16, textTransform: 'uppercase', letterSpacing: 4 }}>
            Calculator
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.05,
              color: INK,
              fontWeight: 600,
              letterSpacing: -1.5,
              maxWidth: 1050,
            }}
          >
            {title}
          </div>
          {description && (
            <div style={{ fontSize: 24, color: INK_3, marginTop: 28, maxWidth: 1000, lineHeight: 1.45 }}>
              {description}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #E5E2DA',
            paddingTop: 24,
            fontSize: 18,
            color: INK_3,
          }}
        >
          <span>richquid.co.uk/tools/{params.tool}</span>
          <span>Free · Ad-free · No signup</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
