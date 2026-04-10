import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import AppointmentDashboard from '@/components/portal/AppointmentDashboard'

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

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blue-700 mb-1">{t('title')}</h1>
      <p className="text-gray-500 mb-8">
        {t('welcome')}, <span className="font-medium text-gray-700">{session.name}</span>
      </p>

      <AppointmentDashboard />
    </main>
  )
}
