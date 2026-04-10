'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface BookingFormProps {
  doctorId?: string
}

export default function BookingForm({ doctorId }: BookingFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const t = useTranslations('booking')

  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (!formspreeId) {
      setError(t('error_not_configured'))
      return
    }

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })

      if (res.ok) {
        setSubmitted(true)
        form.reset()
      } else {
        setError(t('error_submission'))
      }
    } catch {
      setError(t('error_network'))
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-green-700 font-semibold text-lg">{t('success_title')}</p>
        <p className="text-green-600 text-sm mt-1">{t('success_message')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="hidden" name="_subject" value="New Appointment Booking — Mini-DoctorAnywhere" />
      {doctorId && <input type="hidden" name="doctorId" value={doctorId} />}

      <div>
        <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">
          {t('patient_name')} <span className="text-red-500">*</span>
        </label>
        <input
          id="patientName"
          name="patientName"
          type="text"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t('patient_name')}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          {t('email')} <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-1">
          {t('preferred_date')} <span className="text-red-500">*</span>
        </label>
        <input
          id="preferredDate"
          name="preferredDate"
          type="date"
          required
          min={new Date().toISOString().split('T')[0]}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
          {t('specialty')}
        </label>
        <select
          id="specialty"
          name="specialty"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{t('specialty')}</option>
          <option value="general">{t('specialty_general')}</option>
          <option value="pediatrics">{t('specialty_pediatrics')}</option>
          <option value="cardiology">{t('specialty_cardiology')}</option>
          <option value="dermatology">{t('specialty_dermatology')}</option>
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          {t('notes')}
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder={t('notes_placeholder')}
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        {t('submit')}
      </button>
    </form>
  )
}
