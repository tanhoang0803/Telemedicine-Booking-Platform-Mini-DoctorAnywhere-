// app/doctors/page.tsx — Doctor Directory Page
// Phase 1: Static doctor list with mock data

import DoctorCard from '@/components/doctors/DoctorCard'

const MOCK_DOCTORS = [
  {
    id: '1',
    name: 'Dr. Nguyen Van A',
    specialty: 'General Practitioner',
    bio: 'Experienced in telemedicine consultations for common illnesses and preventive care.',
    photo: '/images/doctor-placeholder.svg',
    availableDays: ['Mon', 'Wed', 'Fri'],
    languages: ['vi', 'en'] as ('vi' | 'en')[],
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Dr. Tran Thi B',
    specialty: 'Pediatrics',
    bio: 'Specialist in child health and development, with 10+ years of clinical experience.',
    photo: '/images/doctor-placeholder.svg',
    availableDays: ['Tue', 'Thu'],
    languages: ['vi'] as ('vi' | 'en')[],
    rating: 4.9,
  },
]

export default function DoctorsPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">Our Doctors</h1>
      <p className="text-gray-500 mb-8">
        Browse our qualified medical professionals and book a consultation.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_DOCTORS.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </main>
  )
}
