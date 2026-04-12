import { redirect } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { getSession } from '@/lib/auth'
import VideoCallFrame from '@/components/video/VideoCallFrame'

export const dynamic = 'force-dynamic'

// Only Daily.co URLs are allowed in the iframe
function isValidDailyUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' && parsed.hostname.endsWith('.daily.co')
  } catch {
    return false
  }
}

export default async function CallPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ url?: string; doctor?: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const session = await getSession()
  if (!session) {
    redirect(`/${locale}/login`)
  }

  const { url, doctor } = await searchParams

  if (!url || !isValidDailyUrl(url)) {
    redirect(`/${locale}/portal`)
  }

  return (
    <VideoCallFrame
      roomUrl={url}
      doctorName={doctor ?? 'your doctor'}
    />
  )
}
