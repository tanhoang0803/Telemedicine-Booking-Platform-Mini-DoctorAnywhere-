import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import RegisterForm from '@/components/auth/RegisterForm'

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'vi' }]
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('auth')

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('createAccount')}</h1>
          <p className="text-sm text-gray-500 mb-8">{t('registerSubtitle')}</p>

          <RegisterForm />

          <p className="mt-6 text-center text-sm text-gray-500">
            {t('haveAccount')}{' '}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">
              {t('signIn')}
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
