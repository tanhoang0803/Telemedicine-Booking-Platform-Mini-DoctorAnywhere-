import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'
import { verifySessionToken } from './lib/auth'

const intlMiddleware = createMiddleware(routing)

const PROTECTED_PATHS = ['/portal']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path (after stripping locale) is protected
  const isProtected = routing.locales.some((locale) =>
    PROTECTED_PATHS.some(
      (p) => pathname === `/${locale}${p}` || pathname.startsWith(`/${locale}${p}/`)
    )
  )

  if (isProtected) {
    const token = request.cookies.get('session')?.value
    let valid = false
    if (token) {
      try {
        await verifySessionToken(token)
        valid = true
      } catch {
        valid = false
      }
    }

    if (!valid) {
      // Detect locale from pathname for redirect
      const locale = routing.locales.find((l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`)
        ?? routing.defaultLocale
      const loginUrl = new URL(`/${locale}/login`, request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return intlMiddleware(request)
}

export const config = {
  // Match all paths except: api routes, Next.js internals, static files
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
