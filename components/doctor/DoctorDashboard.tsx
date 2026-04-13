'use client'

import { useEffect, useState, useCallback } from 'react'
import { useLocale } from 'next-intl'

interface Appointment {
  id: string
  patientName: string
  patientEmail: string
  preferredDate: string
  notes: string
  status: 'pending' | 'confirmed' | 'cancelled'
  roomUrl: string | null
  createdAt: string
}

const STATUS_STYLES = {
  pending:   { pill: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200', dot: 'bg-yellow-400' },
  confirmed: { pill: 'bg-green-50 text-green-700 ring-1 ring-green-200',   dot: 'bg-green-500'  },
  cancelled: { pill: 'bg-gray-100 text-gray-500 ring-1 ring-gray-200',     dot: 'bg-gray-400'   },
}

const FILTERS = ['all', 'pending', 'confirmed', 'cancelled'] as const
type Filter = typeof FILTERS[number]

export default function DoctorDashboard() {
  const locale = useLocale()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await fetch('/api/doctor/appointments')
      if (res.ok) {
        const { data } = await res.json()
        setAppointments(data)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAppointments() }, [fetchAppointments])

  const counts = {
    all:       appointments.length,
    pending:   appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  }

  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter)

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium border transition-all ${
              filter === f
                ? 'border-blue-500 bg-blue-600 text-white shadow-sm'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className={`text-lg font-bold leading-none ${
              filter === f ? 'text-white'
              : f === 'pending'   ? 'text-yellow-500'
              : f === 'confirmed' ? 'text-green-500'
              : f === 'cancelled' ? 'text-gray-400'
              : 'text-blue-600'
            }`}>
              {counts[f]}
            </span>
            <span className="capitalize">{f}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 animate-pulse bg-gray-50 m-4 rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-500 font-medium">
              No {filter === 'all' ? '' : filter} appointments
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Patient</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Notes</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((appt) => {
                const style = STATUS_STYLES[appt.status]
                return (
                  <tr key={appt.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Patient */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">{appt.patientName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{appt.patientEmail}</p>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 hidden md:table-cell">
                      <p className="font-medium text-gray-800">{appt.preferredDate}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(appt.createdAt).toLocaleDateString()}
                      </p>
                    </td>

                    {/* Notes */}
                    <td className="px-5 py-4 hidden lg:table-cell max-w-[200px]">
                      <p className="text-gray-500 text-xs truncate">{appt.notes || '—'}</p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                        {appt.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      {appt.status === 'confirmed' ? (
                        appt.roomUrl ? (
                          <a
                            href={`/${locale}/call?url=${encodeURIComponent(appt.roomUrl)}&doctor=you`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M4 8a2 2 0 012-2h9a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" />
                            </svg>
                            Join Call
                          </a>
                        ) : (
                          <span
                            title="Video room not configured — set DAILY_API_KEY to enable"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-400 cursor-not-allowed"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M4 8a2 2 0 012-2h9a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" />
                            </svg>
                            Join Call
                          </span>
                        )
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-3 text-right">
        {filtered.length} appointment{filtered.length !== 1 ? 's' : ''} shown
      </p>
    </div>
  )
}
