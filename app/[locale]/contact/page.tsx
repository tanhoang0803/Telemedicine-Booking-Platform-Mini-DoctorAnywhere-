import { getTranslations, setRequestLocale } from 'next-intl/server'

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('contact')

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">{t('title')}</h1>
      <p className="text-gray-500 mb-8">{t('subtitle')}</p>

      <div className="space-y-4 text-gray-700">
        <div>
          <span className="font-semibold">{t('email_label')}:</span>{' '}
          <a href="mailto:hoangquoctan.1996@gmail.com" className="text-blue-600 hover:underline">
            hoangquoctan.1996@gmail.com
          </a>
        </div>
        <div>
          <span className="font-semibold">{t('platform_label')}:</span> Mini-DoctorAnywhere
        </div>
        <div>
          <span className="font-semibold">{t('response_label')}:</span> {t('response_time')}
        </div>
      </div>
    </main>
  )
}
