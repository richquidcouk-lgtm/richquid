export const LOGO_GREEN = '#0F4F3A'
export const LOGO_GOLD = '#C9A961'

// Mirrors components/Logo.tsx (three ascending bars) but built from flex
// boxes rather than SVG, since that's what next/og's ImageResponse renders
// reliably for favicon/apple-icon/logo generation.
export function LogoMark({ size, rounded = true }: { size: number; rounded?: boolean }) {
  const pad = size * (7 / 32)
  const gap = size * (3 / 32)
  const barWidth = size * (4 / 32)
  const heights = [8 / 32, 13 / 32, 18 / 32].map(f => f * size)

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap,
        padding: pad,
        background: LOGO_GREEN,
        borderRadius: rounded ? size * 0.22 : 0,
      }}
    >
      {heights.map((h, i) => (
        <div
          key={i}
          style={{
            width: barWidth,
            height: h,
            background: LOGO_GOLD,
            borderRadius: barWidth * 0.3,
          }}
        />
      ))}
    </div>
  )
}
