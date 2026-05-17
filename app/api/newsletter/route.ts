import { NextRequest, NextResponse } from 'next/server'

/**
 * Placeholder newsletter endpoint. Returns 200 for any well-formed email so
 * the front-end Newsletter component can be tested end-to-end. Wire this up
 * to a real provider (Buttondown, ConvertKit, etc.) before going live.
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json() as { email?: string }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'invalid email' }, { status: 400 })
    }
    // TODO: wire up to Buttondown / ConvertKit / Mailchimp.
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
}
