import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/db'
import { createDoctorSessionToken, doctorCookieOptions } from '@/lib/doctorAuth'
import { DoctorRegisterSchema } from '@/lib/schemas'
import { rateLimit } from '@/lib/rateLimit'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
  if (!rateLimit(ip, 3, 10 * 60_000).success) {
    return NextResponse.json(
      { error: 'Too many registration attempts. Please wait 10 minutes and try again.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const parsed = DoctorRegisterSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
        { status: 400 }
      )
    }

    const { name, email, password, specialtyKey } = parsed.data
    const db = await getDb()
    const doctors = db.collection('doctors')

    const existing = await doctors.findOne({ email: email.toLowerCase() })
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const result = await doctors.insertOne({
      name,
      email: email.toLowerCase(),
      passwordHash,
      specialtyKey,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const token = await createDoctorSessionToken({
      sub: result.insertedId.toString(),
      email: email.toLowerCase(),
      name,
      specialtyKey,
      role: 'doctor',
    })

    const response = NextResponse.json(
      { data: { id: result.insertedId.toString(), name, email: email.toLowerCase() } },
      { status: 201 }
    )
    response.cookies.set({ ...doctorCookieOptions, value: token })
    return response
  } catch (err) {
    console.error('[doctor register]', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
