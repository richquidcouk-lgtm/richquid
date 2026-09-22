export const LOGO_GREEN = '#0F4F3A'
export const LOGO_PAPER = '#FAFAF7'

export function LogoMark({ size, rounded = true }: { size: number; rounded?: boolean }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: LOGO_GREEN,
        borderRadius: rounded ? size * 0.22 : 0,
      }}
    >
      <span
        style={{
          fontSize: size * 0.62,
          fontWeight: 700,
          color: LOGO_PAPER,
          lineHeight: 1,
          transform: `translateY(${size * 0.03}px)`,
        }}
      >
        R
      </span>
    </div>
  )
}
