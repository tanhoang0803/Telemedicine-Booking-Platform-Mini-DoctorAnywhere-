// app/contact/page.tsx — Contact Page

export default function ContactPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">Contact Us</h1>
      <p className="text-gray-500 mb-8">
        Have questions? Reach out to our team.
      </p>

      <div className="space-y-4 text-gray-700">
        <div>
          <span className="font-semibold">Email:</span>{' '}
          <a
            href="mailto:hoangquoctan.1996@gmail.com"
            className="text-blue-600 hover:underline"
          >
            hoangquoctan.1996@gmail.com
          </a>
        </div>
        <div>
          <span className="font-semibold">Platform:</span> Mini-DoctorAnywhere
        </div>
        <div>
          <span className="font-semibold">Response time:</span> Within 24 hours
        </div>
      </div>
    </main>
  )
}
