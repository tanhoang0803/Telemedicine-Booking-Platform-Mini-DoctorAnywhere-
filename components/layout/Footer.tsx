// components/layout/Footer.tsx — Site Footer

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>
          &copy; {year} Mini-DoctorAnywhere. Built by{' '}
          <a
            href="mailto:hoangquoctan.1996@gmail.com"
            className="text-blue-600 hover:underline"
          >
            TanQHoang
          </a>
          .
        </p>
        <nav className="flex gap-4">
          <a href="/doctors" className="hover:text-blue-600 transition">Doctors</a>
          <a href="/booking" className="hover:text-blue-600 transition">Book</a>
          <a href="/contact" className="hover:text-blue-600 transition">Contact</a>
        </nav>
      </div>
    </footer>
  )
}
