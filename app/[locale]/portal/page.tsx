import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import AppointmentDashboard from '@/components/portal/AppointmentDashboard'
import { Link } from '@/i18n/navigation'

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'vi' }]
}

export default async function PortalPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const session = await getSession()
  if (!session) {
    redirect(`/${locale}/login`)
  }

  const t = await getTranslations('portal')
  const initials = session.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <main className="min-h-[80vh] bg-gray-50">
      {/* Header banner */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{t('welcome')}</p>
            <h1 className="text-xl font-bold text-gray-900">{session.name}</h1>
            <p className="text-xs text-gray-500">{session.email}</p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-3">
            <Link
              href="/doctors"
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              {t('findDoctor')}
            </Link>
            <Link
              href="/booking"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              {t('bookNew')}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Mobile action buttons */}
        <div className="flex gap-3 mb-6 sm:hidden">
          <Link
            href="/booking"
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white text-center hover:bg-blue-700 transition"
          >
            {t('bookNew')}
          </Link>
          <Link
            href="/doctors"
            className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 text-center hover:bg-gray-50 transition"
          >
            {t('findDoctor')}
          </Link>
        </div>

        {/* Appointments */}
        <AppointmentDashboard />
      </div>
    </main>
  )
}
