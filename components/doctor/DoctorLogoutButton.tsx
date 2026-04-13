'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'

export default function DoctorLogoutButton() {
  const t = useTranslations('doctorPortal')
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/doctor/logout', { method: 'POST' })
    router.push('/doctor/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
    >
      {t('signOut')}
    </button>
  )
}
