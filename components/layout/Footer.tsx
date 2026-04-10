import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function Footer() {
  const t = useTranslations('footer')
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>
          &copy; {year} Mini-DoctorAnywhere. {t('built_by')}{' '}
          <a href="mailto:hoangquoctan.1996@gmail.com" className="text-blue-600 hover:underline">
            TanQHoang
          </a>
          . {t('rights')}
        </p>
        <nav className="flex gap-4">
          <Link href="/doctors" className="hover:text-blue-600 transition">Doctors</Link>
          <Link href="/booking" className="hover:text-blue-600 transition">Book</Link>
          <Link href="/contact" className="hover:text-blue-600 transition">Contact</Link>
        </nav>
      </div>
    </footer>
  )
}
