import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'
import { verifySessionToken } from './lib/auth'

const intlMiddleware = createMiddleware(routing)

const PROTECTED_PATHS = ['/portal']
const ADMIN_PATHS = ['/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path (after stripping locale) is protected
  const isProtected = routing.locales.some((locale) =>
    PROTECTED_PATHS.some(
      (p) => pathname === `/${locale}${p}` || pathname.startsWith(`/${locale}${p}/`)
    )
  )

  const locale = routing.locales.find((l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`)
    ?? routing.defaultLocale

  if (isProtected) {
    const token = request.cookies.get('session')?.value
    let valid = false
    if (token) {
      try {
        await verifySessionToken(token)
        valid = true
      } catch { valid = false }
    }
    if (!valid) {
      const loginUrl = new URL(`/${locale}/login`, request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Admin route protection — skip /admin/login itself
  const isAdminRoute = routing.locales.some((l) =>
    ADMIN_PATHS.some(
      (p) => pathname === `/${l}${p}` || pathname.startsWith(`/${l}${p}/`)
    )
  )
  const isAdminLogin = routing.locales.some((l) => pathname === `/${l}/admin/login`)

  if (isAdminRoute && !isAdminLogin) {
    const token = request.cookies.get('admin_session')?.value
    let isAdmin = false
    if (token) {
      try {
        const { jwtVerify } = await import('jose')
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
        const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] })
        isAdmin = payload.role === 'admin'
      } catch { isAdmin = false }
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url))
    }
  }

  return intlMiddleware(request)
}

export const config = {
  // Match all paths except: api routes, Next.js internals, static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
