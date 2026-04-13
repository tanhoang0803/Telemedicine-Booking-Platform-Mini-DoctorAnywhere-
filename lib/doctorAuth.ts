// lib/doctorAuth.ts — JWT utilities for doctor sessions
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const COOKIE_NAME = 'doctor_session'
const TOKEN_EXPIRY = '8h'

export interface DoctorSessionPayload {
  sub: string          // MongoDB doctor _id as string
  email: string
  name: string
  specialtyKey: string
  role: 'doctor'
}

function getSecret(): Uint8Array {
  const key = process.env.JWT_SECRET
  if (!key) throw new Error('JWT_SECRET is not set.')
  return new TextEncoder().encode(key)
}

export async function createDoctorSessionToken(payload: DoctorSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(getSecret())
}

/** Use in Server Components and layouts. */
export async function getDoctorSession(): Promise<DoctorSessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ['HS256'] })
    return payload as unknown as DoctorSessionPayload
  } catch {
    return null
  }
}

/** Use in API route handlers. */
export async function verifyDoctorRequest(request: NextRequest): Promise<DoctorSessionPayload | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ['HS256'] })
    const session = payload as unknown as DoctorSessionPayload
    if (session.role !== 'doctor') return null
    return session
  } catch {
    return null
  }
}

export const doctorCookieOptions = {
  name: COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 60 * 60 * 8, // 8 hours
}
