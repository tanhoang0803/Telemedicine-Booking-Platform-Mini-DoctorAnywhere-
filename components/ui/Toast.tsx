'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error'
  duration?: number
  onClose: () => void
}

export default function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const colors =
    type === 'success'
      ? 'bg-green-600 text-white'
      : 'bg-red-600 text-white'

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl px-5 py-3 shadow-lg text-sm font-medium transition-all duration-300 ${colors} ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      {type === 'success' ? (
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {message}
    </div>
  )
}
