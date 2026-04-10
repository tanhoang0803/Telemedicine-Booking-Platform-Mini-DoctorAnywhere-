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

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-500',
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
        {t('loading')}
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">{t('myAppointments')}</h2>
        <Link
          href="/booking"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          {t('bookNew')}
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-8 py-14 text-center">
          <p className="text-gray-500 text-sm">{t('noAppointments')}</p>
          <Link
            href="/booking"
            className="mt-4 inline-block text-blue-600 text-sm font-medium hover:underline"
          >
            {t('bookFirst')}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{appt.doctorName}</span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-gray-500 text-sm">{appt.specialty}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {t('date')}: <span className="font-medium">{appt.preferredDate}</span>
                  </p>
                  {appt.notes && (
                    <p className="text-sm text-gray-500 mt-1 truncate">{appt.notes}</p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[appt.status] ?? ''}`}
                  >
                    {t(`status.${appt.status}`)}
                  </span>
                  {appt.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(appt.id)}
                      disabled={cancelling === appt.id}
                      className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
                    >
                      {cancelling === appt.id ? t('cancelling') : t('cancel')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
