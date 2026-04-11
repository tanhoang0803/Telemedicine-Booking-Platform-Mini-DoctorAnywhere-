'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

interface Appointment {
  id: string
  doctorName: string
  specialty: string
  preferredDate: string
  notes: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

const STATUS_STYLES: Record<string, { pill: string; dot: string }> = {
  pending:   { pill: 'bg-yellow-100 text-yellow-800',  dot: 'bg-yellow-400' },
  confirmed: { pill: 'bg-green-100 text-green-800',    dot: 'bg-green-500'  },
  cancelled: { pill: 'bg-gray-100 text-gray-500',      dot: 'bg-gray-400'   },
}

const SPECIALTY_ICONS: Record<string, string> = {
  general:     '🩺',
  pediatrics:  '👶',
  cardiology:  '❤️',
  dermatology: '🔬',
}

export default function AppointmentDashboard() {
  const t = useTranslations('portal')
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<string | null>(null)
  const [error, setError] = useState('')

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await fetch('/api/appointments')
      if (res.ok) {
        const { data } = await res.json()
        setAppointments(data)
      }
    } catch {
      setError(t('loadError'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  async function handleCancel(id: string) {
    setCancelling(id)
    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
        )
      }
    } catch {
      setError(t('cancelError'))
    } finally {
      setCancelling(null)
    }
  }

  // Stats
  const total     = appointments.length
  const pending   = appointments.filter((a) => a.status === 'pending').length
  const confirmed = appointments.filter((a) => a.status === 'confirmed').length

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Live stats — updated from real data */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-blue-600">{total}</p>
          <p className="text-xs text-gray-500 mt-1">{t('statsTotal')}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-yellow-500">{pending}</p>
          <p className="text-xs text-gray-500 mt-1">{t('statsPending')}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-green-500">{confirmed}</p>
          <p className="text-xs text-gray-500 mt-1">{t('statsConfirmed')}</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800">{t('myAppointments')}</h2>
        <Link
          href="/booking"
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          + {t('bookNew')}
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-8 py-16 text-center">
          <div className="text-4xl mb-3">📅</div>
          <p className="text-gray-700 font-medium">{t('noAppointments')}</p>
          <p className="text-gray-400 text-sm mt-1 mb-5">{t('noAppointmentsDesc')}</p>
          <Link
            href="/booking"
            className="inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            {t('bookFirst')}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appt) => {
            const style = STATUS_STYLES[appt.status] ?? STATUS_STYLES.pending
            const icon  = SPECIALTY_ICONS[appt.specialty.toLowerCase()] ?? '🏥'

            return (
              <div
                key={appt.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-4 hover:shadow-md transition-shadow"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-lg shrink-0">
                  {icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">{appt.doctorName}</span>
                    <span className="text-gray-300 text-xs">|</span>
                    <span className="text-gray-500 text-xs capitalize">{appt.specialty}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs text-gray-600 font-medium">{appt.preferredDate}</span>
                  </div>
                  {appt.notes && (
                    <p className="text-xs text-gray-400 mt-1 truncate">{appt.notes}</p>
                  )}
                </div>

                {/* Status + action */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style.pill}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                    {t(`status.${appt.status}`)}
                  </span>
                  {appt.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(appt.id)}
                      disabled={cancelling === appt.id}
                      className="text-xs text-red-400 hover:text-red-600 disabled:opacity-50 transition-colors"
                    >
                      {cancelling === appt.id ? t('cancelling') : t('cancel')}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
