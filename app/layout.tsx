import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Mini-DoctorAnywhere — Telemedicine Booking',
    template: '%s | Mini-DoctorAnywhere',
  },
  description:
    'Book appointments with qualified doctors online — quickly, securely, and for free. Nền tảng đặt lịch khám trực tuyến miễn phí.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex flex-col min-h-screen bg-white">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
