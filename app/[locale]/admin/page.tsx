import { setRequestLocale } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import AdminDashboard from '@/components/admin/AdminDashboard'

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'vi' }]
}

async function verifyAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_session')?.value
    if (!token) return false
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] })
    return payload.role === 'admin'
  } catch {
    return false
  }
}

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const isAdmin = await verifyAdminSession()
  if (!isAdmin) {
    redirect(`/${locale}/admin/login`)
  }

  return (
    <main className="min-h-[80vh] bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-xs text-gray-500">Mini-DoctorAnywhere · Appointment Management</p>
          </div>
          <AdminDashboard.LogoutButton />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <AdminDashboard />
      </div>
    </main>
  )
}
