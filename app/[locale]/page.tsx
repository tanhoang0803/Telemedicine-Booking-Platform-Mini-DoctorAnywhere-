import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('home')

  return (
    <main>
      <section className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">{t('title')}</h1>
        <p className="text-lg text-gray-600 max-w-xl mb-8">{t('subtitle')}</p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href="/doctors"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {t('cta_doctors')}
          </Link>
          <Link
            href="/booking"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            {t('cta_booking')}
          </Link>
        </div>
      </section>
    </main>
  )
}
