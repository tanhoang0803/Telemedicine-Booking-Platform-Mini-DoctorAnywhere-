import { NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('session')?.value
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    }

    const payload = await verifySessionToken(token)
    return NextResponse.json({
      data: { id: payload.sub, email: payload.email, name: payload.name, role: payload.role },
    })
  } catch {
    return NextResponse.json({ error: 'Invalid session.' }, { status: 401 })
  }
}
