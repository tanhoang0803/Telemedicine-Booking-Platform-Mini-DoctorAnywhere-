// app/booking/page.tsx — Appointment Booking Page
// Phase 1: Renders the booking form (Formspree integration)

import BookingForm from '@/components/booking/BookingForm'

export default function BookingPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">Book an Appointment</h1>
      <p className="text-gray-500 mb-8">
        Fill in the form below and we will confirm your appointment by email.
      </p>
      <BookingForm />
    </main>
  )
}
