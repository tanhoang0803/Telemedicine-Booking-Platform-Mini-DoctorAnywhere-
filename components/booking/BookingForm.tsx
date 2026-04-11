'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { useUser } from '@/components/auth/UserContext'
import { Link } from '@/i18n/navigation'

interface BookingFormProps {
  doctorId?: string
  doctorName?: string
  specialty?: string
}

export default function BookingForm({ doctorId, doctorName, specialty }: BookingFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const t = useTranslations('booking')
  const tAuth = useTranslations('auth')
  const router = useRouter()
  const { user, loading: userLoading } = useUser()

  // Tomorrow as default min date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  const [selectedDoctorName, setSelectedDoctorName] = useState(doctorName ?? '')
  const [selectedSpecialty, setSelectedSpecialty] = useState(specialty ?? '')
  const [preferredDate, setPreferredDate] = useState('')
  const [notes, setNotes] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: doctorId ?? 'general',
          doctorName: selectedDoctorName || t('anyDoctor'),
          specialty: selectedSpecialty || 'general',
          preferredDate,
          notes: notes || undefined,
        }),
      })

      const json = await res.json()
      if (res.status === 401) {
        router.push('/login')
        return
      }
      if (!res.ok) {
        setError(json.error ?? t('error_submission'))
        return
      }

      setSubmitted(true)
    } catch {
      setError(t('error_network'))
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-green-700 font-semibold text-lg">{t('success_title')}</p>
        <p className="text-green-600 text-sm mt-1">{t('success_message')}</p>
        <button
          onClick={() => { setSubmitted(false); setPreferredDate(''); setNotes('') }}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          {t('bookAnother')}
        </button>
      </div>
    )
  }

  if (userLoading) {
    return <div className="py-8 text-center text-gray-400 text-sm">{t('loading')}</div>
  }

  if (!user) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <p className="text-blue-700 font-medium mb-3">{t('loginRequired')}</p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
          >
            {tAuth('signIn')}
          </Link>
          <Link
            href="/register"
            className="rounded-lg border border-blue-300 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 transition"
          >
            {tAuth('register')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Doctor name — read-only if pre-filled from doctor card, editable otherwise */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('doctor_name')} <span className="text-red-500">*</span>
        </label>
        {doctorName ? (
          <div className="w-full border border-blue-200 bg-blue-50 rounded-lg px-3 py-2 text-sm text-blue-800 font-medium">
            {doctorName}
          </div>
        ) : (
          <input
            type="text"
            required
            value={selectedDoctorName}
            onChange={(e) => setSelectedDoctorName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t('doctor_name_placeholder')}
          />
        )}
      </div>

      {/* Specialty — read-only if pre-filled, dropdown otherwise */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('specialty')}
        </label>
        {specialty ? (
          <div className="w-full border border-blue-200 bg-blue-50 rounded-lg px-3 py-2 text-sm text-blue-800 font-medium">
            {specialty}
          </div>
        ) : (
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t('specialty_select')}</option>
            <option value="general">{t('specialty_general')}</option>
            <option value="pediatrics">{t('specialty_pediatrics')}</option>
            <option value="cardiology">{t('specialty_cardiology')}</option>
            <option value="dermatology">{t('specialty_dermatology')}</option>
          </select>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('preferred_date')} <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          required
          min={minDate}
          value={preferredDate}
          onChange={(e) => setPreferredDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('notes')}
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={500}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder={t('notes_placeholder')}
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 transition"
      >
        {loading ? t('submitting') : t('submit')}
      </button>
    </form>
  )
}
