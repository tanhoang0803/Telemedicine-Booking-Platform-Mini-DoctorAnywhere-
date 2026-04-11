import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import LayoutShell from '@/components/layout/LayoutShell'
import { UserProvider } from '@/components/auth/UserContext'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

// Locale layout — wraps pages with i18n Provider, Header, and Footer.
// <html> and <body> live in the root app/layout.tsx (Next.js requirement).
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'en' | 'vi')) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <UserProvider>
        <LayoutShell>{children}</LayoutShell>
      </UserProvider>
    </NextIntlClientProvider>
  )
}
