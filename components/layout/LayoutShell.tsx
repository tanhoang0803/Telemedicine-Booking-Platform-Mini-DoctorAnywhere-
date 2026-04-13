'use client'

import { useSelectedLayoutSegments } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const segments = useSelectedLayoutSegments()
  const isAdmin = segments.includes('admin') || segments.includes('doctor')

  return (
    <>
      {!isAdmin && <Header />}
      <div className="flex-1">{children}</div>
      {!isAdmin && <Footer />}
    </>
  )
}
