import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ error: 'Newsletter subscriptions are currently unavailable.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
}
