// components/booking/BookingForm.tsx — Booking form with Formspree integration (Phase 1)

'use client'

import { useState } from 'react'

export default function BookingForm() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!formspreeId) {
      setError('Booking service is not configured. Please contact us directly.')
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
        setError('Submission failed. Please try again or contact us directly.')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    }
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <p className="text-green-700 font-semibold text-lg">Appointment request sent!</p>
        <p className="text-green-600 text-sm mt-1">
          We will confirm your appointment by email within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="hidden" name="_subject" value="New Appointment Booking — Mini-DoctorAnywhere" />

      <div>
        <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="patientName"
          name="patientName"
          type="text"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address <span className="text-red-500">*</span>
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
          Preferred Date <span className="text-red-500">*</span>
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
          Specialty Needed
        </label>
        <select
          id="specialty"
          name="specialty"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a specialty</option>
          <option value="general">General Practitioner</option>
          <option value="pediatrics">Pediatrics</option>
          <option value="cardiology">Cardiology</option>
          <option value="dermatology">Dermatology</option>
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes / Symptoms
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Briefly describe your symptoms or reason for consultation..."
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        Request Appointment
      </button>
    </form>
  )
}
