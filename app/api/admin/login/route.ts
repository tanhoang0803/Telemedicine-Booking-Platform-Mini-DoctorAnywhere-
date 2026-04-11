import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'

const COOKIE = 'admin_session'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword || password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid password.' }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(secret)

    const response = NextResponse.json({ data: { ok: true } })
    response.cookies.set({
      name: COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 8,
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}
