import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { getDoctorSession } from '@/lib/doctorAuth'
import DoctorDashboard from '@/components/doctor/DoctorDashboard'
import DoctorLogoutButton from '@/components/doctor/DoctorLogoutButton'

export const dynamic = 'force-dynamic'

export default async function DoctorPortalPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const session = await getDoctorSession()
  if (!session) {
    redirect(`/${locale}/doctor/login`)
  }

  const [tDoctors, tPortal] = await Promise.all([
    getTranslations('doctors'),
    getTranslations('doctorPortal'),
  ])

  const initials = session.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const specialtyLabel = tDoctors(`specialty_${session.specialtyKey}` as Parameters<typeof tDoctors>[0])

  return (
    <main className="min-h-[80vh] bg-gray-50">
      {/* Header banner */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{tPortal('welcome')}</p>
            <h1 className="text-xl font-bold text-gray-900">{session.name}</h1>
            <p className="text-xs text-gray-500">{specialtyLabel} · {session.email}</p>
          </div>
          <div className="ml-auto">
            <DoctorLogoutButton />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <DoctorDashboard />
      </div>
    </main>
  )
}
