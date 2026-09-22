import { ImageResponse } from 'next/og'
import { LogoMark } from '@/lib/logo'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(<LogoMark size={180} rounded={false} />, size)
}
