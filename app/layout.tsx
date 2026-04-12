import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

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
    'Book appointments with qualified doctors online — quickly, securely, and for free.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
}

// Root layout — owns <html> and <body> as required by Next.js App Router.
// The [locale] layout sets lang via suppressHydrationWarning.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="flex flex-col min-h-screen bg-white antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
