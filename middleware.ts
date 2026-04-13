import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const PROTECTED_PATHS = ['/portal']
const ADMIN_PATHS = ['/admin']
const DOCTOR_PATHS = ['/doctor']
const DOCTOR_PUBLIC = ['/doctor/login', '/doctor/register']

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET ?? '')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const locale =
    routing.locales.find((l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`) ??
    routing.defaultLocale

  // Patient-protected routes (/portal)
  const isProtected = routing.locales.some((l) =>
    PROTECTED_PATHS.some((p) => pathname === `/${l}${p}` || pathname.startsWith(`/${l}${p}/`))
  )

  if (isProtected) {
    const token = request.cookies.get('session')?.value
    let valid = false
    if (token) {
      try {
        await jwtVerify(token, getSecret(), { algorithms: ['HS256'] })
        valid = true
      } catch { valid = false }
    }
    if (!valid) {
      const url = new URL(`/${locale}/login`, request.url)
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }
  }

  // Admin-protected routes (/admin) — skip /admin/login
  const isAdminRoute = routing.locales.some((l) =>
    ADMIN_PATHS.some((p) => pathname === `/${l}${p}` || pathname.startsWith(`/${l}${p}/`))
  )
  const isAdminLogin = routing.locales.some((l) => pathname === `/${l}/admin/login`)

  if (isAdminRoute && !isAdminLogin) {
    const token = request.cookies.get('admin_session')?.value
    let isAdmin = false
    if (token) {
      try {
        const { payload } = await jwtVerify(token, getSecret(), { algorithms: ['HS256'] })
        isAdmin = payload.role === 'admin'
      } catch { isAdmin = false }
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url))
    }
  }

  // Doctor-protected routes (/doctor) — skip /doctor/login and /doctor/register
  const isDoctorRoute = routing.locales.some((l) =>
    DOCTOR_PATHS.some((p) => pathname === `/${l}${p}` || pathname.startsWith(`/${l}${p}/`))
  )
  const isDoctorPublic = routing.locales.some((l) =>
    DOCTOR_PUBLIC.some((p) => pathname === `/${l}${p}`)
  )

  if (isDoctorRoute && !isDoctorPublic) {
    const token = request.cookies.get('doctor_session')?.value
    let isDoctor = false
    if (token) {
      try {
        const { payload } = await jwtVerify(token, getSecret(), { algorithms: ['HS256'] })
        isDoctor = payload.role === 'doctor'
      } catch { isDoctor = false }
    }
    if (!isDoctor) {
      return NextResponse.redirect(new URL(`/${locale}/doctor/login`, request.url))
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
