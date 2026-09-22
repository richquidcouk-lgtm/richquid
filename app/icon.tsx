import { ImageResponse } from 'next/og'
import { LogoMark } from '@/lib/logo'

export const runtime = 'edge'
export const size = { width: 48, height: 48 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(<LogoMark size={48} />, size)
}
