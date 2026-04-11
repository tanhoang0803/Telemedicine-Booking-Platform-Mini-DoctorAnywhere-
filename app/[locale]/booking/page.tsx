import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import BookingForm from '@/components/booking/BookingForm'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'booking' })
  return {
    title: t('title') + ' — Mini-DoctorAnywhere',
    description: t('subtitle'),
    openGraph: {
      title: t('title') + ' — Mini-DoctorAnywhere',
      description: t('subtitle'),
      url: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/booking`,
    },
  }
}

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ doctorId?: string; doctorName?: string; specialty?: string }>
}) {
  const { locale } = await params
  const { doctorId, doctorName, specialty } = await searchParams
  setRequestLocale(locale)
  const t = await getTranslations('booking')

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">{t('title')}</h1>
      <p className="text-gray-500 mb-8">{t('subtitle')}</p>
      <BookingForm doctorId={doctorId} doctorName={doctorName} specialty={specialty} />
    </main>
  )
}
