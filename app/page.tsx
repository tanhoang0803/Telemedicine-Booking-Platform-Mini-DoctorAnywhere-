// app/page.tsx — Home Page
// Phase 1: Static landing page with hero, feature highlights, and CTA

export default function HomePage() {
  return (
    <main>
      <section className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">
          Telemedicine Booking Platform
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mb-8">
          Book appointments with qualified doctors online — quickly, securely, and for free.
        </p>
        <div className="flex gap-4">
          <a
            href="/doctors"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Find a Doctor
          </a>
          <a
            href="/booking"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            Book Appointment
          </a>
        </div>
      </section>
    </main>
  )
}
