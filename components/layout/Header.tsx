'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link, useRouter, usePathname } from '@/i18n/navigation'

const NAV_KEYS = ['home', 'doctors', 'booking', 'portal', 'contact'] as const
const NAV_HREFS = ['/', '/doctors', '/booking', '/portal', '/contact'] as const

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const t = useTranslations('nav')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(next: string) {
    router.replace(pathname, { locale: next })
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

        {/* Language switcher */}
        <div className="hidden md:flex items-center gap-2 text-sm font-medium">
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
