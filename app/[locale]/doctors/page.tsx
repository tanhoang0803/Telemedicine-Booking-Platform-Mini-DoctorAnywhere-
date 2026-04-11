import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import DoctorCard from '@/components/doctors/DoctorCard'
import { MOCK_DOCTORS } from '@/lib/doctors'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'doctors' })
  return {
    title: t('title') + ' — Mini-DoctorAnywhere',
    description: t('subtitle'),
    openGraph: {
      title: t('title') + ' — Mini-DoctorAnywhere',
      description: t('subtitle'),
      url: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/doctors`,
    },
  }
}

export default async function DoctorsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('doctors')

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">{t('title')}</h1>
      <p className="text-gray-500 mb-8">{t('subtitle')}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_DOCTORS.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </main>
  )
}
