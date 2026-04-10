// app/portal/page.tsx — Patient Portal
// Phase 2: Requires authentication. Placeholder for Phase 1.

export default function PortalPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">Patient Portal</h1>
      <p className="text-gray-500 mb-8">
        View and manage your appointments, and update your profile.
      </p>

      {/* Phase 1 placeholder — replace with authenticated content in Phase 2 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <p className="text-blue-700 font-medium">
          Patient portal coming in Phase 2.
        </p>
        <p className="text-blue-500 text-sm mt-1">
          Authentication and appointment management will be available soon.
        </p>
      </div>
    </main>
  )
}
