'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link, useRouter, usePathname } from '@/i18n/navigation'
import { useUser } from '@/components/auth/UserContext'

const NAV_KEYS = ['home', 'doctors', 'booking', 'portal', 'contact'] as const
const NAV_HREFS = ['/', '/doctors', '/booking', '/portal', '/contact'] as const

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const t = useTranslations('nav')
  const tAuth = useTranslations('auth')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading, logout } = useUser()

  function switchLocale(next: string) {
    router.replace(pathname, { locale: next })
  }

  async function handleLogout() {
    await logout()
    router.push('/')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="text-blue-700 font-bold text-lg tracking-tight">
          Mini-DoctorAnywhere
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          {NAV_KEYS.map((key, i) => (
            <Link
              key={key}
              href={NAV_HREFS[i]}
              className="hover:text-blue-600 transition"
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        {/* Right side: lang switcher + auth */}
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          {/* Language switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => switchLocale('en')}
              className={locale === 'en' ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}
              aria-label="Switch to English"
            >
              EN
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => switchLocale('vi')}
              className={locale === 'vi' ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}
              aria-label="Chuyển sang tiếng Việt"
            >
              VI
            </button>
          </div>

          {/* Auth buttons */}
          {!loading && (
            user ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-normal">
                  {user.name.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 transition"
                >
                  {tAuth('signOut')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-gray-600 hover:text-blue-600 transition">
                  {tAuth('signIn')}
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700 transition"
                >
                  {tAuth('register')}
                </Link>
              </div>
            )
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-3">
          <nav className="flex flex-col gap-3 text-sm text-gray-600">
            {NAV_KEYS.map((key, i) => (
              <Link
                key={key}
                href={NAV_HREFS[i]}
                className="hover:text-blue-600 transition"
                onClick={() => setMobileOpen(false)}
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          {/* Mobile auth */}
          {!loading && (
            user ? (
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 text-sm">
                <span className="text-gray-700">{user.name}</span>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false) }}
                  className="text-left text-red-600"
                >
                  {tAuth('signOut')}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 text-sm">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="text-gray-600">
                  {tAuth('signIn')}
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="text-blue-600 font-medium">
                  {tAuth('register')}
                </Link>
              </div>
            )
          )}

          <div className="flex items-center gap-3 pt-2 border-t border-gray-100 text-sm font-medium">
            <button
              onClick={() => { switchLocale('en'); setMobileOpen(false) }}
              className={locale === 'en' ? 'text-blue-600' : 'text-gray-400'}
            >
              English
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => { switchLocale('vi'); setMobileOpen(false) }}
              className={locale === 'vi' ? 'text-blue-600' : 'text-gray-400'}
            >
              Tiếng Việt
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
