import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'RichQuid — UK personal finance, in plain English'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const PAPER = '#FAFAF7'
const INK = '#1A1A1A'
const INK_2 = '#3A3A3A'
const INK_3 = '#6B6B6B'
const GREEN = '#0F4F3A'
const GOLD = '#C9A961'

export default async function Image() {
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
          <span style={{ marginLeft: 16, color: INK_3, fontSize: 16, textTransform: 'uppercase', letterSpacing: 4 }}>
            UK personal finance
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.05,
              color: INK,
              fontWeight: 600,
              letterSpacing: -1.5,
              maxWidth: 1000,
            }}
          >
            UK personal finance,
            <br />
            <span style={{ color: GREEN, fontStyle: 'italic' }}>in plain English.</span>
          </div>
          <div style={{ fontSize: 26, color: INK_2, marginTop: 24, maxWidth: 900, lineHeight: 1.4 }}>
            Guides, calculators and clear thinking on ISAs, pensions, mortgages, savings and tax.
          </div>
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
          <span>richquid.co.uk</span>
          <span>Built by data engineers, not bankers</span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  )
}
