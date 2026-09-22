const GREEN = '#0F4F3A'
const GOLD = '#C9A961'

// Three ascending bars: a small, literal "growth" chart rather than a letterform.
// `badge` (green rounded-square) suits light backgrounds; `bars` (no fill) suits
// the green footer, where a second green square would disappear into it.
export function LogoIcon({ size = 28, variant = 'badge' }: { size?: number; variant?: 'badge' | 'bars' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      {variant === 'badge' && <rect width="32" height="32" rx="7" fill={GREEN} />}
      <rect x="7" y="17" width="4" height="8" rx="1.2" fill={GOLD} />
      <rect x="14" y="12" width="4" height="13" rx="1.2" fill={GOLD} />
      <rect x="21" y="7" width="4" height="18" rx="1.2" fill={GOLD} />
    </svg>
  )
}

export default function Logo({ size = 28, iconVariant = 'badge' }: { size?: number; iconVariant?: 'badge' | 'bars' }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoIcon size={size} variant={iconVariant} />
      <span className="font-serif-display text-2xl tracking-tight">
        Rich<span className="text-[color:var(--green)]">Quid</span>
      </span>
    </span>
  )
}
