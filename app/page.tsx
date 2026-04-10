import { redirect } from 'next/navigation'

// Middleware redirects / → /en before this runs.
// This is a compile-time fallback only.
export default function RootPage() {
  redirect('/en')
}
