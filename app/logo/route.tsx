import { ImageResponse } from 'next/og'
import { LogoMark } from '@/lib/logo'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(<LogoMark size={512} />, { width: 512, height: 512 })
}
