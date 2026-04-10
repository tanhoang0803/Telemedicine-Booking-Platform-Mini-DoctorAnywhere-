import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/db'
import { createSessionToken, sessionCookieOptions } from '@/lib/auth'
import { RegisterSchema } from '@/lib/schemas'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = RegisterSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
        { status: 400 }
      )
    }

    const { name, email, password, phone } = parsed.data
    const db = await getDb()
    const patients = db.collection('patients')

    // Check email not already taken
    const existing = await patients.findOne({ email: email.toLowerCase() })
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const result = await patients.insertOne({
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone: phone ?? '',
      language: 'en',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const token = await createSessionToken({
      sub: result.insertedId.toString(),
      email: email.toLowerCase(),
      name,
      role: 'patient',
    })

    const response = NextResponse.json(
      { data: { id: result.insertedId.toString(), name, email: email.toLowerCase() } },
      { status: 201 }
    )
    response.cookies.set({ ...sessionCookieOptions, value: token })
    return response
  } catch (err) {
    console.error('[register]', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
