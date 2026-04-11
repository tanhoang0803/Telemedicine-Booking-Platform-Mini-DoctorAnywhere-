import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/db'
import { createSessionToken, sessionCookieOptions } from '@/lib/auth'
import { LoginSchema } from '@/lib/schemas'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(request: NextRequest) {
  // 5 attempts per minute per IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
  if (!rateLimit(ip, 5, 60_000).success) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please wait 1 minute and try again.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const parsed = LoginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data
    const db = await getDb()
    const patient = await db
      .collection('patients')
      .findOne({ email: email.toLowerCase() })

    // Use constant-time comparison to avoid timing attacks
    const passwordHash = patient?.passwordHash ?? '$2b$12$invalidhashfortimingprotection'
    const valid = await bcrypt.compare(password, passwordHash)

    if (!patient || !valid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    const token = await createSessionToken({
      sub: patient._id.toString(),
      email: patient.email,
      name: patient.name,
      role: 'patient',
    })

    const response = NextResponse.json({
      data: { id: patient._id.toString(), name: patient.name, email: patient.email },
    })
    response.cookies.set({ ...sessionCookieOptions, value: token })
    return response
  } catch (err) {
    console.error('[login]', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
