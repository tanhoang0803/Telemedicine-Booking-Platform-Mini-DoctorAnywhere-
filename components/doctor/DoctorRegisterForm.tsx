'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, Link } from '@/i18n/navigation'

export default function DoctorRegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [specialtyKey, setSpecialtyKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const t = useTranslations('doctorPortal')
  const tAuth = useTranslations('auth')
  const tBooking = useTranslations('booking')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/doctor/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, specialtyKey }),
      })
      const json = await res.json()
      if (res.ok) {
        router.push('/doctor')
      } else {
        setError(json.error ?? tAuth('registerError'))
      }
    } catch {
      setError(tAuth('networkError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{tAuth('fullName')}</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Dr. Nguyen Van A"
        />
        <p className="text-xs text-gray-400 mt-1">Must match exactly how your name appears in appointment bookings.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{tAuth('email')}</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="email"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{tAuth('password')}</label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="new-password"
        />
        <p className="text-xs text-gray-400 mt-1">{tAuth('passwordHint')}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('specialtyLabel')}</label>
        <select
          required
          value={specialtyKey}
          onChange={(e) => setSpecialtyKey(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">{tBooking('specialty_select')}</option>
          <option value="general">{tBooking('specialty_general')}</option>
          <option value="pediatrics">{tBooking('specialty_pediatrics')}</option>
          <option value="cardiology">{tBooking('specialty_cardiology')}</option>
          <option value="dermatology">{tBooking('specialty_dermatology')}</option>
          <option value="internal_medicine">{tBooking('specialty_internal_medicine')}</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
      >
        {loading ? tAuth('creatingAccount') : tAuth('createAccount')}
      </button>

      <p className="text-center text-sm text-gray-500">
        {t('alreadyHaveAccount')}{' '}
        <Link href="/doctor/login" className="text-blue-600 hover:underline font-medium">
          {tAuth('signIn')}
        </Link>
      </p>
    </form>
  )
}
