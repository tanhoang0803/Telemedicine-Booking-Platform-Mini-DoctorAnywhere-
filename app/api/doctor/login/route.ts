import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/db'
import { createDoctorSessionToken, doctorCookieOptions } from '@/lib/doctorAuth'
import { DoctorLoginSchema } from '@/lib/schemas'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
  if (!rateLimit(ip, 5, 60_000).success) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please wait 1 minute and try again.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const parsed = DoctorLoginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data
    const db = await getDb()
    const doctor = await db.collection('doctors').findOne({ email: email.toLowerCase() })

    const passwordHash = doctor?.passwordHash ?? '$2b$12$invalidhashfortimingprotection'
    const valid = await bcrypt.compare(password, passwordHash)

    if (!doctor || !valid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    const token = await createDoctorSessionToken({
      sub: doctor._id.toString(),
      email: doctor.email,
      name: doctor.name,
      specialtyKey: doctor.specialtyKey,
      role: 'doctor',
    })

    const response = NextResponse.json({
      data: { id: doctor._id.toString(), name: doctor.name, email: doctor.email },
    })
    response.cookies.set({ ...doctorCookieOptions, value: token })
    return response
  } catch (err) {
    console.error('[doctor login]', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
