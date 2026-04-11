'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from '@/i18n/navigation'

interface Appointment {
  id: string
  patientName: string
  patientEmail: string
  doctorName: string
  specialty: string
  preferredDate: string
  notes: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

const STATUS_STYLES = {
  pending:   'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-500',
}

const FILTERS = ['all', 'pending', 'confirmed', 'cancelled'] as const
type Filter = typeof FILTERS[number]

function LogoutButton() {
  const router = useRouter()
  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }
  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-500 hover:text-red-600 transition-colors"
    >
      Sign Out
    </button>
  )
}

function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')
  const [updating, setUpdating] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/appointments')
      if (res.ok) {
        const { data } = await res.json()
        setAppointments(data)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  async function updateStatus(id: string, status: 'confirmed' | 'cancelled') {
    setUpdating(id)
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status } : a))
        )
        setToast(`Appointment ${status}. Patient notified by email.`)
        setTimeout(() => setToast(''), 4000)
      }
    } finally {
      setUpdating(null)
    }
  }

  const filtered = filter === 'all'
    ? appointments
    : appointments.filter((a) => a.status === filter)

  const counts = {
    all:       appointments.length,
    pending:   appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1,2,3,4].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white text-sm font-medium rounded-xl px-5 py-3 shadow-lg flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {toast}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-xl border p-4 text-center transition-all ${
              filter === f
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-100 bg-white hover:bg-gray-50'
            }`}
          >
            <p className={`text-2xl font-bold ${
              f === 'pending' ? 'text-yellow-500'
              : f === 'confirmed' ? 'text-green-500'
              : f === 'cancelled' ? 'text-gray-400'
              : 'text-blue-600'
            }`}>
              {counts[f]}
            </p>
            <p className="text-xs text-gray-500 mt-1 capitalize">{f}</p>
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-200 px-8 py-14 text-center">
          <p className="text-gray-400 text-sm">No appointments found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((appt) => (
            <div
              key={appt.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* Left: patient + appointment info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[appt.status]}`}>
                      {appt.status}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(appt.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 text-sm">
                    <div>
                      <span className="text-gray-400 text-xs uppercase tracking-wide">Patient</span>
                      <p className="font-semibold text-gray-900">{appt.patientName}</p>
                      <p className="text-gray-500 text-xs">{appt.patientEmail}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs uppercase tracking-wide">Doctor</span>
                      <p className="font-semibold text-gray-900">{appt.doctorName}</p>
                      <p className="text-gray-500 text-xs capitalize">{appt.specialty}</p>
                    </div>
                    <div className="mt-1">
                      <span className="text-gray-400 text-xs uppercase tracking-wide">Date</span>
                      <p className="font-medium text-gray-900">{appt.preferredDate}</p>
                    </div>
                    {appt.notes && (
                      <div className="mt-1">
                        <span className="text-gray-400 text-xs uppercase tracking-wide">Notes</span>
                        <p className="text-gray-600 text-xs">{appt.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: action buttons */}
                {appt.status === 'pending' && (
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => updateStatus(appt.id, 'confirmed')}
                      disabled={updating === appt.id}
                      className="rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {updating === appt.id ? '...' : '✓ Confirm'}
                    </button>
                    <button
                      onClick={() => updateStatus(appt.id, 'cancelled')}
                      disabled={updating === appt.id}
                      className="rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                    >
                      {updating === appt.id ? '...' : '✕ Cancel'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

AdminDashboard.LogoutButton = LogoutButton

export default AdminDashboard
