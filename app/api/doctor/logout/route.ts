import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ data: { ok: true } })
  response.cookies.set({
    name: 'doctor_session',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  })
  return response
}
